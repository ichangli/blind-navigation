from collections import Counter
from datetime import timedelta
import math

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import get_settings
from ..database import get_db
from ..deps import get_optional_current_user, require_admin
from ..services.geoscene import get_map_config
from ..services.geoscene_route import GeoSceneRouteError, gcj02_to_wgs84, solve_web_accessible_route
from ..services.event_cleanup import delete_event_photo
from ..services.mock_loader import load_web_mock
from ..services.building_semantics import (
    BuildingCatalogUnavailable,
    identify_building,
    load_building_semantics,
)
from ..services.support_data import load_web_map_context
from ..time_utils import local_iso, local_now, local_to_utc_naive, to_local, utc_now_naive


router = APIRouter(prefix="/api/web", tags=["web"])
VALID_STATUSES = {"待审核", "处理中", "已修复", "驳回"}
MAP_CENTER_LON = 114.0550
MAP_CENTER_LAT = 22.5350
SCENE_PROXY_RESPONSE_HEADERS = {
    "accept-ranges",
    "cache-control",
    "content-encoding",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "expires",
    "last-modified",
    "vary",
}
SCENE_PROXY_REQUEST_HEADERS = {
    "accept",
    "accept-encoding",
    "content-type",
    "if-modified-since",
    "if-none-match",
    "range",
}
_scene_proxy_client: httpx.AsyncClient | None = None


def _get_scene_proxy_client() -> httpx.AsyncClient:
    global _scene_proxy_client
    if _scene_proxy_client is None:
        settings = get_settings()
        _scene_proxy_client = httpx.AsyncClient(
            verify=settings.geoscene_verify_ssl,
            follow_redirects=True,
            timeout=httpx.Timeout(60.0, connect=15.0),
            limits=httpx.Limits(max_connections=32, max_keepalive_connections=16),
        )
    return _scene_proxy_client


async def close_scene_proxy_client() -> None:
    global _scene_proxy_client
    if _scene_proxy_client is not None:
        await _scene_proxy_client.aclose()
        _scene_proxy_client = None


async def _stream_geoscene_service(
    request: Request,
    upstream_base: str,
    resource_path: str,
    service_name: str,
) -> StreamingResponse:
    if not upstream_base:
        raise HTTPException(status_code=404, detail=f"{service_name} service is not configured")
    if any(part == ".." for part in resource_path.split("/")):
        raise HTTPException(status_code=400, detail=f"Invalid {service_name} resource path")

    upstream_url = upstream_base
    if resource_path:
        upstream_url += "/" + resource_path.lstrip("/")
    if request.url.query:
        upstream_url += "?" + request.url.query

    forwarded_headers = {
        name: value
        for name, value in request.headers.items()
        if name.lower() in SCENE_PROXY_REQUEST_HEADERS
    }
    client = _get_scene_proxy_client()
    body = await request.body() if request.method not in {"GET", "HEAD"} else None
    upstream_request = client.build_request(
        request.method,
        upstream_url,
        headers=forwarded_headers,
        content=body,
    )
    try:
        upstream_response = await client.send(upstream_request, stream=True)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"{service_name} upstream is unavailable") from exc

    response_headers = {
        name: value
        for name, value in upstream_response.headers.items()
        if name.lower() in SCENE_PROXY_RESPONSE_HEADERS
    }

    async def iter_upstream():
        try:
            async for chunk in upstream_response.aiter_raw():
                yield chunk
        finally:
            await upstream_response.aclose()

    return StreamingResponse(
        iter_upstream(),
        status_code=upstream_response.status_code,
        headers=response_headers,
    )


@router.get("/map/scene")
@router.get("/map/scene/{resource_path:path}")
async def scene_layer_proxy(request: Request, resource_path: str = "") -> StreamingResponse:
    """Stream the configured I3S SceneServer through the API origin."""
    upstream_base = get_settings().geoscene_building_layer_url.rstrip("/")
    return await _stream_geoscene_service(
        request,
        upstream_base,
        resource_path,
        "SceneLayer",
    )


@router.get("/map/basemap")
@router.get("/map/basemap/{resource_path:path}")
async def basemap_vector_tile_proxy(
    request: Request, resource_path: str = ""
) -> StreamingResponse:
    """Stream the configured GeoScene VectorTileServer through the API origin."""
    upstream_base = get_settings().geoscene_basemap_vector_tile_url.rstrip("/")
    return await _stream_geoscene_service(
        request,
        upstream_base,
        resource_path,
        "VectorBasemap",
    )


@router.get("/map/water")
@router.get("/map/water/{resource_path:path}")
@router.post("/map/water")
@router.post("/map/water/{resource_path:path}")
async def showcase_water_proxy(
    request: Request, resource_path: str = ""
) -> StreamingResponse:
    """Stream the configured showcase water FeatureServer through the API origin."""
    upstream_base = (
        get_settings().geoscene_showcase_water_featureserver_url.rstrip("/")
    )
    return await _stream_geoscene_service(
        request,
        upstream_base,
        resource_path,
        "ShowcaseWater",
    )


@router.get("/map/roads")
@router.get("/map/roads/{resource_path:path}")
@router.post("/map/roads")
@router.post("/map/roads/{resource_path:path}")
async def road_network_proxy(request: Request, resource_path: str = "") -> StreamingResponse:
    """Stream the configured Futian road MapServer through the API origin."""
    settings = get_settings()
    upstream_base = (
        getattr(settings, "geoscene_road_visual_mapserver_url", "").strip()
        or settings.geoscene_route_mapserver_url.strip()
    ).rstrip("/")
    return await _stream_geoscene_service(
        request,
        upstream_base,
        resource_path,
        "RoadNetwork",
    )


def _event_reporter(event: models.Event) -> str:
    if event.reporter_name:
        return event.reporter_name
    if event.reporter:
        return event.reporter.username
    return "匿名用户"


def _event_local_datetime(event: models.Event):
    # Seeded demonstration events predate the UTC storage policy and have no reporter_id.
    # User-created events are stored in UTC and must be converted for display.
    if event.reporter_id is None:
        return event.created_at
    return to_local(event.created_at)


def _format_event_time(event: models.Event, pattern: str) -> str:
    return _event_local_datetime(event).strftime(pattern)


def _event_web_coordinates(event: models.Event) -> tuple[float, float]:
    """Return WGS84 coordinates for GeoScene and every Web event payload.

    Seed events are authored in WGS84 and do not have a reporter relation. Events
    created by the mobile client have a reporter and arrive in GCJ-02 so that the
    same values can be used by AMap on the mobile side.
    """
    lon = float(event.lon)
    lat = float(event.lat)
    if event.reporter_id is not None:
        return gcj02_to_wgs84(lon, lat)
    return lon, lat


def _event_row(event: models.Event, is_admin: bool) -> dict:
    lon, lat = _event_web_coordinates(event)
    return {
        "id": event.id,
        "type": event.type,
        "coords": f"{lon:.3f},{lat:.3f}",
        "lon": lon,
        "lat": lat,
        "district": event.district,
        "address": event.address,
        "landmark": event.landmark,
        "priority": event.priority,
        "reporter": _event_reporter(event),
        "time": _format_event_time(event, "%m-%d %H:%M"),
        "status": event.status,
        "canAudit": is_admin and event.status == "待审核",
        "canUpdate": is_admin and event.status == "处理中",
        "canDelete": is_admin,
        "detailPage": True,
    }


def _event_detail(event: models.Event, is_admin: bool = False) -> dict:
    lon, lat = _event_web_coordinates(event)
    return {
        "id": event.id,
        "type": event.type,
        "status": event.status,
        "reporter": _event_reporter(event),
        "reporterType": event.reporter_type,
        "coords": f"{lon:.3f}, {lat:.3f}",
        "lon": lon,
        "lat": lat,
        "district": event.district,
        "address": event.address,
        "landmark": event.landmark,
        "priority": event.priority,
        "sla": "48小时内响应" if event.priority == "高" else "72小时内响应",
        "reportTime": _format_event_time(event, "%Y-%m-%d %H:%M"),
        "description": event.description,
        "reportMethod": event.report_method,
        "photoUrl": event.photo_url,
        "canAudit": is_admin and event.status == "待审核",
        "canUpdate": is_admin and event.status == "处理中",
        "canDelete": is_admin,
    }


@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)) -> list[dict]:
    now = local_now()
    month_start = local_to_utc_naive(now.replace(day=1, hour=0, minute=0, second=0, microsecond=0))
    pending = db.query(models.Event).filter(models.Event.status.in_(["待审核", "处理中"])).count()
    high_pending = (
        db.query(models.Event)
        .filter(models.Event.status.in_(["待审核", "处理中"]), models.Event.priority == "高")
        .count()
    )
    month_count = db.query(models.Event).filter(models.Event.created_at >= month_start).count()
    return [
        {
            "icon": "📏",
            "iconBg": "rgba(0,212,255,0.13)",
            "value": "18.6",
            "unit": "km",
            "label": "示范区盲道里程 (W-06)",
            "change": "深圳福田中心区",
            "changeColor": "success",
            "action": "events",
        },
        {
            "icon": "✅",
            "iconBg": "rgba(46,204,113,0.13)",
            "value": "86.4%",
            "unit": "",
            "label": "盲道可通行率 (W-02)",
            "change": "福田中心区示范数据",
            "changeColor": "success",
            "action": "toast",
            "actionMsg": "福田中心区盲道可通行率：86.4%",
        },
        {
            "icon": "⚠️",
            "iconBg": "rgba(255,69,96,0.13)",
            "value": str(pending),
            "unit": "",
            "label": "待处理盲道事件 (W-06)",
            "change": f"高风险: {high_pending}",
            "changeColor": "danger" if high_pending else "success",
            "action": "events",
        },
        {
            "icon": "📈",
            "iconBg": "rgba(168,85,247,0.13)",
            "value": str(month_count),
            "unit": "",
            "label": "本月无障碍上报 (W-06)",
            "change": "移动端实时入库",
            "changeColor": "success",
            "action": "charts",
        },
    ]


@router.get("/map/config")
def map_config() -> dict:
    return get_map_config()


@router.post("/map/navigation/solve")
def solve_web_navigation(payload: schemas.WebNavigationSolveRequest) -> dict:
    try:
        return solve_web_accessible_route(
            payload.origin.lon,
            payload.origin.lat,
            payload.destination.lon,
            payload.destination.lat,
        )
    except GeoSceneRouteError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/map/facilities")
def map_facilities() -> dict:
    """Return WGS84 transit and accessibility-support points for the Web scene."""
    return load_web_map_context()


@router.get("/map/building-semantics")
def map_building_semantics() -> dict:
    """Return a client-side semantic shell overlay for facility-linked buildings."""
    return load_building_semantics()


@router.get("/map/buildings/identify")
def map_building_identify(
    longitude: float = Query(..., ge=-180.0, le=180.0),
    latitude: float = Query(..., ge=-90.0, le=90.0),
) -> dict:
    """Return attributes for the visible white-model building at a WGS84 point."""
    if (
        not math.isfinite(longitude)
        or not math.isfinite(latitude)
        or not -180.0 <= longitude <= 180.0
        or not -90.0 <= latitude <= 90.0
    ):
        raise HTTPException(status_code=422, detail="Invalid WGS84 coordinates")
    try:
        return identify_building(longitude, latitude)
    except BuildingCatalogUnavailable as exc:
        raise HTTPException(status_code=503, detail="建筑属性数据暂不可用") from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


def _map_dot_type(event_type: str) -> str:
    if event_type == "盲道被占":
        return "danger"
    if event_type == "盲道损坏":
        return "warning"
    if event_type == "盲道缺失":
        return "muted"
    return "muted"


def _map_position(event: models.Event, index: int) -> tuple[int, int]:
    lon, lat = _event_web_coordinates(event)
    left = int(260 + (lon - MAP_CENTER_LON) * 50000)
    top = int(210 - (lat - MAP_CENTER_LAT) * 50000)
    if left < 40 or left > 470 or top < 70 or top > 340:
        left = 90 + (index * 70) % 360
        top = 110 + (index * 45) % 220
    return top, left


@router.get("/map/data")
def map_data(db: Session = Depends(get_db)) -> dict:
    data = dict(load_web_mock().get("dashboard", {}).get("map", {}))
    data.pop("heatmap", None)
    data["viewTabs"] = ["城市总览", "无障碍专题", "公共交通", "服务设施"]
    events = db.query(models.Event).order_by(models.Event.created_at.desc()).all()
    data["events"] = []
    for index, event in enumerate(events):
        top, left = _map_position(event, index)
        lon, lat = _event_web_coordinates(event)
        data["events"].append(
            {
                "top": top,
                "left": left,
                "type": _map_dot_type(event.type),
                "id": event.id,
                "title": event.type,
                "location": event.landmark or event.address or event.district,
                "lon": lon,
                "lat": lat,
                "status": event.status,
                "priority": event.priority,
                "reporter": _event_reporter(event),
                "time": _format_event_time(event, "%m-%d %H:%M"),
                "description": event.description,
            }
        )
    data["center"] = {"lon": "114.055°E", "lat": "22.535°N", "location": "深圳福田中心区示范区"}
    return data


@router.get("/events")
def list_events(
    type: str | None = Query(default=None),
    status: str | None = Query(default=None),
    keyword: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=200, ge=1, le=500),
    current_user: models.User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> list[dict]:
    query = db.query(models.Event)
    if type:
        query = query.filter(models.Event.type == type)
    if status:
        query = query.filter(models.Event.status == status)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            or_(
                models.Event.id.ilike(like),
                models.Event.district.ilike(like),
                models.Event.address.ilike(like),
                models.Event.landmark.ilike(like),
            )
        )
    events = (
        query.order_by(models.Event.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    is_admin = bool(current_user and current_user.role == "admin")
    return [_event_row(event, is_admin) for event in events]


@router.get("/events/{event_id}")
def get_event(
    event_id: str,
    current_user: models.User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> dict:
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="事件记录不存在")
    return _event_detail(event, bool(current_user and current_user.role == "admin"))


@router.patch("/events/{event_id}/status")
def update_event_status(
    event_id: str,
    payload: schemas.StatusUpdateRequest,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> dict:
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.status = payload.status
    event.updated_at = utc_now_naive()
    if payload.status == "已修复":
        event.resolved_at = utc_now_naive()
    db.commit()
    db.refresh(event)
    return {"id": event.id, "status": event.status, "updatedAt": local_iso(event.updated_at)}


@router.delete("/events/{event_id}")
def delete_event_as_admin(
    event_id: str,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> dict:
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="事件记录不存在")

    photo_url = event.photo_url
    db.delete(event)
    db.commit()
    photo_deleted = delete_event_photo(photo_url)
    return {
        "deletedEventId": event_id,
        "deleted": True,
        "photoDeleted": photo_deleted,
    }


def _trend_points(counts: list[int], start_x: int, step_x: int) -> str:
    max_count = max(counts) if counts else 1
    max_count = max(max_count, 1)
    points = []
    for index, count in enumerate(counts):
        x = start_x + index * step_x
        y = 220 - int((count / max_count) * 165)
        points.append(f"{x},{y}")
    return " ".join(points)


@router.get("/charts/trend")
def chart_trend(period: str = Query(default="day"), db: Session = Depends(get_db)) -> dict:
    now = local_now()
    if period == "week":
        buckets = 8
        labels = [f"W{(now - timedelta(weeks=buckets - 1 - i)).isocalendar().week}" for i in range(buckets)]
        counts = [0] * buckets
        for event in db.query(models.Event).all():
            delta = now.date() - _event_local_datetime(event).date()
            idx = buckets - 1 - (delta.days // 7)
            if 0 <= idx < buckets:
                counts[idx] += 1
        return {
            "title": "无障碍事件上报趋势 — 近8周 (W-11)",
            "points": _trend_points(counts, 70, 55),
            "labels": [{"x": 70 + i * 55, "y": 255, "label": label} for i, label in enumerate(labels)],
        }
    if period == "month":
        buckets = 6
        months = []
        counts = [0] * buckets
        for i in range(buckets):
            month = now.month - (buckets - 1 - i)
            year = now.year
            while month <= 0:
                month += 12
                year -= 1
            months.append((year, month))
        for event in db.query(models.Event).all():
            local_created_at = _event_local_datetime(event)
            key = (local_created_at.year, local_created_at.month)
            if key in months:
                counts[months.index(key)] += 1
        return {
            "title": "无障碍事件上报趋势 — 近6月 (W-11)",
            "points": _trend_points(counts, 70, 70),
            "labels": [{"x": 70 + i * 70, "y": 255, "label": f"{month}月"} for i, (_, month) in enumerate(months)],
        }

    buckets = 14
    days = [(now - timedelta(days=buckets - 1 - i)).date() for i in range(buckets)]
    counts = [0] * buckets
    for event in db.query(models.Event).all():
        day = _event_local_datetime(event).date()
        if day in days:
            counts[days.index(day)] += 1
    return {
        "title": "无障碍事件上报趋势 — 近14天 (W-11)",
        "points": _trend_points(counts, 60, 30),
        "labels": [
            {"x": 60 + i * 30, "y": 255, "label": f"{day.month}/{day.day:02d}"}
            for i, day in enumerate(days)
            if i in {0, 3, 6, 9, 13}
        ],
    }


@router.get("/charts/distribution")
def chart_distribution(db: Session = Depends(get_db)) -> dict:
    events = db.query(models.Event).all()
    counter = Counter(event.type for event in events)
    total = sum(counter.values())
    mapping = [
        ("被占", "盲道被占", "#ff4560"),
        ("损坏", "盲道损坏", "#f0a030"),
        ("缺失", "盲道缺失", "#5a6380"),
    ]
    segments = []
    for short, full, color in mapping:
        count = counter.get(full, 0)
        percent = f"{round((count / total) * 100) if total else 0}%"
        segments.append({"type": short, "percent": percent, "color": color})
    return {"total": total, "segments": segments}
