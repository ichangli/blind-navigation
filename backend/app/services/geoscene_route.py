from __future__ import annotations

import math
import json
from functools import lru_cache
from typing import Any

import httpx

from ..config import get_settings, resource_path


class GeoSceneRouteError(RuntimeError):
    """Raised when the published GeoScene network cannot return a route."""


BOUNDARY_PATH = resource_path("shenzhen_data/processed/futian_boundary.geojson")


@lru_cache(maxsize=1)
def _boundary_rings() -> list[list[list[float]]]:
    if not BOUNDARY_PATH.exists():
        return []
    data = json.loads(BOUNDARY_PATH.read_text(encoding="utf-8"))
    rings = []
    for feature in data.get("features") or []:
        geometry = feature.get("geometry") or {}
        coordinates = geometry.get("coordinates") or []
        if geometry.get("type") == "Polygon" and coordinates:
            rings.append(coordinates[0])
        elif geometry.get("type") == "MultiPolygon":
            rings.extend(polygon[0] for polygon in coordinates if polygon)
    return rings


def _point_in_ring(lon: float, lat: float, ring: list[list[float]]) -> bool:
    inside = False
    previous = ring[-1]
    for current in ring:
        x1, y1 = previous[:2]
        x2, y2 = current[:2]
        if (y1 > lat) != (y2 > lat):
            crossing_lon = (x2 - x1) * (lat - y1) / (y2 - y1) + x1
            if lon < crossing_lon:
                inside = not inside
        previous = current
    return inside


def _in_futian(lon: float, lat: float) -> bool:
    rings = _boundary_rings()
    return not rings or any(_point_in_ring(lon, lat, ring) for ring in rings)


def _friendly_solve_error(message: str) -> str:
    lower = message.lower()
    if "location" in lower or "cannot be located" in lower or "unlocated" in lower or "定位" in message:
        return "起点或目的地距离福田可通行路网过远，无法吸附到道路"
    if "no route" in lower or "route between" in lower or "无路径" in message or "无法找到" in message:
        return "起点和目的地所在道路暂不连通"
    return message


def _transform_lat(lon: float, lat: float) -> float:
    value = -100.0 + 2.0 * lon + 3.0 * lat + 0.2 * lat * lat + 0.1 * lon * lat
    value += 0.2 * math.sqrt(abs(lon))
    value += (20.0 * math.sin(6.0 * lon * math.pi) + 20.0 * math.sin(2.0 * lon * math.pi)) * 2.0 / 3.0
    value += (20.0 * math.sin(lat * math.pi) + 40.0 * math.sin(lat / 3.0 * math.pi)) * 2.0 / 3.0
    value += (160.0 * math.sin(lat / 12.0 * math.pi) + 320.0 * math.sin(lat * math.pi / 30.0)) * 2.0 / 3.0
    return value


def _transform_lon(lon: float, lat: float) -> float:
    value = 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lon * lat
    value += 0.1 * math.sqrt(abs(lon))
    value += (20.0 * math.sin(6.0 * lon * math.pi) + 20.0 * math.sin(2.0 * lon * math.pi)) * 2.0 / 3.0
    value += (20.0 * math.sin(lon * math.pi) + 40.0 * math.sin(lon / 3.0 * math.pi)) * 2.0 / 3.0
    value += (150.0 * math.sin(lon / 12.0 * math.pi) + 300.0 * math.sin(lon / 30.0 * math.pi)) * 2.0 / 3.0
    return value


def _outside_china(lon: float, lat: float) -> bool:
    return not (72.004 <= lon <= 137.8347 and 0.8293 <= lat <= 55.8271)


def wgs84_to_gcj02(lon: float, lat: float) -> tuple[float, float]:
    if _outside_china(lon, lat):
        return lon, lat
    a = 6378245.0
    ee = 0.00669342162296594323
    dlat = _transform_lat(lon - 105.0, lat - 35.0)
    dlon = _transform_lon(lon - 105.0, lat - 35.0)
    radlat = lat / 180.0 * math.pi
    magic = 1.0 - ee * math.sin(radlat) ** 2
    sqrt_magic = math.sqrt(magic)
    dlat = dlat * 180.0 / ((a * (1.0 - ee)) / (magic * sqrt_magic) * math.pi)
    dlon = dlon * 180.0 / (a / sqrt_magic * math.cos(radlat) * math.pi)
    return lon + dlon, lat + dlat


def gcj02_to_wgs84(lon: float, lat: float) -> tuple[float, float]:
    if _outside_china(lon, lat):
        return lon, lat
    guess_lon, guess_lat = lon, lat
    for _ in range(8):
        converted_lon, converted_lat = wgs84_to_gcj02(guess_lon, guess_lat)
        guess_lon -= converted_lon - lon
        guess_lat -= converted_lat - lat
    return guess_lon, guess_lat


def is_gcj02_in_futian(lon: float, lat: float) -> bool:
    """Return whether a GCJ-02 point is covered by the Futian demo network."""
    return _in_futian(*gcj02_to_wgs84(lon, lat))


def _haversine_m(a: tuple[float, float], b: tuple[float, float]) -> float:
    lon1, lat1 = map(math.radians, a)
    lon2, lat2 = map(math.radians, b)
    dlon, dlat = lon2 - lon1, lat2 - lat1
    value = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 12_742_000.0 * math.asin(math.sqrt(value))


def _route_length(points: list[tuple[float, float]]) -> int:
    return round(sum(_haversine_m(points[index - 1], points[index]) for index in range(1, len(points))))


def _bearing(a: tuple[float, float], b: tuple[float, float]) -> float:
    lon1, lat1 = map(math.radians, a)
    lon2, lat2 = map(math.radians, b)
    y = math.sin(lon2 - lon1) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(lon2 - lon1)
    return (math.degrees(math.atan2(y, x)) + 360.0) % 360.0


def _generic_instructions(points: list[tuple[float, float]], destination: str) -> list[str]:
    if len(points) < 2:
        return [f"沿无障碍推荐路线前往{destination}"]
    instructions = ["从当前位置出发，沿无障碍推荐路线前行"]
    last_bearing = _bearing(points[0], points[1])
    distance_since_turn = 0.0
    for index in range(2, len(points)):
        segment = _haversine_m(points[index - 1], points[index])
        distance_since_turn += segment
        if segment < 2:
            continue
        current = _bearing(points[index - 1], points[index])
        delta = (current - last_bearing + 540.0) % 360.0 - 180.0
        if abs(delta) >= 45 and distance_since_turn >= 15:
            direction = "右转" if delta > 0 else "左转"
            instructions.append(f"前行约{max(10, round(distance_since_turn / 10) * 10)}米后{direction}")
            distance_since_turn = 0.0
            last_bearing = current
        elif abs(delta) >= 20:
            last_bearing = current
    instructions.append(f"继续前行，到达{destination}")
    return instructions[:12]


def _solve_url() -> str:
    settings = get_settings()
    base = settings.geoscene_route_naserver_url.strip().rstrip("/")
    if not base:
        mapserver = settings.geoscene_route_mapserver_url.strip().rstrip("/")
        if mapserver:
            base = mapserver + "/exts/NAServer"
    if not base:
        raise GeoSceneRouteError("未配置 GeoScene 路径分析服务")
    return f"{base}/{settings.geoscene_route_layer_name}/solve"


def solve_accessible_route(
    origin_lon: float,
    origin_lat: float,
    destination: str,
    destination_lon: float,
    destination_lat: float,
) -> dict[str, Any]:
    settings = get_settings()
    origin_wgs = gcj02_to_wgs84(origin_lon, origin_lat)
    destination_wgs = gcj02_to_wgs84(destination_lon, destination_lat)
    if not is_gcj02_in_futian(origin_lon, origin_lat):
        raise GeoSceneRouteError("出发点不在福田无障碍路网服务范围内")
    if not is_gcj02_in_futian(destination_lon, destination_lat):
        raise GeoSceneRouteError("目的地不在福田无障碍路网服务范围内")
    stops = {
        "features": [
            {"geometry": {"x": origin_wgs[0], "y": origin_wgs[1]}, "attributes": {"Name": "当前位置"}},
            {"geometry": {"x": destination_wgs[0], "y": destination_wgs[1]}, "attributes": {"Name": destination}},
        ],
        "spatialReference": {"wkid": 4326},
    }
    params = {
        "f": "json",
        "stops": __import__("json").dumps(stops, ensure_ascii=False),
        "returnRoutes": "true",
        "returnDirections": "false",
        "returnStops": "true",
        "returnBarriers": "false",
        "outputLines": "esriNAOutputLineTrueShape",
        "outSR": "4326",
        "impedanceAttributeName": settings.geoscene_route_impedance,
    }
    try:
        response = httpx.post(
            _solve_url(),
            data=params,
            timeout=35.0,
            verify=settings.geoscene_verify_ssl,
        )
        response.raise_for_status()
        data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        if isinstance(exc, httpx.TimeoutException):
            raise GeoSceneRouteError("GeoScene 路径服务响应超时") from exc
        raise GeoSceneRouteError("GeoScene 路径服务暂时不可用") from exc
    if data.get("error"):
        message = data["error"].get("message") or "GeoScene 求解失败"
        details = "；".join(data["error"].get("details") or [])
        raw_message = message + (f"：{details}" if details else "")
        raise GeoSceneRouteError(_friendly_solve_error(raw_message))
    features = ((data.get("routes") or {}).get("features") or [])
    if not features:
        raise GeoSceneRouteError("起点和目的地之间没有可用的无障碍路线")
    feature = features[0]
    paths = (feature.get("geometry") or {}).get("paths") or []
    wgs_points = [(float(pair[0]), float(pair[1])) for path in paths for pair in path]
    if len(wgs_points) < 2:
        raise GeoSceneRouteError("GeoScene 返回的路线几何无效")
    gcj_points = [wgs84_to_gcj02(lon, lat) for lon, lat in wgs_points]
    attributes = feature.get("attributes") or {}
    safe_minutes = next(
        (float(value) for key, value in attributes.items() if key.lower() == "total_safeminutes".lower() and value is not None),
        0.0,
    )
    distance_m = _route_length(wgs_points)
    stop_features = ((data.get("stops") or {}).get("features") or [])
    snapped = []
    for index, item in enumerate(stop_features[:2]):
        geometry = item.get("geometry") or {}
        if "x" not in geometry or "y" not in geometry:
            continue
        actual = (float(geometry["x"]), float(geometry["y"]))
        requested = origin_wgs if index == 0 else destination_wgs
        snapped.append({"name": "起点" if index == 0 else "终点", "distanceMeters": round(_haversine_m(requested, actual), 1)})
    return {
        "destination": destination,
        "destinationLocation": {"lon": destination_lon, "lat": destination_lat},
        "distanceMeters": distance_m,
        "durationSeconds": round(safe_minutes * 60) if safe_minutes else max(60, round(distance_m / 1.1)),
        "safeMinutes": round(safe_minutes, 2),
        "route": [{"lon": round(lon, 7), "lat": round(lat, 7)} for lon, lat in gcj_points],
        "instructions": _generic_instructions(gcj_points, destination),
        "provider": "geoscene-safe-route",
        "impedance": settings.geoscene_route_impedance,
        "coordinateSystem": "GCJ-02",
        "sourceCoordinateSystem": "WGS84",
        "snapInfo": snapped,
    }


def solve_web_accessible_route(
    origin_lon: float,
    origin_lat: float,
    destination_lon: float,
    destination_lat: float,
) -> dict[str, Any]:
    """Solve a GeoScene route for WGS84 SceneView points and return WGS84 geometry."""
    origin_gcj = wgs84_to_gcj02(origin_lon, origin_lat)
    destination_gcj = wgs84_to_gcj02(destination_lon, destination_lat)
    solved = solve_accessible_route(
        origin_gcj[0],
        origin_gcj[1],
        "地图选点终点",
        destination_gcj[0],
        destination_gcj[1],
    )
    result = dict(solved)
    wgs_route = []
    for point in solved.get("route") or []:
        lon, lat = gcj02_to_wgs84(float(point["lon"]), float(point["lat"]))
        wgs_route.append({"lon": round(lon, 7), "lat": round(lat, 7)})
    result["route"] = wgs_route
    result["originLocation"] = {"lon": origin_lon, "lat": origin_lat}
    result["destinationLocation"] = {"lon": destination_lon, "lat": destination_lat}
    result["coordinateSystem"] = "WGS84"
    result["sourceCoordinateSystem"] = "GeoScene-Network-Analysis"
    return result
