from __future__ import annotations

import math
from typing import Any

import httpx

from ..config import get_settings


AMAP_API = "https://restapi.amap.com"
DEFAULT_CITY = "深圳"


class AmapError(RuntimeError):
    """Raised when AMap cannot produce a usable route."""


def _request(path: str, params: dict[str, Any]) -> dict:
    key = get_settings().amap_key.strip()
    if not key:
        raise AmapError("未配置高德 Web 服务 Key")
    try:
        response = httpx.get(
            AMAP_API + path,
            params={**params, "key": key},
            timeout=8.0,
        )
        response.raise_for_status()
        data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise AmapError("高德服务暂时不可用") from exc
    if str(data.get("status")) != "1":
        raise AmapError(data.get("info") or "高德服务返回失败")
    return data


def geocode(address: str, city: str = DEFAULT_CITY) -> tuple[float, float, str]:
    data = _request("/v3/geocode/geo", {"address": address, "city": city})
    geocodes = data.get("geocodes") or []
    if not geocodes or not geocodes[0].get("location"):
        raise AmapError(f"无法识别目的地：{address}")
    lon_text, lat_text = geocodes[0]["location"].split(",", 1)
    formatted = geocodes[0].get("formatted_address") or address
    return float(lon_text), float(lat_text), formatted


def walking_route(
    origin_lon: float,
    origin_lat: float,
    destination: str,
    destination_lon: float | None = None,
    destination_lat: float | None = None,
) -> dict:
    if destination_lon is None or destination_lat is None:
        destination_lon, destination_lat, formatted = geocode(destination)
    else:
        formatted = destination
    data = _request(
        "/v3/direction/walking",
        {
            "origin": f"{origin_lon:.6f},{origin_lat:.6f}",
            "destination": f"{destination_lon:.6f},{destination_lat:.6f}",
        },
    )
    paths = (data.get("route") or {}).get("paths") or []
    if not paths:
        raise AmapError("没有找到可用的步行路线")
    path = paths[0]
    points: list[dict[str, float]] = []
    instructions: list[str] = []
    for step in path.get("steps") or []:
        instruction = str(step.get("instruction") or "").strip()
        if instruction:
            instructions.append(instruction)
        for pair in str(step.get("polyline") or "").split(";"):
            if not pair or "," not in pair:
                continue
            lon_text, lat_text = pair.split(",", 1)
            point = {"lon": float(lon_text), "lat": float(lat_text)}
            if not points or point != points[-1]:
                points.append(point)
    if len(points) < 2:
        points = [
            {"lon": origin_lon, "lat": origin_lat},
            {"lon": destination_lon, "lat": destination_lat},
        ]
    return {
        "destination": destination,
        "destinationAddress": formatted,
        "destinationLocation": {"lon": destination_lon, "lat": destination_lat},
        "distanceMeters": int(float(path.get("distance") or 0)),
        "durationSeconds": int(float(path.get("duration") or 0)),
        "route": points,
        "instructions": instructions or [f"沿推荐步行路线前往{destination}"],
        "provider": "amap-walking",
        "coordinateSystem": "GCJ-02",
    }


def distance_to_route_m(lon: float, lat: float, route: list[dict[str, float]]) -> float:
    """Approximate point-to-polyline distance in metres for a city-scale route."""
    if not route:
        return math.inf
    lat_scale = 111_320.0
    lon_scale = lat_scale * math.cos(math.radians(lat))
    px, py = lon * lon_scale, lat * lat_scale
    best = math.inf
    for index in range(max(1, len(route) - 1)):
        a = route[index]
        b = route[min(index + 1, len(route) - 1)]
        ax, ay = a["lon"] * lon_scale, a["lat"] * lat_scale
        bx, by = b["lon"] * lon_scale, b["lat"] * lat_scale
        dx, dy = bx - ax, by - ay
        length_sq = dx * dx + dy * dy
        t = 0.0 if length_sq == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / length_sq))
        best = min(best, math.hypot(px - (ax + t * dx), py - (ay + t * dy)))
    return best
