"""Derive presentation-ready water and arterial roads from extracted Futian data."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Iterable

import geopandas as gpd
import pandas as pd
from shapely import make_valid
from shapely.geometry import GeometryCollection, MultiLineString, MultiPolygon, Polygon
from shapely.ops import linemerge, unary_union

if __package__:
    from .showcase_policy import (
        ROAD_STYLE_POLICY,
        classify_water_area,
        road_is_retained,
    )
else:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from basemap.showcase_policy import (
        ROAD_STYLE_POLICY,
        classify_water_area,
        road_is_retained,
    )


DEFAULT_INPUT = Path(r"E:\GIS_data\futian_deepsea_basemap\geojson")
DEFAULT_OUTPUT = Path(r"E:\GIS_data\futian_showcase_basemap\geojson")


def _to_web_mercator(frame: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    if frame.crs is None:
        raise ValueError("Input data must declare a coordinate reference system")
    result = frame.to_crs(3857).copy()
    result.geometry = result.geometry.map(
        lambda geometry: make_valid(geometry) if geometry is not None else None
    )
    return result[result.geometry.notna() & ~result.geometry.is_empty].copy()


def _polygon_parts(geometry) -> list[Polygon]:
    if isinstance(geometry, Polygon):
        return [geometry]
    if isinstance(geometry, MultiPolygon):
        return list(geometry.geoms)
    if isinstance(geometry, GeometryCollection):
        return [part for part in geometry.geoms if isinstance(part, Polygon)]
    return []


def _line_parts(geometry) -> list:
    if geometry.geom_type == "LineString":
        return [geometry]
    if isinstance(geometry, MultiLineString):
        return list(geometry.geoms)
    if isinstance(geometry, GeometryCollection):
        return [part for part in geometry.geoms if part.geom_type == "LineString"]
    return []


def _best_water_label(polygon: Polygon, source: gpd.GeoDataFrame) -> tuple[str, int]:
    indexes = list(source.sindex.query(polygon, predicate="intersects"))
    if not indexes:
        return "", 0
    best_label = ""
    best_area = -1.0
    for index in indexes:
        row = source.iloc[int(index)]
        label = str(row.get("label_name") or "").strip()
        if not label:
            continue
        overlap = row.geometry.intersection(polygon).area
        if overlap > best_area:
            best_label = label
            best_area = overlap
    return best_label, len(indexes)


def derive_water(frame: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Union source water, remove small fragments, and add display attributes."""

    source = _to_web_mercator(frame)
    polygons = [part for geometry in source.geometry for part in _polygon_parts(geometry)]
    merged = unary_union(polygons) if polygons else MultiPolygon([])
    records: list[dict[str, Any]] = []
    for polygon in _polygon_parts(merged):
        area_m2 = float(polygon.area)
        classification = classify_water_area(area_m2)
        if classification is None:
            continue
        label, source_count = _best_water_label(polygon, source)
        records.append(
            {
                "label_name": label,
                "area_m2": round(area_m2, 2),
                "source_count": int(source_count),
                **classification,
                "geometry": polygon,
            }
        )
    records.sort(key=lambda item: (item["display_rank"], -item["area_m2"], item["label_name"]))
    for index, record in enumerate(records, start=1):
        record["water_id"] = f"W{index:04d}"
    columns = [
        "water_id",
        "label_name",
        "water_class",
        "display_rank",
        "waterbody_size",
        "wave_strength",
        "area_m2",
        "source_count",
        "geometry",
    ]
    return gpd.GeoDataFrame(records, columns=columns, geometry="geometry", crs=3857)


def _merged_road_geometry(geometries: Iterable):
    parts = [part for geometry in geometries for part in _line_parts(geometry)]
    if not parts:
        return None
    merged = unary_union(parts)
    if isinstance(merged, MultiLineString):
        merged = linemerge(merged)
    parts = _line_parts(merged)
    if not parts:
        return None
    geometry = parts[0] if len(parts) == 1 else MultiLineString(parts)
    return geometry.simplify(5.0, preserve_topology=True)


def derive_roads(frame: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Dissolve a sparse, named arterial skeleton and attach stroke attributes."""

    source = _to_web_mercator(frame)
    source["road_class"] = source.get("road_class", "").fillna("").astype(str)
    source["label_name"] = source.get("label_name", "").fillna("").astype(str).str.strip()
    source = source[source["road_class"].isin(ROAD_STYLE_POLICY)].copy()
    source["segment_length_m"] = source.geometry.length

    records: list[dict[str, Any]] = []
    for (road_class, label_name), group in source.groupby(
        ["road_class", "label_name"], sort=True, dropna=False
    ):
        grouped_length = float(group["segment_length_m"].sum())
        if not road_is_retained(str(road_class), label_name, grouped_length):
            continue
        geometry = _merged_road_geometry(group.geometry)
        if geometry is None or geometry.is_empty:
            continue
        style = ROAD_STYLE_POLICY[str(road_class)]
        records.append(
            {
                "road_class": str(road_class),
                "label_name": str(label_name),
                "display_rank": int(style["display_rank"]),
                "length_m": round(float(geometry.length), 2),
                "segment_count": int(len(group)),
                "glow_color": str(style["glow_color"]),
                "glow_width": float(style["glow_width"]),
                "glow_alpha": int(style["glow_alpha"]),
                "casing_color": str(style["casing_color"]),
                "casing_width": float(style["casing_width"]),
                "casing_alpha": int(style["casing_alpha"]),
                "core_color": str(style["core_color"]),
                "core_width": float(style["core_width"]),
                "core_alpha": int(style["core_alpha"]),
                "min_scale": float(style["min_scale"]),
                "geometry": geometry,
            }
        )
    records.sort(key=lambda item: (item["display_rank"], item["label_name"]))
    for index, record in enumerate(records, start=1):
        record["road_id"] = f"R{index:04d}"
    columns = [
        "road_id",
        "road_class",
        "label_name",
        "display_rank",
        "length_m",
        "segment_count",
        "glow_color",
        "glow_width",
        "glow_alpha",
        "casing_color",
        "casing_width",
        "casing_alpha",
        "core_color",
        "core_width",
        "core_alpha",
        "min_scale",
        "geometry",
    ]
    return gpd.GeoDataFrame(records, columns=columns, geometry="geometry", crs=3857)


def _write_geojson(frame: gpd.GeoDataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_crs(4326).to_file(path, driver="GeoJSON")


def _class_counts(frame: gpd.GeoDataFrame, field: str) -> dict[str, int]:
    return dict(Counter(str(value) for value in frame[field]).most_common())


def build_showcase_data(input_dir: Path, output_dir: Path) -> dict[str, Any]:
    """Build both showcase datasets and write an evidence-rich report."""

    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    inputs = {
        "water": input_dir / "water.geojson",
        "roads": input_dir / "roads.geojson",
    }
    missing = [str(path) for path in inputs.values() if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing showcase source data: " + ", ".join(missing))

    source_water = gpd.read_file(inputs["water"])
    source_roads = gpd.read_file(inputs["roads"])
    water = derive_water(source_water)
    roads = derive_roads(source_roads)
    if water.empty or roads.empty:
        raise RuntimeError("Showcase derivation produced an empty required layer")

    _write_geojson(water, output_dir / "showcase_water.geojson")
    _write_geojson(roads, output_dir / "showcase_roads.geojson")
    report: dict[str, Any] = {
        "status": "passed",
        "input_dir": str(input_dir.resolve()),
        "output_dir": str(output_dir.resolve()),
        "water": {
            "input_count": int(len(source_water)),
            "output_count": int(len(water)),
            "class_counts": _class_counts(water, "water_class"),
            "total_area_m2": round(float(water["area_m2"].sum()), 2),
            "empty_geometry": int(water.geometry.is_empty.sum()),
        },
        "roads": {
            "input_count": int(len(source_roads)),
            "output_count": int(len(roads)),
            "class_counts": _class_counts(roads, "road_class"),
            "total_length_m": round(float(roads["length_m"].sum()), 2),
            "empty_geometry": int(roads.geometry.is_empty.sum()),
        },
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "showcase_data_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    report = build_showcase_data(args.input_dir, args.output_dir)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
