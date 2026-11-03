import json
import zipfile
from pathlib import Path

from basemap.validate_futian_basemap import validate_package


def _write_valid_fixture(root: Path) -> None:
    (root / "geojson").mkdir(parents=True)
    (root / "geojson" / "extraction_report.json").write_text(
        json.dumps({"status": "passed"}), encoding="utf-8"
    )
    (root / "gdb_report.json").write_text(
        json.dumps(
            {
                "status": "passed",
                "feature_classes": {
                    "DeepSeaRoads": {"count": 10, "empty_geometry": 0}
                },
            }
        ),
        encoding="utf-8",
    )
    (root / "map_package_report.json").write_text(
        json.dumps({"status": "packaged", "layer_count": 14}), encoding="utf-8"
    )
    (root / "FutianDeepSeaBasemap.aprx").write_bytes(b"aprx")
    with zipfile.ZipFile(root / "FutianDeepSeaBasemap.vtpk", "w") as archive:
        archive.writestr("esriinfo/iteminfo.xml", "<item />")
        archive.writestr("p12/root.json", "{}")
        archive.writestr(
            "p12/resources/styles/root.json",
            json.dumps({"layers": [{"layout": {"text-font": ["Ascii Font"]}}]}),
        )
        archive.writestr("p12/resources/fonts/Ascii Font/0-255.pbf", b"font")


def test_validate_package_accepts_complete_small_package(tmp_path):
    _write_valid_fixture(tmp_path)
    report = validate_package(tmp_path)
    assert report["status"] == "passed"
    assert report["checks"]["vtpk_structure"] is True
    assert report["checks"]["font_resources_resolved"] is True
    assert len(report["vtpk_sha256"]) == 64


def test_validate_package_rejects_missing_outputs(tmp_path):
    report = validate_package(tmp_path)
    assert report["status"] == "failed"
    assert report["checks"]["vtpk_exists"] is False
    assert report["checks"]["project_exists"] is False


def test_validate_package_enforces_size_limit(tmp_path):
    _write_valid_fixture(tmp_path)
    report = validate_package(tmp_path, max_bytes=1)
    assert report["status"] == "failed"
    assert report["checks"]["vtpk_under_250_mb"] is False
