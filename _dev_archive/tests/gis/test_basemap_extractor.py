import json
from pathlib import Path

import geopandas as gpd
from shapely.geometry import LineString, Point, Polygon, mapping

from basemap.extract_futian_basemap import extract_basemap, parse_other_tags


def _write_geojson(path: Path, features: list[dict]) -> None:
    path.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False),
        encoding="utf-8",
    )


def _feature(geometry, **properties) -> dict:
    return {"type": "Feature", "geometry": mapping(geometry), "properties": properties}


def _write_osm_like_container(path: Path) -> None:
    lines = gpd.GeoDataFrame(
        {
            "osm_id": ["101", "102"],
            "name": ["Primary Road", "Local Road"],
            "highway": ["primary", "residential"],
            "other_tags": ['"name:zh"=>"测试大道"', None],
        },
        geometry=[
            LineString([(-0.005, 0.000), (0.005, 0.000)]),
            LineString([(-0.005, 0.002), (0.005, 0.002)]),
        ],
        crs="EPSG:4326",
    )
    lines.to_file(path, layer="lines", driver="GPKG")

    multipolygons = gpd.GeoDataFrame(
        {
            "osm_id": ["201", "202"],
            "name": ["Test Water", "Test Park"],
            "natural": ["water", None],
            "landuse": [None, None],
            "leisure": [None, "park"],
            "waterway": [None, None],
            "other_tags": [None, '"name:zh"=>"测试公园面"'],
        },
        geometry=[
            Polygon([(-0.004, -0.004), (-0.001, -0.004), (-0.001, -0.001), (-0.004, -0.001)]),
            Polygon([(0.001, -0.004), (0.004, -0.004), (0.004, -0.001), (0.001, -0.001)]),
        ],
        crs="EPSG:4326",
    )
    multipolygons.to_file(path, layer="multipolygons", driver="GPKG")

    points = gpd.GeoDataFrame(
        {
            "osm_id": ["301", "302"],
            "name": ["Test Neighbourhood", "Test Cafe"],
            "place": ["neighbourhood", None],
            "other_tags": ['"name:zh"=>"测试社区"', '"amenity"=>"cafe"'],
        },
        geometry=[Point(0.000, 0.004), Point(0.002, 0.004)],
        crs="EPSG:4326",
    )
    points.to_file(path, layer="points", driver="GPKG")


def test_parse_other_tags_handles_gdal_osm_text():
    assert parse_other_tags('"name:zh"=>"深南大道","station"=>"subway"') == {
        "name:zh": "深南大道",
        "station": "subway",
    }
    assert parse_other_tags(None) == {}


def test_extract_basemap_keeps_only_quiet_context(tmp_path):
    source = tmp_path / "sample.gpkg"
    boundary = tmp_path / "boundary.geojson"
    park_points = tmp_path / "parks.geojson"
    metro_points = tmp_path / "metro.geojson"
    output = tmp_path / "out"

    _write_osm_like_container(source)
    _write_geojson(
        boundary,
        [_feature(Polygon([(-0.01, -0.01), (0.01, -0.01), (0.01, 0.01), (-0.01, 0.01)]), name="测试区")],
    )
    _write_geojson(park_points, [_feature(Point(0.004, 0.004), name="政府公园", MJ="1000")])
    _write_geojson(metro_points, [_feature(Point(0.005, 0.005), station_name="测试站")])

    report = extract_basemap(source, boundary, park_points, metro_points, output, buffer_m=2000)

    assert report["roads"] == 1
    assert report["water"] == 1
    assert report["parks"] == 1
    assert report["places"] == 3
    assert report["buffer_m"] == 2000.0
    assert report["status"] == "passed"

    roads = json.loads((output / "roads.geojson").read_text(encoding="utf-8"))
    assert roads["features"][0]["properties"]["road_class"] == "primary"
    assert roads["features"][0]["properties"]["label_name"] == "测试大道"

    places = json.loads((output / "places.geojson").read_text(encoding="utf-8"))
    assert {item["properties"]["place_class"] for item in places["features"]} == {
        "neighbourhood",
        "park",
        "metro",
    }
