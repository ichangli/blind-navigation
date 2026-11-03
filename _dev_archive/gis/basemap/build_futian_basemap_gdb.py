"""Build the Web Mercator file geodatabase for the Futian vector basemap."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any

import arcpy


APPROVED_OUTPUT_ROOT = Path(r"E:\GIS_data\futian_deepsea_basemap")
EXPECTED = {
    "context.geojson": ("DeepSeaContext", "POLYGON"),
    "water.geojson": ("DeepSeaWater", "POLYGON"),
    "parks.geojson": ("DeepSeaParks", "POLYGON"),
    "roads.geojson": ("DeepSeaRoads", "POLYLINE"),
    "places.geojson": ("DeepSeaPlaces", "POINT"),
    "boundary.geojson": ("FutianBoundary", "POLYGON"),
}


def _normalized(path: Path) -> str:
    return os.path.normcase(os.path.abspath(os.fspath(path)))


def validate_paths(input_dir: Path, output_root: Path) -> None:
    """Reject missing inputs and writes outside the approved derived-data root."""

    missing = [name for name in EXPECTED if not (Path(input_dir) / name).is_file()]
    if missing:
        raise FileNotFoundError("Missing basemap inputs: " + ", ".join(missing))
    if _normalized(Path(output_root)) != _normalized(APPROVED_OUTPUT_ROOT):
        raise ValueError("Refusing to write outside the approved derived-data directory")


def _empty_geometry_count(feature_class: str) -> int:
    count = 0
    with arcpy.da.SearchCursor(feature_class, ["SHAPE@"]) as rows:
        for (geometry,) in rows:
            if geometry is None or geometry.pointCount == 0:
                count += 1
    return count


def _feature_class_report(feature_class: str) -> dict[str, Any]:
    description = arcpy.Describe(feature_class)
    extent = description.extent
    return {
        "count": int(arcpy.management.GetCount(feature_class)[0]),
        "empty_geometry": _empty_geometry_count(feature_class),
        "spatial_reference": description.spatialReference.name,
        "extent": [extent.XMin, extent.YMin, extent.XMax, extent.YMax],
    }


def _add_indexes(feature_class: str) -> None:
    fields = {field.name.lower(): field.name for field in arcpy.ListFields(feature_class)}
    for key in ("road_class", "feature_class", "label_name"):
        if key in fields:
            arcpy.management.AddIndex(
                feature_class,
                fields[key],
                f"idx_{key}",
                "NON_UNIQUE",
                "NON_ASCENDING",
            )


def build_geodatabase(input_dir: Path, output_root: Path) -> dict[str, Any]:
    """Import the extracted GeoJSON products and project them to EPSG:3857."""

    input_dir = Path(input_dir)
    output_root = Path(output_root)
    validate_paths(input_dir, output_root)
    output_root.mkdir(parents=True, exist_ok=True)
    gdb_path = output_root / "FutianDeepSeaBasemap.gdb"
    if not arcpy.Exists(str(gdb_path)):
        arcpy.management.CreateFileGDB(str(output_root), gdb_path.name)

    arcpy.env.overwriteOutput = True
    target_spatial_reference = arcpy.SpatialReference(3857)
    report: dict[str, Any] = {
        "status": "building",
        "input_dir": str(input_dir.resolve()),
        "geodatabase": str(gdb_path),
        "feature_classes": {},
    }

    for input_name, (feature_name, geometry_type) in EXPECTED.items():
        scratch_name = f"tmp_ds_{feature_name.lower()}"
        scratch_path = os.path.join(arcpy.env.scratchGDB, scratch_name)
        final_path = os.path.join(str(gdb_path), feature_name)
        if arcpy.Exists(scratch_path):
            arcpy.management.Delete(scratch_path)
        if arcpy.Exists(final_path):
            arcpy.management.Delete(final_path)
        arcpy.conversion.JSONToFeatures(
            str(input_dir / input_name),
            scratch_path,
            geometry_type,
        )
        arcpy.management.Project(scratch_path, final_path, target_spatial_reference)
        arcpy.management.Delete(scratch_path)
        _add_indexes(final_path)
        report["feature_classes"][feature_name] = _feature_class_report(final_path)

    failed = {
        name: details
        for name, details in report["feature_classes"].items()
        if details["count"] == 0 or details["empty_geometry"] != 0
    }
    report["status"] = "passed" if not failed else "failed"
    report["failed_feature_classes"] = sorted(failed)
    report_path = output_root / "gdb_report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if failed:
        raise RuntimeError(f"Geodatabase validation failed; see {report_path}")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    args = parser.parse_args()
    report = build_geodatabase(args.input_dir, args.output_root)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
