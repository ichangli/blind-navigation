"""Validate every generated Futian showcase artifact before publication."""

from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from pathlib import Path
from typing import Any, Iterable


MAX_BYTES = 250 * 1024 * 1024
REQUIRED_VTPK_ENTRIES = {
    "esriinfo/iteminfo.xml",
    "p12/root.json",
    "p12/resources/styles/root.json",
}
REQUIRED_FEATURE_CLASSES = {
    "ShowcaseContext",
    "ShowcaseParks",
    "ShowcasePlaces",
    "FutianBoundary",
    "ShowcaseWater",
    "ShowcaseRoads",
}


def _load_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _layer_file_valid(path: Path) -> bool:
    try:
        document = _load_json(path)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return False
    return (
        document.get("type") == "CIMLayerDocument"
        and bool(document.get("layers"))
        and bool(document.get("layerDefinitions"))
    )


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _font_stacks(value: object) -> Iterable[str]:
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "text-font" and isinstance(item, list):
                for font in item:
                    if isinstance(font, str) and font:
                        yield font
            else:
                yield from _font_stacks(item)
    elif isinstance(value, list):
        for item in value:
            yield from _font_stacks(item)


def _showcase_style_contract(style: dict[str, Any]) -> bool:
    layers = {
        str(layer.get("id", "")): layer
        for layer in style.get("layers", [])
        if isinstance(layer, dict)
    }
    water_ids = ["水域-小型", "水域-中型", "水域-主要"]
    if not all(
        layers.get(layer_id, {}).get("type") == "fill"
        and layers[layer_id].get("paint", {}).get("fill-color")
        for layer_id in water_ids
    ):
        return False
    water_colors = {
        layers[layer_id]["paint"]["fill-color"] for layer_id in water_ids
    }
    if len(water_colors) != 3:
        return False
    for road_name in ("精选次干路", "主干路", "快速路"):
        ids = [
            f"道路-{road_name}-外发光",
            f"道路-{road_name}-暗色包边",
            f"道路-{road_name}-高亮核心",
        ]
        if not all(layers.get(layer_id, {}).get("type") == "line" for layer_id in ids):
            return False
        widths = [layers[layer_id].get("paint", {}).get("line-width", 0) for layer_id in ids]
        if not all(isinstance(width, (int, float)) for width in widths):
            return False
        if not widths[0] > widths[1] > widths[2] > 0:
            return False
    return True


def _inspect_vtpk(path: Path) -> dict[str, Any]:
    result: dict[str, Any] = {
        "structure": False,
        "font_resources_resolved": False,
        "font_filenames_utf8": False,
        "showcase_style_contract": False,
        "referenced_fonts": [],
        "packaged_fonts": [],
        "entry_count": 0,
    }
    if not path.is_file() or not zipfile.is_zipfile(path):
        return result
    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
        result["entry_count"] = len(names)
        result["structure"] = REQUIRED_VTPK_ENTRIES.issubset(names)
        style_path = "p12/resources/styles/root.json"
        if style_path not in names:
            return result
        style = json.loads(archive.read(style_path).decode("utf-8"))
        result["showcase_style_contract"] = _showcase_style_contract(style)
        referenced = sorted(set(_font_stacks(style)))
        prefix = "p12/resources/fonts/"
        packaged = sorted(
            {
                name[len(prefix) :].split("/", 1)[0]
                for name in names
                if name.startswith(prefix) and "/" in name[len(prefix) :]
            }
        )
        font_entries = [
            info for info in archive.infolist() if info.filename.startswith(prefix)
        ]
        non_ascii_entries = [info for info in font_entries if not info.filename.isascii()]
        result["referenced_fonts"] = referenced
        result["packaged_fonts"] = packaged
        result["font_resources_resolved"] = bool(referenced) and set(referenced).issubset(
            packaged
        )
        result["font_filenames_utf8"] = all(
            bool(info.flag_bits & 0x800) for info in non_ascii_entries
        )
    return result


def _feature_classes_valid(feature_classes: dict[str, Any]) -> bool:
    if not REQUIRED_FEATURE_CLASSES.issubset(feature_classes):
        return False
    return all(
        int(feature_classes[name].get("count", 0)) > 0
        and int(feature_classes[name].get("empty_geometry", 1)) == 0
        for name in REQUIRED_FEATURE_CLASSES
    )


def _required_fields_valid(feature_classes: dict[str, Any]) -> bool:
    water = set(feature_classes.get("ShowcaseWater", {}).get("fields", []))
    roads = set(feature_classes.get("ShowcaseRoads", {}).get("fields", []))
    return {
        "waterbody_size",
        "wave_strength",
        "display_rank",
    }.issubset(water) and {
        "glow_width",
        "casing_width",
        "core_width",
        "display_rank",
    }.issubset(roads)


def validate_showcase(
    root: Path,
    max_bytes: int = MAX_BYTES,
    data_report_name: str = "geojson/showcase_data_report.json",
) -> dict[str, Any]:
    """Return an evidence report without raising for incomplete products."""

    root = Path(root)
    vtpk = root / "FutianShowcaseBasemap.vtpk"
    project = root / "FutianShowcaseBasemap.aprx"
    gdb_path = root / "FutianShowcaseBasemap.gdb"
    layer_files = [root / "ShowcaseWater.lyrx", root / "ShowcaseRoads.lyrx"]
    data_report = _load_json(root / data_report_name)
    gdb_report = _load_json(root / "gdb_report.json")
    map_report = _load_json(root / "map_package_report.json")
    manifest = _load_json(root / "publication_manifest.json")
    inspection = _inspect_vtpk(vtpk)
    feature_classes = gdb_report.get("feature_classes", {})
    water_count = int(data_report.get("water", {}).get("output_count", 0))
    road_count = int(data_report.get("roads", {}).get("output_count", 0))
    gdb_water_count = int(feature_classes.get("ShowcaseWater", {}).get("count", 0))
    gdb_road_count = int(feature_classes.get("ShowcaseRoads", {}).get("count", 0))
    maps = map_report.get("maps", {})
    vtpk_size = vtpk.stat().st_size if vtpk.is_file() else 0

    checks = {
        "vtpk_exists": vtpk.is_file(),
        "vtpk_nonempty": vtpk_size > 0,
        "vtpk_under_250_mb": 0 < vtpk_size <= int(max_bytes),
        "vtpk_structure": bool(inspection["structure"]),
        "font_resources_resolved": bool(inspection["font_resources_resolved"]),
        "font_filenames_utf8": bool(inspection["font_filenames_utf8"]),
        "showcase_style_contract": bool(inspection["showcase_style_contract"]),
        "project_exists": project.is_file() and project.stat().st_size > 0,
        "gdb_exists": gdb_path.is_dir(),
        "layer_files_valid": all(_layer_file_valid(path) for path in layer_files),
        "data_derivation_passed": data_report.get("status") == "passed"
        and water_count > 0
        and road_count > 0,
        "gdb_passed": gdb_report.get("status") == "passed"
        and _feature_classes_valid(feature_classes),
        "required_fields_present": _required_fields_valid(feature_classes),
        "data_count_consistency": water_count == gdb_water_count > 0
        and road_count == gdb_road_count > 0,
        "map_package_passed": map_report.get("status") == "packaged"
        and len(maps.get("FutianShowcaseBasemap", [])) >= 22
        and len(maps.get("FutianShowcaseOperationalLayers", [])) >= 2,
        "publication_manifest_complete": len(manifest.get("publish_order", [])) == 3,
    }
    report: dict[str, Any] = {
        "status": "passed" if all(checks.values()) else "failed",
        "root": str(root.resolve()),
        "checks": checks,
        "data_counts": {"water": water_count, "roads": road_count},
        "vtpk_size_bytes": vtpk_size,
        "vtpk_size_mib": round(vtpk_size / (1024 * 1024), 2),
        "vtpk_sha256": _sha256(vtpk) if vtpk.is_file() else "",
        "vtpk_inspection": inspection,
        "manual_checks": [
            "Open FutianShowcaseBasemap.aprx and inspect approximately 1:150,000, 1:30,000, and 1:5,000.",
            "Confirm the glow skeleton stays subordinate to buildings and navigation overlays.",
            "Confirm major-water and Chinese road labels do not collide excessively.",
        ],
    }
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    report = validate_showcase(args.root)
    output = args.root / "validation_report.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["status"] != "passed":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
