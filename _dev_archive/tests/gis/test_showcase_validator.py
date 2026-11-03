import json
import zipfile
from pathlib import Path

from basemap.validate_futian_showcase import validate_showcase


def _write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")


def _write_fake_vtpk(path: Path) -> None:
    style = {
        "version": 8,
        "layers": [
            {"id": "水域-小型", "type": "fill", "paint": {"fill-color": "rgba(7,68,94,0.82)"}},
            {"id": "水域-中型", "type": "fill", "paint": {"fill-color": "rgba(8,96,125,0.88)"}},
            {"id": "水域-主要", "type": "fill", "paint": {"fill-color": "rgba(8,125,160,0.96)"}},
            {"id": "道路-精选次干路-外发光", "type": "line", "paint": {"line-width": 8}},
            {"id": "道路-精选次干路-暗色包边", "type": "line", "paint": {"line-width": 4}},
            {"id": "道路-精选次干路-高亮核心", "type": "line", "paint": {"line-width": 1.86667}},
            {"id": "道路-主干路-外发光", "type": "line", "paint": {"line-width": 10.6667}},
            {"id": "道路-主干路-暗色包边", "type": "line", "paint": {"line-width": 5.33333}},
            {"id": "道路-主干路-高亮核心", "type": "line", "paint": {"line-width": 2.66667}},
            {"id": "道路-快速路-外发光", "type": "line", "paint": {"line-width": 13.3333}},
            {"id": "道路-快速路-暗色包边", "type": "line", "paint": {"line-width": 6.66667}},
            {"id": "道路-快速路-高亮核心", "type": "line", "paint": {"line-width": 3.46667}},
            {
                "id": "labels",
                "type": "symbol",
                "layout": {"text-font": ["Microsoft YaHei Regular"]},
            }
        ],
    }
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr("esriinfo/iteminfo.xml", "<item />")
        archive.writestr("p12/root.json", "{}")
        archive.writestr("p12/resources/styles/root.json", json.dumps(style))
        archive.writestr(
            "p12/resources/fonts/Microsoft YaHei Regular/0-255.pbf",
            b"font",
        )


def test_missing_showcase_artifacts_fail_without_raising(tmp_path: Path):
    report = validate_showcase(tmp_path)
    assert report["status"] == "failed"
    assert not report["checks"]["vtpk_exists"]
    assert not report["checks"]["project_exists"]
    assert report["vtpk_sha256"] == ""


def test_header_only_layer_files_are_rejected(tmp_path: Path):
    header = {"type": "CIMLayerDocument", "version": "3.6.0", "build": 59527}
    (tmp_path / "ShowcaseWater.lyrx").write_text(json.dumps(header), encoding="utf-8")
    (tmp_path / "ShowcaseRoads.lyrx").write_text(json.dumps(header), encoding="utf-8")
    report = validate_showcase(tmp_path)
    assert not report["checks"]["layer_files_valid"]


def test_complete_consistent_showcase_artifacts_pass(tmp_path: Path):
    (tmp_path / "FutianShowcaseBasemap.gdb").mkdir()
    (tmp_path / "FutianShowcaseBasemap.aprx").write_bytes(b"aprx")
    layer_document = {
        "type": "CIMLayerDocument",
        "layers": ["CIMPATH=map/layer.json"],
        "layerDefinitions": [{"type": "CIMFeatureLayer"}],
    }
    (tmp_path / "ShowcaseWater.lyrx").write_text(json.dumps(layer_document), encoding="utf-8")
    (tmp_path / "ShowcaseRoads.lyrx").write_text(json.dumps(layer_document), encoding="utf-8")
    _write_fake_vtpk(tmp_path / "FutianShowcaseBasemap.vtpk")
    _write_json(
        tmp_path / "geojson_report.json",
        {
            "status": "passed",
            "water": {"output_count": 2},
            "roads": {"output_count": 3},
        },
    )
    _write_json(
        tmp_path / "gdb_report.json",
        {
            "status": "passed",
            "feature_classes": {
                "ShowcaseContext": {"count": 1, "empty_geometry": 0},
                "ShowcaseParks": {"count": 1, "empty_geometry": 0},
                "ShowcasePlaces": {"count": 1, "empty_geometry": 0},
                "FutianBoundary": {"count": 1, "empty_geometry": 0},
                "ShowcaseWater": {
                    "count": 2,
                    "empty_geometry": 0,
                    "fields": ["waterbody_size", "wave_strength", "display_rank"],
                },
                "ShowcaseRoads": {
                    "count": 3,
                    "empty_geometry": 0,
                    "fields": ["glow_width", "casing_width", "core_width", "display_rank"],
                },
            },
        },
    )
    _write_json(
        tmp_path / "map_package_report.json",
        {
            "status": "packaged",
            "maps": {
                "FutianShowcaseBasemap": [f"layer-{index}" for index in range(22)],
                "FutianShowcaseOperationalLayers": ["water", "roads"],
            },
        },
    )
    _write_json(
        tmp_path / "publication_manifest.json",
        {"publish_order": [{}, {}, {}]},
    )

    report = validate_showcase(tmp_path, data_report_name="geojson_report.json")

    assert report["status"] == "passed"
    assert all(report["checks"].values())
    assert len(report["vtpk_sha256"]) == 64
    assert report["data_counts"] == {"water": 2, "roads": 3}
    assert report["vtpk_inspection"]["font_resources_resolved"]
    assert report["checks"]["showcase_style_contract"]
