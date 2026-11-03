"""Validate the generated Futian deep-sea basemap artifacts before publication."""

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


def _load_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


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


def _inspect_vtpk(path: Path) -> dict[str, Any]:
    result: dict[str, Any] = {
        "structure": False,
        "font_resources_resolved": False,
        "font_filenames_utf8": False,
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
        if "p12/resources/styles/root.json" not in names:
            return result
        style = json.loads(
            archive.read("p12/resources/styles/root.json").decode("utf-8")
        )
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
            info
            for info in archive.infolist()
            if info.filename.startswith(prefix)
        ]
        non_ascii_entries = [
            info for info in font_entries if not info.filename.isascii()
        ]
        result["referenced_fonts"] = referenced
        result["packaged_fonts"] = packaged
        result["font_resources_resolved"] = bool(referenced) and set(referenced).issubset(
            packaged
        )
        result["font_filenames_utf8"] = all(
            bool(info.flag_bits & 0x800) for info in non_ascii_entries
        )
    return result


def validate_package(root: Path, max_bytes: int = MAX_BYTES) -> dict[str, Any]:
    """Return a complete validation report without raising on missing artifacts."""

    root = Path(root)
    vtpk = root / "FutianDeepSeaBasemap.vtpk"
    project = root / "FutianDeepSeaBasemap.aprx"
    extraction = _load_json(root / "geojson" / "extraction_report.json")
    gdb = _load_json(root / "gdb_report.json")
    map_package = _load_json(root / "map_package_report.json")
    inspection = _inspect_vtpk(vtpk)
    gdb_feature_classes = gdb.get("feature_classes", {})
    gdb_layers_valid = bool(gdb_feature_classes) and all(
        item.get("count", 0) > 0 and item.get("empty_geometry", 1) == 0
        for item in gdb_feature_classes.values()
    )
    vtpk_size = vtpk.stat().st_size if vtpk.is_file() else 0
    checks = {
        "vtpk_exists": vtpk.is_file(),
        "vtpk_nonempty": vtpk_size > 0,
        "vtpk_under_250_mb": 0 < vtpk_size <= int(max_bytes),
        "vtpk_structure": inspection["structure"],
        "font_resources_resolved": inspection["font_resources_resolved"],
        "font_filenames_utf8": inspection["font_filenames_utf8"],
        "project_exists": project.is_file() and project.stat().st_size > 0,
        "extraction_passed": extraction.get("status") == "passed",
        "gdb_passed": gdb.get("status") == "passed" and gdb_layers_valid,
        "map_package_passed": map_package.get("status") == "packaged"
        and map_package.get("layer_count", 0) >= 10,
    }
    report: dict[str, Any] = {
        "status": "passed" if all(checks.values()) else "failed",
        "root": str(root.resolve()),
        "checks": checks,
        "vtpk_size_bytes": vtpk_size,
        "vtpk_size_mib": round(vtpk_size / (1024 * 1024), 2),
        "vtpk_sha256": _sha256(vtpk) if vtpk.is_file() else "",
        "vtpk_inspection": inspection,
        "data_counts": {
            key: extraction.get(key, 0)
            for key in ("context", "water", "parks", "roads", "places", "boundary")
        },
        "notes": [
            "ArcGIS Pro may warn that locale/codepage/936.txt is absent on this installation.",
            "The package is accepted only when referenced font stacks exist and non-ASCII font paths carry the ZIP UTF-8 flag.",
        ],
    }
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    report = validate_package(args.root)
    output = args.root / "validation_report.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["status"] != "passed":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
