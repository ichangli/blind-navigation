import json
from pathlib import Path

import geopandas as gpd
from shapely.geometry import LineString, Polygon

from basemap.build_showcase_data import (
    build_showcase_data,
    derive_roads,
    derive_water,
)


def _water_frame() -> gpd.GeoDataFrame:
    medium = Polygon([(0, 0), (200, 0), (200, 200), (0, 200)])
    overlapping = Polygon([(100, 0), (300, 0), (300, 200), (100, 200)])
    tiny = Polygon([(1000, 0), (1020, 0), (1020, 20), (1000, 20)])
    major = Polygon([(2000, 0), (2400, 0), (2400, 400), (2000, 400)])
    return gpd.GeoDataFrame(
        {
            "label_name": ["测试湖", "测试湖", "碎水面", "深圳湾"],
            "osm_id": ["1", "2", "3", "4"],
        },
        geometry=[medium, overlapping, tiny, major],
        crs="EPSG:3857",
    )


def _road_frame() -> gpd.GeoDataFrame:
    return gpd.GeoDataFrame(
        {
            "road_class": [
                "expressway",
                "expressway",
                "primary",
                "secondary",
                "secondary",
                "secondary",
                "secondary",
                "expressway",
                "tertiary",
            ],
            "label_name": [
                "北环大道",
                "北环大道",
                "深南大道",
                "短次干路",
                "短次干路",
                "长次干路",
                "长次干路",
                "",
                "普通路",
            ],
        },
        geometry=[
            LineString([(0, 0), (1000, 0)]),
            LineString([(1000, 0), (2000, 0)]),
            LineString([(0, 100), (500, 100)]),
            LineString([(0, 200), (1000, 200)]),
            LineString([(1000, 200), (2000, 200)]),
            LineString([(0, 300), (2000, 300)]),
            LineString([(2000, 300), (4000, 300)]),
            LineString([(0, 400), (5000, 400)]),
            LineString([(0, 500), (5000, 500)]),
        ],
        crs="EPSG:3857",
    )


def test_water_union_removes_fragments_and_assigns_classes():
    result = derive_water(_water_frame())

    assert len(result) == 2
    assert result.crs.to_epsg() == 3857
    assert set(result["water_class"]) == {"medium", "major"}
    assert result.geometry.is_valid.all()
    assert not result.geometry.is_empty.any()
    assert result["area_m2"].min() == 60000.0
    assert result.loc[result["water_class"] == "major", "label_name"].iloc[0] == "深圳湾"


def test_roads_are_named_filtered_and_dissolved_by_class_and_label():
    result = derive_roads(_road_frame())

    assert set(result["label_name"]) == {"北环大道", "深南大道", "长次干路"}
    assert len(result) == 3
    assert result.loc[result["label_name"] == "北环大道", "segment_count"].iloc[0] == 2
    assert result.loc[result["label_name"] == "长次干路", "length_m"].iloc[0] == 4000.0
    expressway = result[result["road_class"] == "expressway"].iloc[0]
    assert expressway["glow_width"] == 10.0
    assert expressway["casing_width"] == 5.0
    assert expressway["core_width"] == 2.6


def test_build_showcase_data_writes_geojson_and_report(tmp_path: Path):
    source = tmp_path / "source"
    output = tmp_path / "output"
    source.mkdir()
    _water_frame().to_crs(4326).to_file(source / "water.geojson", driver="GeoJSON")
    _road_frame().to_crs(4326).to_file(source / "roads.geojson", driver="GeoJSON")

    report = build_showcase_data(source, output)

    assert report["status"] == "passed"
    assert report["water"]["output_count"] == 2
    assert report["roads"]["output_count"] == 3
    assert (output / "showcase_water.geojson").is_file()
    assert (output / "showcase_roads.geojson").is_file()
    stored = json.loads((output / "showcase_data_report.json").read_text(encoding="utf-8"))
    assert stored == report
