"""Extract, repair and height-enrich Futian OSM buildings for CityEngine."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from collections import Counter
from pathlib import Path

import osmium


DEFAULT_HEIGHTS = {
    "apartments": 27.0, "residential": 24.0, "house": 9.0, "detached": 9.0,
    "commercial": 27.0, "retail": 18.0, "office": 36.0, "hotel": 33.0,
    "industrial": 12.0, "warehouse": 10.0, "school": 18.0, "university": 21.0,
    "hospital": 24.0, "civic": 18.0, "public": 18.0, "government": 24.0,
    "church": 15.0, "temple": 15.0, "garage": 6.0, "garages": 5.0,
    "roof": 4.0, "yes": 15.0,
}


def parse_number(value: str | None) -> float | None:
    if not value:
        return None
    text = str(value).strip().lower().replace(",", ".")
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    if not match:
        return None
    number = float(match.group())
    if "ft" in text or "feet" in text or "'" in text:
        number *= 0.3048
    return number


def building_class(building: str) -> str:
    if building in {"apartments", "residential", "house", "detached", "terrace", "dormitory"}:
        return "residential"
    if building in {"commercial", "retail", "office", "hotel"}:
        return "commercial"
    if building in {"industrial", "warehouse", "service"}:
        return "industrial"
    if building in {"hospital", "school", "university", "civic", "public", "government"}:
        return "public"
    if building in {"garage", "garages", "roof", "shed"}:
        return "utility"
    return "generic"


def estimated_height(building: str, area_m2: float, osm_id: str) -> tuple[float, int]:
    base = DEFAULT_HEIGHTS.get(building, 15.0)
    if area_m2 < 75:
        base = min(base, 9.0)
    elif area_m2 > 4000 and building in {"commercial", "office", "retail", "yes"}:
        base = max(base, 24.0)
    variation = int(hashlib.sha1(osm_id.encode("utf-8")).hexdigest()[:2], 16) % 4 * 3
    height = min(90.0, base + variation)
    return height, max(1, round(height / 3.0))


def resolve_height(tags: dict, area_m2: float, osm_id: str) -> tuple[float, int, str]:
    height = parse_number(tags.get("height"))
    levels = parse_number(tags.get("building:levels"))
    if height and 2.0 <= height <= 700:
        return round(height, 2), max(1, round(levels or height / 3.2)), "osm_height"
    if levels and 1 <= levels <= 180:
        value = min(650.0, levels * 3.2 + (1.2 if levels >= 4 else 0))
        return round(value, 2), round(levels), "osm_levels"
    value, floors = estimated_height(tags.get("building", "yes"), area_m2, osm_id)
    return value, floors, "estimated_type_area"


def iter_boundary_polygons(geometry: dict):
    if geometry["type"] == "Polygon":
        yield geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        yield from geometry["coordinates"]


def point_in_ring(x: float, y: float, ring: list) -> bool:
    inside = False
    previous = ring[-1]
    for current in ring:
        x1, y1 = previous[:2]
        x2, y2 = current[:2]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            inside = not inside
        previous = current
    return inside


def point_in_boundary(x: float, y: float, polygons: list) -> bool:
    return any(point_in_ring(x, y, polygon[0]) and not any(point_in_ring(x, y, hole) for hole in polygon[1:]) for polygon in polygons)


def ring_area_m2(ring: list) -> float:
    if len(ring) < 4:
        return 0.0
    mean_lat = sum(point[1] for point in ring) / len(ring)
    lon_scale = 111_320.0 * math.cos(math.radians(mean_lat))
    lat_scale = 111_320.0
    origin_x, origin_y = ring[0][:2]
    total = 0.0
    previous = ring[-1]
    for current in ring:
        px, py = (previous[0] - origin_x) * lon_scale, (previous[1] - origin_y) * lat_scale
        cx, cy = (current[0] - origin_x) * lon_scale, (current[1] - origin_y) * lat_scale
        total += px * cy - cx * py
        previous = current
    return abs(total) / 2.0


def polygon_area_m2(polygon: list) -> float:
    return max(0.0, ring_area_m2(polygon[0]) - sum(ring_area_m2(hole) for hole in polygon[1:]))


class BuildingHandler(osmium.SimpleHandler):
    def __init__(self, boundary, output: Path):
        super().__init__()
        self.boundary = boundary
        self.output = output.open("w", encoding="utf-8", newline="\n")
        self.output.write('{"type":"FeatureCollection","features":[\n')
        self.factory = osmium.geom.GeoJSONFactory()
        self.first = True
        self.count = 0
        self.repaired = 0
        self.skipped = Counter()
        self.height_sources = Counter()
        self.classes = Counter()

    def _write(self, geometry, properties):
        if not self.first:
            self.output.write(",\n")
        json.dump({"type": "Feature", "geometry": geometry, "properties": properties}, self.output, ensure_ascii=False, separators=(",", ":"))
        self.first = False
        self.count += 1

    def area(self, area):
        tags = {tag.k: tag.v for tag in area.tags}
        if not tags.get("building") or tags.get("building") == "no":
            return
        try:
            geometry = json.loads(self.factory.create_multipolygon(area))
        except Exception:
            self.skipped["geometry_conversion"] += 1
            return
        polygons = list(iter_boundary_polygons(geometry))
        osm_id = f"a{area.id}"
        for part_index, polygon in enumerate(polygons):
            if not polygon or len(polygon[0]) < 4:
                self.skipped["invalid_ring"] += 1
                continue
            center_x = sum(point[0] for point in polygon[0]) / len(polygon[0])
            center_y = sum(point[1] for point in polygon[0]) / len(polygon[0])
            if not point_in_boundary(center_x, center_y, self.boundary):
                continue
            area_m2 = polygon_area_m2(polygon)
            if area_m2 < 8:
                self.skipped["tiny_footprint"] += 1
                continue
            height, floors, height_source = resolve_height(tags, area_m2, osm_id)
            kind = tags.get("building", "yes")
            category = building_class(kind)
            self.height_sources[height_source] += 1
            self.classes[category] += 1
            properties = {
                "building_id": f"{osm_id}_{part_index}", "osm_id": osm_id,
                "name": tags.get("name") or tags.get("name:zh") or "",
                "building": kind, "bldg_class": category,
                "height_m": height, "levels_est": floors, "height_source": height_source,
                "footprint_area_m2": round(area_m2, 1),
                "roof_shape": tags.get("roof:shape") or "flat",
                "min_height_m": parse_number(tags.get("min_height")) or 0,
                "source": "OpenStreetMap",
            }
            self._write({"type": "Polygon", "coordinates": polygon}, properties)

    def close(self):
        self.output.write("\n]}\n")
        self.output.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pbf", type=Path)
    parser.add_argument("--boundary", type=Path, default=Path("shenzhen_data/processed/futian_boundary.geojson"))
    parser.add_argument("--output-dir", type=Path, default=Path("shenzhen_data/processed/buildings"))
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    boundary_data = json.loads(args.boundary.read_text(encoding="utf-8"))
    boundary = list(iter_boundary_polygons(boundary_data["features"][0]["geometry"]))
    output = args.output_dir / "futian_buildings_cityengine.geojson"
    handler = BuildingHandler(boundary, output)
    try:
        handler.apply_file(str(args.pbf), locations=True)
    finally:
        handler.close()
    report = {
        "input": str(args.pbf.resolve()), "output": str(output.resolve()),
        "building_parts": handler.count, "repaired_geometries": handler.repaired,
        "skipped": dict(handler.skipped), "height_sources": dict(handler.height_sources),
        "building_classes": dict(handler.classes),
    }
    (args.output_dir / "futian_buildings_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# 福田建筑白模数据报告", "", f"- 建筑面数量：{handler.count:,}", f"- 修复几何：{handler.repaired:,}", "", "## 高度来源"]
    lines.extend(f"- {key}: {value:,}" for key, value in handler.height_sources.most_common())
    lines.extend(["", "## 建筑分类"])
    lines.extend(f"- {key}: {value:,}" for key, value in handler.classes.most_common())
    (args.output_dir / "futian_buildings_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
