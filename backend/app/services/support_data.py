from __future__ import annotations

import json
import csv
import math
import re
from collections import Counter
from functools import lru_cache

from .amap import distance_to_route_m
from .geoscene_route import wgs84_to_gcj02
from ..config import resource_path


SUPPORT_DIR = resource_path("shenzhen_data/processed/support")
SOURCES = {
    "metroEntrance": ("futian_metro_entrances.geojson", "地铁出入口"),
    "hospital": ("futian_hospitals.geojson", "医院"),
    "toilet": ("futian_public_toilets.geojson", "公共厕所"),
    "rehab": ("futian_rehab_services.geojson", "康复服务"),
    "busStop": ("futian_bus_stops.geojson", "公交站"),
    "park": ("futian_community_parks.geojson", "社区公园"),
}

WEB_SOURCES = {
    "metroStation": ("futian_metro_stations.geojson", "地铁站"),
    **SOURCES,
}

WEB_CATEGORY_META = {
    "metroStation": {"label": "地铁站", "group": "transit"},
    "metroEntrance": {"label": "地铁出入口", "group": "transit"},
    "busStop": {"label": "公交站", "group": "transit"},
    "toilet": {"label": "公共厕所", "group": "service"},
    "park": {"label": "社区公园", "group": "service"},
    "hospital": {"label": "医院", "group": "service"},
    "rehab": {"label": "康复服务", "group": "service"},
}


@lru_cache(maxsize=1)
def _accessible_exit_map() -> dict[str, dict]:
    path = SUPPORT_DIR / "metro_accessibility.csv"
    result: dict[str, dict] = {}
    if not path.exists():
        return result
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            station_key = str(row.get("station_key") or "").strip()
            detail = str(row.get("无障碍设施位置") or "").strip()
            exit_refs = set(re.findall(r"([A-Z](?:\d+)?)出入口", detail, flags=re.IGNORECASE))
            if station_key:
                result[station_key] = {"exitRefs": {ref.upper() for ref in exit_refs}, "detail": detail}
    return result


@lru_cache(maxsize=1)
def load_support_points() -> list[dict]:
    points: list[dict] = []
    for category, (filename, label) in SOURCES.items():
        path = SUPPORT_DIR / filename
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for feature in data.get("features") or []:
            geometry = feature.get("geometry") or {}
            coordinates = geometry.get("coordinates") or []
            if geometry.get("type") != "Point" or len(coordinates) < 2:
                continue
            properties = feature.get("properties") or {}
            lon, lat = wgs84_to_gcj02(float(coordinates[0]), float(coordinates[1]))
            name = (
                properties.get("name")
                or properties.get("name_zh")
                or properties.get("station_name")
                or label
            )
            if category == "metroEntrance" and properties.get("ref"):
                name = f"{properties.get('station_name') or name} {properties['ref']}口"
            wheelchair = str(properties.get("wheelchair") or "unknown")
            accessibility_detail = ""
            if category == "metroEntrance":
                station_access = _accessible_exit_map().get(str(properties.get("station_key") or ""))
                ref = str(properties.get("ref") or "").upper()
                if station_access:
                    accessibility_detail = station_access["detail"]
                    if ref and ref in station_access["exitRefs"]:
                        wheelchair = "yes"
            points.append({
                "id": str(
                    properties.get("bus_id")
                    or properties.get("stop_id")
                    or properties.get("station_id")
                    or f"{category}-{len(points) + 1}"
                ),
                "category": category,
                "categoryLabel": label,
                "name": str(name),
                "lon": lon,
                "lat": lat,
                "address": str(properties.get("address") or properties.get("location") or ""),
                "wheelchair": wheelchair,
                "accessibility": str(properties.get("accessibility") or accessibility_detail),
                "source": str(properties.get("source") or ""),
            })
    return points


def _haversine_distance_m(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    radius_m = 6_371_008.8
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    haversine = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    return radius_m * 2 * math.atan2(math.sqrt(haversine), math.sqrt(1 - haversine))


def nearby_bus_stops(lon: float, lat: float, limit: int = 5) -> list[dict]:
    """Return the closest real Futian bus-stop records in GCJ-02 coordinates."""
    safe_limit = max(1, min(int(limit), 10))
    ranked: list[dict] = []
    for point in load_support_points():
        if point["category"] != "busStop":
            continue
        item = dict(point)
        item["distanceMeters"] = int(round(_haversine_distance_m(lon, lat, point["lon"], point["lat"])))
        ranked.append(item)
    ranked.sort(key=lambda item: (item["distanceMeters"], item["name"], item["id"]))
    unique: list[dict] = []
    seen: set[tuple[str, str]] = set()
    for item in ranked:
        name_key = re.sub(r"\s+", "", item["name"]).casefold()
        address_key = re.sub(r"\s+", "", item["address"]).casefold()
        if not address_key:
            address_key = f"{item['lon']:.5f},{item['lat']:.5f}"
        key = (name_key, address_key)
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
        if len(unique) >= safe_limit:
            break
    return unique


def _first_text(properties: dict, *names: str) -> str:
    for name in names:
        value = properties.get(name)
        if value is not None and str(value).strip():
            return str(value).strip()
    return ""


def _web_feature_id(category: str, properties: dict, index: int) -> str:
    raw_id = _first_text(
        properties,
        "osm_id",
        "bus_id",
        "station_id",
        "station_key",
        "name",
    ) or str(index + 1)
    safe_id = re.sub(r"[^0-9A-Za-z_-]+", "-", raw_id).strip("-")
    return f"{category}-{safe_id or 'item'}-{index + 1}"


@lru_cache(maxsize=1)
def load_web_map_context() -> dict:
    """Return WGS84 support layers for the GeoScene/ArcGIS SceneView.

    The mobile navigation map consumes GCJ-02 points through ``load_support_points``.
    The Web 3D scene instead needs the source WGS84 coordinates so ArcGIS can project
    them together with the published CGCS2000 white model and road service.
    """

    features: list[dict] = []
    category_counts: Counter[str] = Counter()

    for category, (filename, label) in WEB_SOURCES.items():
        path = SUPPORT_DIR / filename
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for index, feature in enumerate(data.get("features") or []):
            geometry = feature.get("geometry") or {}
            coordinates = geometry.get("coordinates") or []
            if geometry.get("type") != "Point" or len(coordinates) < 2:
                continue

            properties = feature.get("properties") or {}
            lon = float(coordinates[0])
            lat = float(coordinates[1])
            name = _first_text(
                properties,
                "name",
                "name_zh",
                "station_name",
            ) or label
            station_key = _first_text(properties, "station_key")
            entrance_ref = _first_text(properties, "ref").upper()
            accessibility = _first_text(properties, "accessibility")
            wheelchair = _first_text(properties, "wheelchair") or "unknown"

            if category == "metroEntrance":
                if entrance_ref:
                    name = f"{_first_text(properties, 'station_name') or name} {entrance_ref}口"
                station_access = _accessible_exit_map().get(station_key)
                if station_access:
                    accessibility = accessibility or station_access["detail"]
                    if entrance_ref and entrance_ref in station_access["exitRefs"]:
                        wheelchair = "yes"
            elif category == "metroStation" and properties.get("has_access_info"):
                wheelchair = "yes"

            item = {
                "id": _web_feature_id(category, properties, index),
                "category": category,
                "categoryLabel": label,
                "group": WEB_CATEGORY_META[category]["group"],
                "name": name,
                "lon": lon,
                "lat": lat,
                "address": _first_text(properties, "address"),
                "location": _first_text(properties, "location"),
                "wheelchair": wheelchair,
                "accessibility": accessibility,
                "stationKey": station_key,
                "entranceRef": entrance_ref,
                "lines": _first_text(properties, "lines", "线路名称"),
                "description": _first_text(properties, "description"),
                "phone": _first_text(properties, "CONTACTNUM", "联系电话-LXDH"),
                "serviceContent": _first_text(properties, "SERVICECONTENT"),
                "hospitalLevel": _first_text(properties, "级别-JB"),
                "hospitalGrade": _first_text(properties, "等级-DJ"),
                "openingHours": _first_text(properties, "opening_hours"),
                "fee": _first_text(properties, "fee"),
                "areaSquareMeters": _first_text(properties, "MJ"),
                "stationDistanceMeters": properties.get("station_distance_m"),
                "source": _first_text(properties, "source"),
                "confidence": _first_text(properties, "confidence"),
            }
            features.append(item)
            category_counts[category] += 1

    boundary_path = resource_path("shenzhen_data/processed/futian_boundary.geojson")
    boundary = None
    if boundary_path.exists():
        boundary_data = json.loads(boundary_path.read_text(encoding="utf-8"))
        boundary_feature = (boundary_data.get("features") or [None])[0]
        if boundary_feature:
            boundary = {
                "name": _first_text(boundary_feature.get("properties") or {}, "name") or "福田区",
                "geometry": boundary_feature.get("geometry"),
            }

    summary = []
    for category, meta in WEB_CATEGORY_META.items():
        summary.append({
            "category": category,
            "label": meta["label"],
            "group": meta["group"],
            "count": category_counts.get(category, 0),
        })

    return {
        "coordinateSystem": "WGS84",
        "featureCount": len(features),
        "summary": summary,
        "boundary": boundary,
        "features": features,
        "qualityNote": "字段为空表示信息未知，不能解释为设施不存在或道路不安全。",
    }


def facilities_along_route(route: list[dict], corridor_m: float = 100, limit: int = 24) -> list[dict]:
    if len(route) < 2:
        return []
    matches = []
    per_category: dict[str, int] = {}
    for point in load_support_points():
        distance = distance_to_route_m(point["lon"], point["lat"], route)
        if distance > corridor_m:
            continue
        item = dict(point)
        item["distanceToRouteMeters"] = round(distance)
        matches.append(item)
    matches.sort(key=lambda item: (
        0 if item["wheelchair"].lower() in {"yes", "designated"} else 1,
        item["distanceToRouteMeters"],
    ))
    selected = []
    for item in matches:
        category = item["category"]
        if per_category.get(category, 0) >= 6:
            continue
        selected.append(item)
        per_category[category] = per_category.get(category, 0) + 1
        if len(selected) >= limit:
            break
    return selected


def recommended_metro_entrance(facilities: list[dict], destination: dict | None) -> dict | None:
    entrances = [item for item in facilities if item["category"] == "metroEntrance"]
    if not entrances:
        return None
    if destination:
        for item in entrances:
            item["distanceToDestinationMeters"] = round(distance_to_route_m(
                destination["lon"], destination["lat"],
                [{"lon": item["lon"], "lat": item["lat"]}],
            ))
        entrances.sort(key=lambda item: (
            0 if item["wheelchair"].lower() in {"yes", "designated"} else 1,
            item.get("distanceToDestinationMeters", 999999),
        ))
    return entrances[0]
