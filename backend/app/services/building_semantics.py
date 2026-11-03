from __future__ import annotations

import json
import math
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path

from ..config import resource_path
from .support_data import load_web_map_context


BUILDINGS_PATH = resource_path(
    "shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson"
)
GRID_SIZE_DEGREES = 0.002

# Only categories that can reasonably belong to a building are linked. Outdoor
# transit stops, entrances and park centroids remain independent map symbols.
BUILDING_MATCH_DISTANCE_METERS = {
    "hospital": 140.0,
    "rehab": 90.0,
    "toilet": 35.0,
    "metroStation": 0.0,
}
BUILDING_CATEGORY_PRIORITY = {
    "hospital": 40,
    "metroStation": 30,
    "rehab": 20,
    "toilet": 10,
}


class BuildingCatalogUnavailable(RuntimeError):
    """Raised when the packaged building attribute dataset cannot be loaded."""


def _grid_key(lon: float, lat: float) -> tuple[int, int]:
    return (
        math.floor(lon / GRID_SIZE_DEGREES),
        math.floor(lat / GRID_SIZE_DEGREES),
    )


def _ring_contains_point(ring: list, lon: float, lat: float) -> bool:
    inside = False
    if len(ring) < 3:
        return False
    previous = ring[-1]
    for current in ring:
        x1, y1 = float(previous[0]), float(previous[1])
        x2, y2 = float(current[0]), float(current[1])
        crosses = (y1 > lat) != (y2 > lat)
        if crosses:
            intersection_x = (x2 - x1) * (lat - y1) / (y2 - y1) + x1
            if lon < intersection_x:
                inside = not inside
        previous = current
    return inside


def _polygon_contains_point(rings: list, lon: float, lat: float) -> bool:
    if not rings or not _ring_contains_point(rings[0], lon, lat):
        return False
    return not any(_ring_contains_point(hole, lon, lat) for hole in rings[1:])


def _distance_to_ring_meters(ring: list, lon: float, lat: float) -> float:
    if len(ring) < 2:
        return float("inf")
    cos_lat = max(math.cos(math.radians(lat)), 0.1)
    x_scale = 111_320.0 * cos_lat
    y_scale = 110_540.0
    best = float("inf")
    previous = ring[-1]
    for current in ring:
        ax = (float(previous[0]) - lon) * x_scale
        ay = (float(previous[1]) - lat) * y_scale
        bx = (float(current[0]) - lon) * x_scale
        by = (float(current[1]) - lat) * y_scale
        dx = bx - ax
        dy = by - ay
        length_squared = dx * dx + dy * dy
        if length_squared:
            factor = max(0.0, min(1.0, -(ax * dx + ay * dy) / length_squared))
            px = ax + factor * dx
            py = ay + factor * dy
        else:
            px, py = ax, ay
        best = min(best, math.hypot(px, py))
        previous = current
    return best


def _polygon_centroid(ring: list) -> tuple[float, float]:
    if len(ring) < 3:
        return (0.0, 0.0)
    twice_area = 0.0
    x_sum = 0.0
    y_sum = 0.0
    previous = ring[-1]
    for current in ring:
        x1, y1 = float(previous[0]), float(previous[1])
        x2, y2 = float(current[0]), float(current[1])
        cross = x1 * y2 - x2 * y1
        twice_area += cross
        x_sum += (x1 + x2) * cross
        y_sum += (y1 + y2) * cross
        previous = current
    if abs(twice_area) < 1e-14:
        points = ring[:-1] if ring[0] == ring[-1] else ring
        return (
            sum(float(point[0]) for point in points) / len(points),
            sum(float(point[1]) for point in points) / len(points),
        )
    return (x_sum / (3.0 * twice_area), y_sum / (3.0 * twice_area))


def _building_record(feature: dict, index: int) -> dict | None:
    geometry = feature.get("geometry") or {}
    rings = geometry.get("coordinates") or []
    if geometry.get("type") != "Polygon" or not rings or len(rings[0]) < 3:
        return None
    exterior = rings[0]
    longitudes = [float(point[0]) for point in exterior]
    latitudes = [float(point[1]) for point in exterior]
    properties = feature.get("properties") or {}
    building_id = str(properties.get("building_id") or f"building-{index + 1}")
    return {
        "id": building_id,
        "index": index,
        "feature": feature,
        "rings": rings,
        "bbox": (min(longitudes), min(latitudes), max(longitudes), max(latitudes)),
        "centroid": _polygon_centroid(exterior),
        "area": float(properties.get("footprint_area_m2") or 0.0),
    }


def _candidate_buildings(
    index: dict[tuple[int, int], list[dict]],
    lon: float,
    lat: float,
    radius_meters: float,
) -> list[dict]:
    center_x, center_y = _grid_key(lon, lat)
    cells = max(1, math.ceil(radius_meters / (GRID_SIZE_DEGREES * 100_000.0)))
    candidates: dict[str, dict] = {}
    for grid_x in range(center_x - cells, center_x + cells + 1):
        for grid_y in range(center_y - cells, center_y + cells + 1):
            for building in index.get((grid_x, grid_y), []):
                candidates[building["id"]] = building
    return list(candidates.values())


def _clean_building_text(value) -> str:
    text = str(value or "").strip()
    return "" if "�" in text else text


def _optional_number(value, integer: bool = False):
    if value is None or value == "":
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(number):
        return None
    return int(round(number)) if integer else round(number, 1)


def _building_payload(building: dict) -> dict:
    properties = building["feature"].get("properties") or {}
    return {
        "buildingId": str(properties.get("building_id") or building["id"]),
        "osmId": _clean_building_text(properties.get("osm_id")),
        "name": _clean_building_text(properties.get("name")),
        "buildingType": _clean_building_text(properties.get("building")),
        "buildingClass": _clean_building_text(properties.get("bldg_class")),
        "heightM": _optional_number(properties.get("height_m")),
        "estimatedLevels": _optional_number(properties.get("levels_est"), integer=True),
        "footprintAreaM2": _optional_number(properties.get("footprint_area_m2")),
        "roofShape": _clean_building_text(properties.get("roof_shape")),
        "heightSource": _clean_building_text(properties.get("height_source")),
        "source": _clean_building_text(properties.get("source")),
    }


def _building_highlight_payload(building: dict) -> dict:
    feature = building["feature"]
    properties = feature.get("properties") or {}
    height = _optional_number(properties.get("height_m"))
    min_height = _optional_number(properties.get("min_height_m"))
    height = float(height) if height is not None and height > 0 else 12.0
    min_height = max(0.0, float(min_height or 0.0))
    if height <= min_height:
        height = min_height + 1.0
    return {
        "geometry": feature.get("geometry"),
        "heightM": round(height, 1),
        "minHeightM": round(min_height, 1),
    }


class BuildingSpatialCatalog:
    """Cached, dependency-free spatial lookup for the packaged building data."""

    def __init__(
        self,
        buildings: list[dict],
        spatial_index: dict[tuple[int, int], list[dict]],
    ):
        self.buildings = buildings
        self.spatial_index = spatial_index

    @property
    def building_count(self) -> int:
        return len(self.buildings)

    @classmethod
    def from_features(cls, features: list[dict]) -> "BuildingSpatialCatalog":
        buildings = []
        spatial_index: dict[tuple[int, int], list[dict]] = defaultdict(list)
        for index, feature in enumerate(features):
            building = _building_record(feature, index)
            if building is None:
                continue
            buildings.append(building)
            min_lon, min_lat, max_lon, max_lat = building["bbox"]
            min_cell = _grid_key(min_lon, min_lat)
            max_cell = _grid_key(max_lon, max_lat)
            for grid_x in range(min_cell[0], max_cell[0] + 1):
                for grid_y in range(min_cell[1], max_cell[1] + 1):
                    spatial_index[(grid_x, grid_y)].append(building)
        return cls(buildings, spatial_index)

    @classmethod
    def from_path(cls, path: Path) -> "BuildingSpatialCatalog":
        if not path.exists():
            raise BuildingCatalogUnavailable(f"Building data does not exist: {path}")
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            raise BuildingCatalogUnavailable(f"Building data cannot be read: {path}") from exc
        return cls.from_features(raw.get("features") or [])

    def identify(
        self,
        longitude: float,
        latitude: float,
        tolerance_meters: float = 10.0,
    ) -> dict:
        lon = float(longitude)
        lat = float(latitude)
        tolerance = max(0.0, float(tolerance_meters))
        if not math.isfinite(lon) or not math.isfinite(lat):
            raise ValueError("Coordinates must be finite")
        if not -180.0 <= lon <= 180.0 or not -90.0 <= lat <= 90.0:
            raise ValueError("Coordinates are out of range")

        candidates = _candidate_buildings(
            self.spatial_index,
            lon,
            lat,
            max(tolerance, 1.0),
        )
        containing = [
            building
            for building in candidates
            if _polygon_contains_point(building["rings"], lon, lat)
        ]
        if containing:
            selected = min(
                containing,
                key=lambda item: item["area"] or float("inf"),
            )
            return {
                "matched": True,
                "matchType": "contains",
                "distanceMeters": 0.0,
                "building": _building_payload(selected),
                "highlight": _building_highlight_payload(selected),
            }

        nearest = None
        nearest_distance = float("inf")
        for building in candidates:
            min_lon, min_lat, max_lon, max_lat = building["bbox"]
            lat_padding = tolerance / 110_540.0
            lon_padding = tolerance / (
                111_320.0 * max(math.cos(math.radians(lat)), 0.1)
            )
            if not (
                min_lon - lon_padding <= lon <= max_lon + lon_padding
                and min_lat - lat_padding <= lat <= max_lat + lat_padding
            ):
                continue
            distance = _distance_to_ring_meters(building["rings"][0], lon, lat)
            if distance < nearest_distance:
                nearest = building
                nearest_distance = distance
        if nearest is not None and nearest_distance <= tolerance:
            return {
                "matched": True,
                "matchType": "nearest",
                "distanceMeters": round(nearest_distance, 1),
                "building": _building_payload(nearest),
                "highlight": _building_highlight_payload(nearest),
            }
        return {
            "matched": False,
            "matchType": "none",
            "distanceMeters": None,
            "building": None,
        }


@lru_cache(maxsize=1)
def load_building_catalog() -> BuildingSpatialCatalog:
    return BuildingSpatialCatalog.from_path(BUILDINGS_PATH)


def identify_building(longitude: float, latitude: float) -> dict:
    return load_building_catalog().identify(longitude, latitude)


def _match_building(
    spatial_index: dict[tuple[int, int], list[dict]],
    facility: dict,
) -> tuple[dict | None, str, float | None]:
    category = str(facility.get("category") or "")
    threshold = BUILDING_MATCH_DISTANCE_METERS.get(category)
    if threshold is None:
        return None, "outdoor", None
    lon = float(facility["lon"])
    lat = float(facility["lat"])
    candidates = _candidate_buildings(spatial_index, lon, lat, max(threshold, 5.0))

    containing = [
        building
        for building in candidates
        if _polygon_contains_point(building["rings"], lon, lat)
    ]
    if containing:
        # Prefer the most specific footprint when nested building parts overlap.
        return min(containing, key=lambda item: item["area"] or float("inf")), "inside", 0.0
    if threshold <= 0:
        return None, "unmatched", None

    nearest = None
    nearest_distance = float("inf")
    for building in candidates:
        min_lon, min_lat, max_lon, max_lat = building["bbox"]
        lat_padding = threshold / 110_540.0
        lon_padding = threshold / (111_320.0 * max(math.cos(math.radians(lat)), 0.1))
        if not (
            min_lon - lon_padding <= lon <= max_lon + lon_padding
            and min_lat - lat_padding <= lat <= max_lat + lat_padding
        ):
            continue
        distance = _distance_to_ring_meters(building["rings"][0], lon, lat)
        if distance < nearest_distance:
            nearest = building
            nearest_distance = distance
    if nearest is not None and nearest_distance <= threshold:
        return nearest, "nearby", round(nearest_distance, 1)
    return None, "unmatched", None


@lru_cache(maxsize=1)
def load_building_semantics() -> dict:
    """Build a lightweight semantic shell layer without changing GeoScene data."""

    try:
        catalog = load_building_catalog()
    except BuildingCatalogUnavailable:
        return {
            "type": "FeatureCollection",
            "coordinateSystem": "WGS84",
            "features": [],
            "facilityLinks": {},
            "metadata": {"buildingCount": 0, "linkedFacilityCount": 0},
        }

    buildings = catalog.buildings
    spatial_index = catalog.spatial_index

    building_facilities: dict[str, list[dict]] = defaultdict(list)
    building_matches: dict[str, list[tuple[str, float | None]]] = defaultdict(list)
    facility_links: dict[str, dict] = {}
    unmatched: Counter[str] = Counter()
    category_links: Counter[str] = Counter()

    for facility in load_web_map_context().get("features") or []:
        building, method, distance = _match_building(spatial_index, facility)
        if building is None:
            if method != "outdoor" and facility.get("category") in BUILDING_MATCH_DISTANCE_METERS:
                unmatched[str(facility.get("category") or "unknown")] += 1
            continue
        building_facilities[building["id"]].append(facility)
        building_matches[building["id"]].append((method, distance))
        category = str(facility.get("category") or "unknown")
        category_links[category] += 1
        facility_links[str(facility["id"])] = {
            "buildingId": building["id"],
            "matchMethod": method,
            "distanceMeters": distance,
        }

    building_by_id = {building["id"]: building for building in buildings}
    output_features = []
    for object_id, building_id in enumerate(sorted(building_facilities), start=1):
        building = building_by_id[building_id]
        facilities = building_facilities[building_id]
        categories = Counter(str(item.get("category") or "unknown") for item in facilities)
        primary_category = max(
            categories,
            key=lambda category: (BUILDING_CATEGORY_PRIORITY.get(category, 0), categories[category]),
        )
        source_properties = building["feature"].get("properties") or {}
        height = max(float(source_properties.get("height_m") or 12.0), 5.0)
        accessible_count = sum(
            1
            for item in facilities
            if str(item.get("wheelchair") or "").lower() in {"yes", "designated"}
            or bool(str(item.get("accessibility") or "").strip())
        )
        match_methods = building_matches[building_id]
        names = list(dict.fromkeys(str(item.get("name") or item.get("categoryLabel")) for item in facilities))
        centroid_lon, centroid_lat = building["centroid"]
        output_features.append({
            "type": "Feature",
            "geometry": building["feature"]["geometry"],
            "properties": {
                "ObjectID": object_id,
                "building_id": building_id,
                "building_name": (
                    str(source_properties.get("name") or "")
                    if "�" not in str(source_properties.get("name") or "")
                    else ""
                ),
                "building_class": str(source_properties.get("bldg_class") or "generic"),
                "height_m": round(height, 1),
                "visual_height_m": round(height + 3.0, 1),
                "centroid_lon": round(centroid_lon, 7),
                "centroid_lat": round(centroid_lat, 7),
                "primary_category": primary_category,
                "primary_label": next(
                    (str(item.get("categoryLabel") or "") for item in facilities if item.get("category") == primary_category),
                    primary_category,
                ),
                "facility_count": len(facilities),
                "accessible_count": accessible_count,
                "categories": "|".join(sorted(categories)),
                "facility_ids": "|".join(str(item["id"]) for item in facilities),
                "facility_names": "、".join(names[:6]),
                "match_method": "inside" if any(method == "inside" for method, _ in match_methods) else "nearby",
            },
        })

    return {
        "type": "FeatureCollection",
        "coordinateSystem": "WGS84",
        "features": output_features,
        "facilityLinks": facility_links,
        "metadata": {
            "sourceBuildingCount": len(buildings),
            "buildingCount": len(output_features),
            "linkedFacilityCount": len(facility_links),
            "categoryCounts": dict(category_links),
            "unmatchedCategoryCounts": dict(unmatched),
            "matchingPolicy": "建筑内优先；医院140米、康复服务90米、厕所35米内可匹配最近建筑；室外设施不强制关联",
        },
    }
