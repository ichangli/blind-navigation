import json
from collections import Counter
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import get_settings
from ..database import get_db
from ..deps import get_current_user
from ..seed import ensure_user_defaults
from ..services.amap import AmapError, distance_to_route_m, geocode, walking_route
from ..services.geoscene_route import GeoSceneRouteError, is_gcj02_in_futian, solve_accessible_route
from ..services.support_data import facilities_along_route, nearby_bus_stops, recommended_metro_entrance
from ..services.mock_loader import load_mobile_config, load_mobile_mock
from ..services.event_cleanup import delete_event_photo
from ..services.report_parser import parse_report_text
from ..time_utils import format_local, local_iso, local_now, utc_now_naive


router = APIRouter(prefix="/api/mobile", tags=["mobile"])

FUTIAN_DEMO_LON = 114.055
FUTIAN_DEMO_LAT = 22.535


def resolve_futian_mobile_location(
    lon: float | None,
    lat: float | None,
) -> tuple[float, float, bool]:
    """Keep the competition demo inside the published Futian service area."""
    if lon is None or lat is None or not is_gcj02_in_futian(lon, lat):
        return FUTIAN_DEMO_LON, FUTIAN_DEMO_LAT, True
    return lon, lat, False


def _route_payload(route: models.FavoriteRoute) -> dict:
    return {
        "id": route.id,
        "icon": route.icon,
        "name": route.name,
        "detail": route.detail,
        "dest": route.destination,
        "destination": route.destination,
    }


def _settings_payload(setting: models.UserSetting) -> dict:
    config = load_mobile_config().get("profile", {}).get("settings", {})
    defaults = {
        "speed": setting.speed,
        "volume": setting.volume,
        "vibration": setting.vibration,
        "voiceType": setting.voice_type,
        "toggles": {
            "nav_blind_lane": setting.nav_blind_lane,
            "nav_avoid_construction": setting.nav_avoid_construction,
            "nav_avoid_stairs": setting.nav_avoid_stairs,
            "nav_auto_reroute": setting.nav_auto_reroute,
            "ui_large_font": setting.ui_large_font,
            "ui_high_contrast": setting.ui_high_contrast,
            "ui_screen_reader": setting.ui_screen_reader,
            "ui_key_sound": setting.ui_key_sound,
        },
    }
    return {
        "speed": setting.speed,
        "volume": setting.volume,
        "vibration": setting.vibration,
        "voice_type": setting.voice_type,
        "voiceType": setting.voice_type,
        "nav_blind_lane": setting.nav_blind_lane,
        "nav_avoid_construction": setting.nav_avoid_construction,
        "nav_avoid_stairs": setting.nav_avoid_stairs,
        "nav_auto_reroute": setting.nav_auto_reroute,
        "ui_large_font": setting.ui_large_font,
        "ui_high_contrast": setting.ui_high_contrast,
        "ui_screen_reader": setting.ui_screen_reader,
        "ui_key_sound": setting.ui_key_sound,
        "voiceTypes": config.get("voiceTypes", ["温柔女声", "沉稳男声", "清晰女声", "标准女声"]),
        "defaults": defaults,
    }


def _get_or_create_settings(db: Session, user: models.User) -> models.UserSetting:
    ensure_user_defaults(db, user)
    setting = db.get(models.UserSetting, user.id)
    if not setting:
        raise HTTPException(status_code=500, detail="Unable to create user settings")
    return setting


@router.get("/weather")
def weather() -> dict:
    return {
        "weather": "深圳福田 · 今日晴 31°C",
        "riskLevel": "normal",
        "travelTip": "天气晴好，注意高温时段补水，优先选择有盲道和遮阴的人行路线",
        "voiceTip": "今日晴，气温较高，建议避开正午长距离步行",
    }


@router.get("/home")
def home(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    ensure_user_defaults(db, user)
    data = dict(load_mobile_mock().get("home", {}))
    routes = (
        db.query(models.FavoriteRoute)
        .filter(models.FavoriteRoute.user_id == user.id)
        .order_by(models.FavoriteRoute.created_at.asc())
        .all()
    )
    data["favoriteRoutes"] = [_route_payload(route) for route in routes]
    return data


@router.get("/navigation/status")
def navigation_status(_: models.User = Depends(get_current_user)) -> dict:
    return load_mobile_mock().get("navigation", {})


@router.get("/navigation/map-config")
def navigation_map_config(_: models.User = Depends(get_current_user)) -> dict:
    settings = get_settings()
    if not settings.amap_js_key or not settings.amap_js_security_code:
        raise HTTPException(status_code=503, detail="未配置高德 JS API")
    return {
        "provider": "amap-js",
        "key": settings.amap_js_key,
        "securityJsCode": settings.amap_js_security_code,
        "version": "2.0",
    }


def _format_distance(meters: int | float) -> str:
    meters = max(0, int(meters))
    return f"{meters / 1000:.1f}km" if meters >= 1000 else f"{meters}m"


def _format_duration(seconds: int | float) -> str:
    minutes = max(1, round(float(seconds) / 60))
    return f"{minutes}分钟"


def _add_accessibility_risk(response: dict, db: Session) -> dict:
    route = response.get("route") or []
    active_events = (
        db.query(models.Event)
        .filter(models.Event.status.notin_(["已修复", "已驳回"]))
        .all()
    )
    priority_weight = {"高": 14, "中": 9, "低": 5}
    type_weight = {"施工占道": 6, "盲道损坏": 5, "盲道被占": 4, "路口无提示": 5}
    risks = []
    deduction = 0
    for event in active_events:
        distance = distance_to_route_m(event.lon, event.lat, route)
        if distance > 40:
            continue
        penalty = priority_weight.get(event.priority, 7) + type_weight.get(event.type, 3)
        if distance > 20:
            penalty = max(3, round(penalty * 0.65))
        deduction += penalty
        risks.append({
            "eventId": event.id,
            "type": event.type,
            "priority": event.priority,
            "status": event.status,
            "address": event.address or event.landmark,
            "lon": event.lon,
            "lat": event.lat,
            "distanceToRouteMeters": round(distance),
            "penalty": penalty,
        })
    risks.sort(key=lambda item: (item["distanceToRouteMeters"], -item["penalty"]))
    score = max(0, 100 - min(70, deduction))
    response["accessibility"] = {
        "score": score,
        "level": "推荐" if score >= 85 else "谨慎通行" if score >= 65 else "建议绕行",
        "riskCount": len(risks),
        "risks": risks,
        "summary": "路线附近暂无未解决障碍" if not risks else f"路线40米内发现{len(risks)}个未解决障碍",
        "scoringVersion": "v1-event-risk",
    }
    return response


@router.post("/navigation/plan")
def navigation_plan(
    payload: schemas.NavigationPlanRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    ordinary_response = None
    try:
        origin_name = payload.origin.strip() or "当前位置"
        if payload.origin_lon is not None and payload.origin_lat is not None:
            origin_lon, origin_lat = payload.origin_lon, payload.origin_lat
            origin_address = origin_name
        elif origin_name not in {"当前位置", "我的位置"}:
            origin_lon, origin_lat, origin_address = geocode(origin_name)
        else:
            origin_lon, origin_lat = payload.lon, payload.lat
            origin_address = "当前位置"
        if payload.destination_lon is None or payload.destination_lat is None:
            destination_lon, destination_lat, destination_address = geocode(payload.destination)
        else:
            destination_lon, destination_lat = payload.destination_lon, payload.destination_lat
            destination_address = payload.destination
        response = solve_accessible_route(
            origin_lon,
            origin_lat,
            payload.destination,
            destination_lon,
            destination_lat,
        )
        response["origin"] = origin_name
        response["originAddress"] = origin_address
        response["originLocation"] = {"lon": origin_lon, "lat": origin_lat}
        response["destinationAddress"] = destination_address
        try:
            ordinary_response = walking_route(
                origin_lon, origin_lat, payload.destination, destination_lon, destination_lat
            )
        except AmapError:
            ordinary_response = None
    except AmapError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except GeoSceneRouteError as exc:
        try:
            response = walking_route(
                origin_lon,
                origin_lat,
                payload.destination,
                destination_lon,
                destination_lat,
            )
            response["provider"] = "amap-walking-fallback"
            response["fallbackReason"] = str(exc)
            response["origin"] = origin_name
            response["originAddress"] = origin_address
            response["originLocation"] = {"lon": origin_lon, "lat": origin_lat}
        except AmapError as fallback_exc:
            raise HTTPException(
                status_code=502,
                detail=f"无障碍路线求解失败：{exc}；普通步行路线也不可用：{fallback_exc}",
            ) from fallback_exc
    response = _add_accessibility_risk(response, db)
    response["distance"] = _format_distance(response.get("distanceMeters", 0))
    response["duration"] = _format_duration(response.get("durationSeconds", 0))
    facilities = facilities_along_route(response.get("route") or [])
    response["nearbyFacilities"] = facilities
    response["facilitySummary"] = dict(Counter(item["categoryLabel"] for item in facilities))
    response["recommendedMetroEntrance"] = recommended_metro_entrance(
        facilities, response.get("destinationLocation")
    )
    if ordinary_response is not None:
        ordinary_response = _add_accessibility_risk(ordinary_response, db)
        ordinary_response["distance"] = _format_distance(ordinary_response.get("distanceMeters", 0))
        ordinary_response["duration"] = _format_duration(ordinary_response.get("durationSeconds", 0))
        ordinary_response["origin"] = response.get("origin", origin_name)
        ordinary_response["originAddress"] = response.get("originAddress", origin_address)
        ordinary_response["nearbyFacilities"] = facilities_along_route(ordinary_response.get("route") or [])
        safe_option = {key: value for key, value in response.items() if key not in {"routeOptions", "comparison"}}
        ordinary_option = dict(ordinary_response)
        response["routeOptions"] = [safe_option, ordinary_option]
        response["comparison"] = {
            "safeDistanceMeters": response.get("distanceMeters", 0),
            "ordinaryDistanceMeters": ordinary_response.get("distanceMeters", 0),
            "extraDistanceMeters": response.get("distanceMeters", 0) - ordinary_response.get("distanceMeters", 0),
            "safeDurationSeconds": response.get("durationSeconds", 0),
            "ordinaryDurationSeconds": ordinary_response.get("durationSeconds", 0),
            "safeScore": (response.get("accessibility") or {}).get("score"),
            "ordinaryScore": (ordinary_response.get("accessibility") or {}).get("score"),
            "recommendation": "优先推荐 GeoScene 无障碍安全路线",
        }
    db.add(
        models.NavigationHistory(
            user_id=user.id,
            origin=origin_name,
            destination=payload.destination,
            route_json=json.dumps(response, ensure_ascii=False),
        )
    )
    db.commit()
    return response


@router.post("/navigation/reroute")
def navigation_reroute(
    payload: schemas.RerouteRequest,
    _: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    try:
        if payload.destination_lon is None or payload.destination_lat is None:
            destination_lon, destination_lat, _ = geocode(payload.destination)
        else:
            destination_lon, destination_lat = payload.destination_lon, payload.destination_lat
        response = solve_accessible_route(
            payload.lon, payload.lat, payload.destination, destination_lon, destination_lat
        )
    except AmapError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except GeoSceneRouteError as exc:
        try:
            response = walking_route(
                payload.lon, payload.lat, payload.destination, destination_lon, destination_lat
            )
            response["provider"] = "amap-walking-fallback"
            response["fallbackReason"] = str(exc)
        except AmapError as fallback_exc:
            raise HTTPException(status_code=502, detail=f"重新规划失败：{exc}；{fallback_exc}") from fallback_exc
    response = _add_accessibility_risk(response, db)
    response.update({
        "distance": _format_distance(response.get("distanceMeters", 0)),
        "duration": _format_duration(response.get("durationSeconds", 0)),
        "reason": payload.reason,
        "voiceTip": f"{payload.reason}，已重新规划路线。{response['instructions'][0]}",
    })
    return response


@router.get("/bus/realtime")
def bus_realtime(
    lon: float | None = None,
    lat: float | None = None,
    limit: int = 5,
    _: models.User = Depends(get_current_user),
) -> dict:
    query_lon, query_lat, using_demo_location = resolve_futian_mobile_location(lon, lat)
    outside_coverage = lon is not None and lat is not None and using_demo_location
    return {
        "title": "无障碍公交接驳",
        "subtitle": "福田真实公交站 · 步行接驳 · 模拟提醒",
        "mode": "nearby-stops",
        "realtime": False,
        "location": {
            "lon": query_lon,
            "lat": query_lat,
            "source": "demo-outside-coverage" if outside_coverage else "demo" if using_demo_location else "device",
            "label": "福田中心演示点（购物公园）" if using_demo_location else "当前位置",
        },
        "stops": nearby_bus_stops(query_lon, query_lat, limit=limit),
        "notice": (
            "当前位置不在福田数据范围，已切换到购物公园演示点。"
            if outside_coverage
            else "站点与距离来自真实空间数据；车辆到站提醒为比赛模拟演示。"
        ),
    }


@router.post("/report/recognize")
def recognize_report(
    payload: schemas.RecognizeRequest,
    _: models.User = Depends(get_current_user),
) -> dict:
    return parse_report_text(payload.text, payload.lon, payload.lat)


def _next_event_id(db: Session) -> str:
    prefix = local_now().strftime("E%Y%m%d")
    existing_ids = (
        db.query(models.Event.id)
        .filter(models.Event.id.like(f"{prefix}%"))
        .all()
    )
    suffixes = []
    for (event_id,) in existing_ids:
        suffix = event_id[len(prefix):]
        if suffix.isdigit():
            suffixes.append(int(suffix))
    return f"{prefix}{max(suffixes, default=0) + 1:03d}"


def _priority_for_type(event_type: str) -> str:
    if event_type in {"盲道被占", "盲道缺失"}:
        return "高"
    if event_type == "盲道损坏":
        return "中"
    return "中"


def _save_upload(event_id: str, photo: UploadFile | None) -> str | None:
    if not photo or not photo.filename:
        return None
    suffix = Path(photo.filename).suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        suffix = ".jpg"
    settings = get_settings()
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    file_path = settings.upload_path / f"{event_id}{suffix}"
    with file_path.open("wb") as f:
        f.write(photo.file.read())
    return f"/uploads/{file_path.name}"


@router.post("/report")
async def submit_report(
    request: Request,
    type: str | None = Form(default=None),
    description: str | None = Form(default=None),
    lon: float | None = Form(default=None),
    lat: float | None = Form(default=None),
    district: str | None = Form(default=None),
    address: str | None = Form(default=None),
    landmark: str | None = Form(default=None),
    report_method: str | None = Form(default=None),
    photo: UploadFile | None = File(default=None),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    content_type = request.headers.get("content-type", "")
    if content_type.startswith("application/json"):
        payload = await request.json()
        type = payload.get("type", type)
        description = payload.get("description", description)
        lon = payload.get("lon", lon)
        lat = payload.get("lat", lat)
        district = payload.get("district", district)
        address = payload.get("address", address)
        landmark = payload.get("landmark", landmark)
        report_method = payload.get("report_method", payload.get("reportMethod", report_method))

    if not type or not description:
        raise HTTPException(status_code=400, detail="type and description are required")
    if lon is None or lat is None:
        parsed = parse_report_text(description)
        lon = parsed["lon"]
        lat = parsed["lat"]
        landmark = landmark or parsed["landmark"]

    event_id = _next_event_id(db)
    photo_url = _save_upload(event_id, photo)
    submitted_at = utc_now_naive()
    event = models.Event(
        id=event_id,
        type=type,
        description=description,
        lon=float(lon),
        lat=float(lat),
        district=district or "福田区",
        address=address or "福华路",
        landmark=landmark or "附近道路",
        photo_url=photo_url,
        status="待审核",
        priority=_priority_for_type(type),
        reporter_id=user.id,
        reporter_name=user.username,
        reporter_type="普通用户",
        report_method=report_method or "语音一键上报 (M-11)",
        created_at=submitted_at,
        updated_at=submitted_at,
    )
    db.add(event)
    db.commit()
    return {
        "eventId": event.id,
        "status": event.status,
        "photoUrl": event.photo_url,
        "blurred": False,
        "coordinateSystem": "GCJ-02",
        "type": event.type,
        "description": event.description,
        "location": event.landmark or event.address,
        "coords": f"{event.lon:.5f}, {event.lat:.5f}",
        "submittedAt": local_iso(event.created_at),
    }


@router.get("/report/history")
def report_history(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[dict]:
    events = (
        db.query(models.Event)
        .filter(models.Event.reporter_id == user.id)
        .order_by(models.Event.created_at.desc())
        .all()
    )
    return [
        {
            "date": format_local(event.created_at, "%m-%d"),
            "dateTime": format_local(event.created_at, "%m-%d %H:%M"),
            "submittedAt": local_iso(event.created_at),
            "desc": event.description[:24] or event.type,
            "description": event.description,
            "type": event.type,
            "location": event.landmark or event.address,
            "status": event.status,
            "eventId": event.id,
            "photoUrl": event.photo_url,
            "canDelete": True,
        }
        for event in events
    ]


@router.delete("/report/{event_id}")
def delete_own_report(
    event_id: str,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    event = (
        db.query(models.Event)
        .filter(models.Event.id == event_id, models.Event.reporter_id == user.id)
        .first()
    )
    if not event:
        # Do not reveal whether another user's event exists.
        raise HTTPException(status_code=404, detail="未找到可删除的本人上报记录")

    photo_url = event.photo_url
    db.delete(event)
    db.commit()
    photo_deleted = delete_event_photo(photo_url)
    return {
        "deletedEventId": event_id,
        "deleted": True,
        "photoDeleted": photo_deleted,
    }


@router.get("/user/profile")
def user_profile(user: models.User = Depends(get_current_user)) -> dict:
    return {
        "username": user.username,
        "defaultName": "视障用户",
        "city": "深圳",
        "role": "管理员" if user.role == "admin" else "普通用户",
        "version": "v1.0.0",
        "company": "GeoScene · 深圳福田",
    }


@router.get("/user/routes")
def get_routes(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[dict]:
    ensure_user_defaults(db, user)
    routes = (
        db.query(models.FavoriteRoute)
        .filter(models.FavoriteRoute.user_id == user.id)
        .order_by(models.FavoriteRoute.created_at.asc())
        .all()
    )
    return [_route_payload(route) for route in routes]


@router.post("/user/routes")
def create_route(
    payload: schemas.FavoriteRouteCreate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    route = models.FavoriteRoute(
        user_id=user.id,
        icon=payload.icon,
        name=payload.name,
        detail=payload.detail,
        destination=payload.destination,
    )
    db.add(route)
    db.commit()
    db.refresh(route)
    return _route_payload(route)


@router.get("/user/settings")
def get_settings_api(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    setting = _get_or_create_settings(db, user)
    return _settings_payload(setting)


@router.put("/user/settings")
def update_settings(
    payload: schemas.UserSettingsUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    setting = _get_or_create_settings(db, user)
    data = payload.model_dump(exclude_unset=True)
    toggle_data = data.pop("toggles", None) or {}
    if "voiceType" in data:
        setting.voice_type = data.pop("voiceType")
    if "voice_type" in data:
        setting.voice_type = data.pop("voice_type")
    for field in ["speed", "volume", "vibration"]:
        if field in data and data[field] is not None:
            setattr(setting, field, data[field])
    for field in [
        "nav_blind_lane",
        "nav_avoid_construction",
        "nav_avoid_stairs",
        "nav_auto_reroute",
        "ui_large_font",
        "ui_high_contrast",
        "ui_screen_reader",
        "ui_key_sound",
    ]:
        value = data.get(field, toggle_data.get(field))
        if value is not None:
            setattr(setting, field, bool(value))
    db.commit()
    db.refresh(setting)
    return _settings_payload(setting)


@router.get("/perception")
def perception(_: models.User = Depends(get_current_user)) -> dict:
    return load_mobile_mock().get("profile", {}).get("perception", {})


@router.post("/perception")
def submit_perception(
    payload: dict,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    obstacle = payload.get("obstacle", {})
    quality = payload.get("blindLaneQuality", {})
    should_create = obstacle.get("type") == "danger" or quality.get("score", 10) < 5
    event_id = None
    if should_create:
        event_id = _next_event_id(db)
        event = models.Event(
            id=event_id,
            type="盲道损坏",
            description=quality.get("label") or obstacle.get("label") or "AI 环境感知发现盲道风险",
            lon=float(payload.get("lon", 114.0550)),
            lat=float(payload.get("lat", 22.5350)),
            district=payload.get("district", "福田区"),
            address=payload.get("address", "福华路"),
            landmark=payload.get("landmark", "附近道路"),
            status="待审核",
            priority="高",
            reporter_id=user.id,
            reporter_name=user.username,
            report_method="AI 环境感知",
        )
        db.add(event)
        db.commit()
    return {"createdEvent": bool(event_id), "eventId": event_id}
