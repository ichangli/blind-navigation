"""Extract a quiet Futian context basemap from local OSM and support data."""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Iterable, Mapping

import geopandas as gpd
import pandas as pd
import pyogrio
from pyproj import Transformer
from shapely.geometry import GeometryCollection, MultiLineString, MultiPolygon, mapping, shape
from shapely.ops import transform, unary_union
from shapely.validation import make_valid

if __package__:
    from .basemap_policy import choose_label, classify_area, classify_place, classify_road
else:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from basemap.basemap_policy import choose_label, classify_area, classify_place, classify_road


HSTORE_PAIR = re.compile(r'"((?:\\.|[^"\\])*)"=>"((?:\\.|[^"\\])*)"')
SPACE_RUN = re.compile(r"\s+")
NUMBER = re.compile(r"-?\d+(?:\.\d+)?")

LAYER_COLUMNS = {
    "lines": ("osm_id", "name", "highway", "other_tags"),
    "multipolygons": (
        "osm_id",
        "osm_way_id",
        "name",
        "natural",
        "landuse",
        "leisure",
        "waterway",
        "other_tags",
    ),
    "points": ("osm_id", "name", "place", "railway", "station", "other_tags"),
}


def parse_other_tags(value: object) -> dict[str, str]:
    """Parse GDAL OSM HSTORE text such as ``"name:zh"=>"深南大道"``."""

    if value is None or (isinstance(value, float) and math.isnan(value)):
        return {}
    text = str(value)
    result: dict[str, str] = {}
    for key, item in HSTORE_PAIR.findall(text):
        result[key.replace(r'\"', '"').replace(r"\\", "\\")] = item.replace(
            r'\"', '"'
        ).replace(r"\\", "\\")
    return result


def _json_scalar(value: object) -> object:
    if value is None:
        return None
    try:
        if pd.isna(value):
            return None
    except (TypeError, ValueError):
        pass
    if hasattr(value, "item"):
        value = value.item()
    return value


def _tags(row: Mapping[str, object]) -> dict[str, str]:
    result = parse_other_tags(row.get("other_tags"))
    for key, value in row.items():
        if key in {"geometry", "other_tags"}:
            continue
        scalar = _json_scalar(value)
        if scalar is not None and str(scalar).strip():
            result[key] = str(scalar).strip()
    return result


def _read_layer(source: Path, layer: str, bbox: tuple[float, float, float, float]) -> gpd.GeoDataFrame:
    available = set(pyogrio.read_info(source, layer=layer)["fields"])
    columns = [item for item in LAYER_COLUMNS[layer] if item in available]
    frame = pyogrio.read_dataframe(source, layer=layer, bbox=bbox, columns=columns)
    if frame.crs is None:
        frame = frame.set_crs(4326)
    elif frame.crs.to_epsg() != 4326:
        frame = frame.to_crs(4326)
    return frame


def _load_boundary(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if not data.get("features"):
        raise ValueError(f"Boundary has no features: {path}")
    geometry = shape(data["features"][0]["geometry"])
    return make_valid(geometry), data["features"][0].get("properties", {})


def _buffered_wgs84(geometry, buffer_m: float):
    to_mercator = Transformer.from_crs(4326, 3857, always_xy=True).transform
    to_wgs84 = Transformer.from_crs(3857, 4326, always_xy=True).transform
    return transform(to_wgs84, transform(to_mercator, geometry).buffer(buffer_m))


def _compatible_geometry(geometry, context, family: str, diagnostics: dict[str, Counter], source: str):
    if geometry is None or geometry.is_empty:
        diagnostics["empty_after_clip"][source] += 1
        return None
    if not geometry.is_valid:
        diagnostics["invalid_geometry"][source] += 1
        geometry = make_valid(geometry)
    clipped = geometry.intersection(context)
    if clipped.is_empty:
        diagnostics["empty_after_clip"][source] += 1
        return None
    if family == "polygon":
        parts = _parts(clipped, ("Polygon", "MultiPolygon"))
        polygons = [part for item in parts for part in (list(item.geoms) if item.geom_type == "MultiPolygon" else [item])]
        return unary_union(polygons) if polygons else None
    if family == "line":
        parts = _parts(clipped, ("LineString", "MultiLineString"))
        lines = [part for item in parts for part in (list(item.geoms) if item.geom_type == "MultiLineString" else [item])]
        if not lines:
            return None
        return lines[0] if len(lines) == 1 else MultiLineString(lines)
    return clipped if clipped.geom_type == "Point" else None


def _parts(geometry, accepted: tuple[str, ...]) -> list:
    if geometry.geom_type in accepted:
        return [geometry]
    if isinstance(geometry, GeometryCollection):
        return [part for part in geometry.geoms if part.geom_type in accepted]
    return []


def _feature(geometry, properties: Mapping[str, object]) -> dict[str, Any]:
    return {
        "type": "Feature",
        "geometry": mapping(geometry),
        "properties": {key: _json_scalar(value) for key, value in properties.items()},
    }


def _write_collection(path: Path, features: Iterable[dict[str, Any]]) -> None:
    collection = {"type": "FeatureCollection", "features": list(features)}
    path.write_text(json.dumps(collection, ensure_ascii=False), encoding="utf-8")


def _numeric(value: object) -> float:
    match = NUMBER.search(str(value or ""))
    return float(match.group()) if match else 0.0


def _normalized_label(value: object) -> str:
    return SPACE_RUN.sub("", str(value or "")).casefold()


def _support_places(
    park_points_path: Path,
    metro_points_path: Path,
    context,
    diagnostics: dict[str, Counter],
) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    parks = gpd.read_file(park_points_path).to_crs(4326)
    parks["_area"] = parks.get("MJ", pd.Series(index=parks.index, dtype=object)).map(_numeric)
    parks = parks.sort_values("_area", ascending=False).head(12)
    for _, row in parks.iterrows():
        label = str(row.get("name") or row.get("GYMC") or "").strip()
        if not label:
            diagnostics["missing_label"]["support_park"] += 1
            continue
        geometry = _compatible_geometry(row.geometry, context, "point", diagnostics, "support_park")
        if geometry is not None:
            output.append(
                _feature(
                    geometry,
                    {
                        "source": "深圳政府开放数据",
                        "osm_id": "",
                        "feature_class": "place",
                        "place_class": "park",
                        "label_name": label,
                    },
                )
            )

    metro = gpd.read_file(metro_points_path).to_crs(4326)
    for _, row in metro.iterrows():
        label = str(row.get("station_name") or row.get("name") or "").strip()
        if not label:
            diagnostics["missing_label"]["support_metro"] += 1
            continue
        geometry = _compatible_geometry(row.geometry, context, "point", diagnostics, "support_metro")
        if geometry is not None:
            output.append(
                _feature(
                    geometry,
                    {
                        "source": "深圳政府开放数据",
                        "osm_id": str(row.get("osm_id") or ""),
                        "feature_class": "place",
                        "place_class": "metro",
                        "label_name": label,
                    },
                )
            )
    return output


def _deduplicate_places(features: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, float, float]] = set()
    output: list[dict[str, Any]] = []
    for item in features:
        coordinates = item["geometry"]["coordinates"]
        key = (
            _normalized_label(item["properties"].get("label_name")),
            round(float(coordinates[0]), 5),
            round(float(coordinates[1]), 5),
        )
        if key not in seen:
            seen.add(key)
            output.append(item)
    return output


def extract_basemap(
    pbf_path: Path,
    boundary_path: Path,
    park_points_path: Path,
    metro_points_path: Path,
    output_dir: Path,
    buffer_m: float = 2000.0,
) -> dict[str, Any]:
    """Extract and report the small set of features allowed in the basemap."""

    inputs = [pbf_path, boundary_path, park_points_path, metro_points_path]
    missing = [str(path) for path in inputs if not Path(path).is_file()]
    if missing:
        raise FileNotFoundError("Missing basemap inputs: " + ", ".join(missing))

    pbf_path = Path(pbf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    boundary, boundary_properties = _load_boundary(Path(boundary_path))
    context = _buffered_wgs84(boundary, float(buffer_m))
    diagnostics = {
        "invalid_geometry": Counter(),
        "empty_after_clip": Counter(),
        "missing_label": Counter(),
    }

    roads: list[dict[str, Any]] = []
    for _, row in _read_layer(pbf_path, "lines", context.bounds).iterrows():
        tags = _tags(row)
        road_class = classify_road(tags)
        if road_class is None:
            continue
        label = choose_label(tags)
        if not label:
            diagnostics["missing_label"]["osm_road"] += 1
        geometry = _compatible_geometry(row.geometry, context, "line", diagnostics, "osm_road")
        if geometry is not None:
            roads.append(
                _feature(
                    geometry,
                    {
                        "source": "OpenStreetMap",
                        "osm_id": tags.get("osm_id", ""),
                        "feature_class": "road",
                        "road_class": road_class,
                        "label_name": label,
                    },
                )
            )

    areas: dict[str, list[dict[str, Any]]] = {"water": [], "park": []}
    for _, row in _read_layer(pbf_path, "multipolygons", context.bounds).iterrows():
        tags = _tags(row)
        area_class = classify_area(tags)
        if area_class is None:
            continue
        geometry = _compatible_geometry(row.geometry, context, "polygon", diagnostics, f"osm_{area_class}")
        if geometry is None:
            continue
        label = choose_label(tags)
        areas[area_class].append(
            _feature(
                geometry.simplify(0.000005, preserve_topology=True),
                {
                    "source": "OpenStreetMap",
                    "osm_id": tags.get("osm_id") or tags.get("osm_way_id", ""),
                    "feature_class": area_class,
                    "label_name": label,
                },
            )
        )

    places: list[dict[str, Any]] = []
    for _, row in _read_layer(pbf_path, "points", context.bounds).iterrows():
        tags = _tags(row)
        place_class = classify_place(tags)
        if place_class is None:
            continue
        label = choose_label(tags)
        if not label:
            diagnostics["missing_label"]["osm_place"] += 1
            continue
        geometry = _compatible_geometry(row.geometry, context, "point", diagnostics, "osm_place")
        if geometry is not None:
            places.append(
                _feature(
                    geometry,
                    {
                        "source": "OpenStreetMap",
                        "osm_id": tags.get("osm_id", ""),
                        "feature_class": "place",
                        "place_class": place_class,
                        "label_name": label,
                    },
                )
            )

    places.extend(
        _support_places(Path(park_points_path), Path(metro_points_path), context, diagnostics)
    )
    places = _deduplicate_places(places)

    district_label = str(boundary_properties.get("name") or "福田区")
    boundary_feature = _feature(
        boundary,
        {
            "source": boundary_properties.get("source", "OpenStreetMap"),
            "osm_id": boundary_properties.get("osm_id", ""),
            "feature_class": "district",
            "label_name": district_label,
        },
    )
    context_feature = _feature(
        context,
        {
            "source": "derived",
            "osm_id": "",
            "feature_class": "context",
            "label_name": "",
        },
    )

    outputs = {
        "context.geojson": [context_feature],
        "water.geojson": areas["water"],
        "parks.geojson": areas["park"],
        "roads.geojson": roads,
        "places.geojson": places,
        "boundary.geojson": [boundary_feature],
    }
    for name, features in outputs.items():
        _write_collection(output_dir / name, features)

    counts = {
        "context": 1,
        "water": len(areas["water"]),
        "parks": len(areas["park"]),
        "roads": len(roads),
        "places": len(places),
        "boundary": 1,
    }
    status = "passed" if all(counts.values()) else "failed"
    report: dict[str, Any] = {
        "status": status,
        "input": str(pbf_path.resolve()),
        "buffer_m": float(buffer_m),
        **counts,
        "diagnostics": {
            category: dict(counter) for category, counter in diagnostics.items()
        },
    }
    (output_dir / "extraction_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if status != "passed":
        raise RuntimeError(f"Required basemap layer is empty; see {output_dir / 'extraction_report.json'}")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pbf", type=Path, required=True)
    parser.add_argument("--boundary", type=Path, required=True)
    parser.add_argument("--park-points", type=Path, required=True)
    parser.add_argument("--metro-points", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--buffer-m", type=float, default=2000.0)
    args = parser.parse_args()
    report = extract_basemap(
        args.pbf,
        args.boundary,
        args.park_points,
        args.metro_points,
        args.output,
        args.buffer_m,
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
