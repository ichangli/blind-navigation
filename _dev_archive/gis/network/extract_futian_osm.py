"""Extract a competition-ready Futian pedestrian-road inventory from an OSM PBF.

The script intentionally produces ordinary GeoJSON plus a JSON/Markdown report.
ArcGIS Pro can import these files without needing an OSM extension.
"""

from __future__ import annotations

import argparse
import json
import math
from collections import Counter
from pathlib import Path

import osmium
import requests


NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "BlindNavigationCompetition/1.0 (Futian OSM preparation)"

USEFUL_TAGS = (
    "highway", "name", "name:zh", "ref", "foot", "access", "sidewalk",
    "sidewalk:left", "sidewalk:right", "surface", "smoothness", "width",
    "lit", "wheelchair", "tactile_paving", "kerb", "crossing",
    "crossing:signals", "crossing:markings", "incline", "step_count",
    "bridge", "tunnel", "layer", "indoor", "covered", "oneway",
)

POINT_HIGHWAYS = {"crossing", "elevator", "traffic_signals", "street_lamp"}
POINT_BARRIERS = {
    "block", "bollard", "cycle_barrier", "fence", "gate", "kerb",
    "lift_gate", "stile", "turnstile",
}
WALKABLE_HIGHWAYS = {
    "bridleway", "corridor", "crossing", "cycleway", "elevator", "footway",
    "living_street", "path", "pedestrian", "platform", "primary",
    "primary_link", "residential", "secondary", "secondary_link", "service",
    "steps", "tertiary", "tertiary_link", "track", "unclassified",
}


def fetch_boundary() -> dict:
    response = requests.get(
        NOMINATIM_URL,
        params={
            "format": "jsonv2",
            "polygon_geojson": 1,
            "limit": 3,
            "countrycodes": "cn",
            "q": "福田区, 深圳市",
        },
        headers={"User-Agent": USER_AGENT},
        timeout=60,
    )
    response.raise_for_status()
    for item in response.json():
        if item.get("osm_type") == "relation" and item.get("type") == "administrative":
            return item
    raise RuntimeError("Nominatim did not return the Futian administrative relation")


def iter_polygons(geometry: dict):
    if geometry["type"] == "Polygon":
        yield geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        yield from geometry["coordinates"]
    else:
        raise ValueError(f"Unsupported boundary geometry: {geometry['type']}")


def point_in_ring(x: float, y: float, ring: list) -> bool:
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][:2]
        xj, yj = ring[j][:2]
        if ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / (yj - yi) + xi
        ):
            inside = not inside
        j = i
    return inside


def point_in_boundary(x: float, y: float, polygons: list) -> bool:
    for polygon in polygons:
        if point_in_ring(x, y, polygon[0]) and not any(
            point_in_ring(x, y, hole) for hole in polygon[1:]
        ):
            return True
    return False


def json_value(value: str | None) -> str | None:
    return value if value not in (None, "") else None


class FeatureWriter:
    def __init__(self, path: Path):
        self.path = path
        self.handle = path.open("w", encoding="utf-8", newline="\n")
        self.handle.write('{"type":"FeatureCollection","features":[\n')
        self.first = True
        self.count = 0

    def write(self, geometry: dict, properties: dict):
        if not self.first:
            self.handle.write(",\n")
        json.dump(
            {"type": "Feature", "geometry": geometry, "properties": properties},
            self.handle,
            ensure_ascii=False,
            separators=(",", ":"),
        )
        self.first = False
        self.count += 1

    def close(self):
        self.handle.write("\n]}\n")
        self.handle.close()


class FutianHandler(osmium.SimpleHandler):
    def __init__(self, polygons: list, bbox: tuple, roads: FeatureWriter, points: FeatureWriter):
        super().__init__()
        self.polygons = polygons
        self.minx, self.miny, self.maxx, self.maxy = bbox
        self.roads = roads
        self.points = points
        self.highways = Counter()
        self.tag_coverage = Counter()
        self.walkable = Counter()
        self.invalid_locations = 0

    def node(self, node):
        tags = {tag.k: tag.v for tag in node.tags}
        highway = tags.get("highway")
        barrier = tags.get("barrier")
        if highway not in POINT_HIGHWAYS and barrier not in POINT_BARRIERS and not any(
            key in tags for key in ("tactile_paving", "kerb", "wheelchair")
        ):
            return
        if not node.location.valid():
            self.invalid_locations += 1
            return
        x, y = node.location.lon, node.location.lat
        if not (self.minx <= x <= self.maxx and self.miny <= y <= self.maxy):
            return
        if not point_in_boundary(x, y, self.polygons):
            return
        properties = {"osm_id": str(node.id), "barrier": json_value(barrier)}
        properties.update({key.replace(":", "_"): json_value(tags.get(key)) for key in USEFUL_TAGS})
        self.points.write({"type": "Point", "coordinates": [x, y]}, properties)

    def way(self, way):
        tags = {tag.k: tag.v for tag in way.tags}
        highway = tags.get("highway")
        if not highway:
            return
        coordinates = []
        for node in way.nodes:
            if not node.location.valid():
                self.invalid_locations += 1
                return
            coordinates.append([node.location.lon, node.location.lat])
        if len(coordinates) < 2:
            return
        candidates = [
            (x, y) for x, y in coordinates
            if self.minx <= x <= self.maxx and self.miny <= y <= self.maxy
        ]
        if not candidates:
            return
        # Retain ways with a vertex in Futian. A small number of boundary-crossing
        # segments may extend just outside; ArcGIS clips them precisely afterwards.
        if not any(point_in_boundary(x, y, self.polygons) for x, y in candidates):
            return

        foot = tags.get("foot")
        access = tags.get("access")
        is_walkable = highway in WALKABLE_HIGHWAYS and foot != "no" and access not in {"no", "private"}
        if highway in {"primary", "primary_link"} and not (
            foot in {"yes", "designated"} or tags.get("sidewalk") not in {None, "no", "none"}
        ):
            is_walkable = False

        properties = {
            "osm_id": str(way.id),
            "walkable": 1 if is_walkable else 0,
            "source": "OpenStreetMap",
            "confidence": "medium" if is_walkable else "low",
        }
        properties.update({key.replace(":", "_"): json_value(tags.get(key)) for key in USEFUL_TAGS})
        self.roads.write({"type": "LineString", "coordinates": coordinates}, properties)

        self.highways[highway] += 1
        self.walkable["yes" if is_walkable else "no"] += 1
        for key in USEFUL_TAGS:
            if tags.get(key):
                self.tag_coverage[key] += 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pbf", type=Path)
    parser.add_argument("--output", type=Path, default=Path("shenzhen_data/processed"))
    args = parser.parse_args()
    if not args.pbf.is_file():
        raise FileNotFoundError(args.pbf)

    args.output.mkdir(parents=True, exist_ok=True)
    boundary_item = fetch_boundary()
    boundary_geometry = boundary_item["geojson"]
    polygons = list(iter_polygons(boundary_geometry))
    south, north, west, east = map(float, boundary_item["boundingbox"])
    bbox = (west, south, east, north)

    boundary_path = args.output / "futian_boundary.geojson"
    boundary_feature = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": boundary_geometry,
            "properties": {
                "name": "福田区",
                "osm_id": str(boundary_item["osm_id"]),
                "source": "OpenStreetMap Nominatim",
            },
        }],
    }
    boundary_path.write_text(json.dumps(boundary_feature, ensure_ascii=False), encoding="utf-8")

    roads = FeatureWriter(args.output / "futian_osm_roads.geojson")
    points = FeatureWriter(args.output / "futian_osm_accessibility_points.geojson")
    handler = FutianHandler(polygons, bbox, roads, points)
    try:
        handler.apply_file(str(args.pbf), locations=True)
    finally:
        roads.close()
        points.close()

    road_count = roads.count
    report = {
        "input_pbf": str(args.pbf.resolve()),
        "boundary_osm_relation": str(boundary_item["osm_id"]),
        "road_features": road_count,
        "accessibility_points": points.count,
        "invalid_node_locations": handler.invalid_locations,
        "walkable_candidates": dict(handler.walkable),
        "highway_types": dict(handler.highways.most_common()),
        "tag_counts": dict(handler.tag_coverage),
        "tag_coverage_percent": {
            key: round(value * 100.0 / road_count, 2) if road_count else 0
            for key, value in handler.tag_coverage.items()
        },
    }
    (args.output / "futian_osm_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    md = [
        "# 福田区 OSM 数据质量报告",
        "",
        f"- 道路线要素：{road_count:,}",
        f"- 候选无障碍点/路口：{points.count:,}",
        f"- 候选可步行道路：{handler.walkable.get('yes', 0):,}",
        f"- 非候选道路：{handler.walkable.get('no', 0):,}",
        "",
        "## 无障碍相关字段覆盖率",
        "",
        "| 字段 | 数量 | 覆盖率 |",
        "|---|---:|---:|",
    ]
    for key in ("sidewalk", "surface", "smoothness", "wheelchair", "tactile_paving", "kerb", "crossing", "incline", "lit"):
        value = handler.tag_coverage.get(key, 0)
        percent = value * 100.0 / road_count if road_count else 0
        md.append(f"| {key} | {value:,} | {percent:.2f}% |")
    md.extend([
        "",
        "> 注意：OSM缺少某字段表示“未知”，不能解释为该设施不存在或道路安全。",
        "",
    ])
    (args.output / "futian_osm_report.md").write_text("\n".join(md), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
