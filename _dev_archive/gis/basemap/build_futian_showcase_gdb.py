"""Build an isolated Web Mercator geodatabase for the Futian showcase basemap."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any

import arcpy


APPROVED_OUTPUT_ROOT = Path(r"E:\GIS_data\futian_showcase_basemap")
DEFAULT_SOURCE_INPUT = Path(r"E:\GIS_data\futian_deepsea_basemap\geojson")
DEFAULT_DERIVED_INPUT = APPROVED_OUTPUT_ROOT / "geojson"
SOURCE_EXPECTED = {
    "context.geojson": ("ShowcaseContext", "POLYGON"),
    "parks.geojson": ("ShowcaseParks", "POLYGON"),
    "places.geojson": ("ShowcasePlaces", "POINT"),
    "boundary.geojson": ("FutianBoundary", "POLYGON"),
}
DERIVED_EXPECTED = {
    "showcase_water.geojson": ("ShowcaseWater", "POLYGON"),
    "showcase_roads.geojson": ("ShowcaseRoads", "POLYLINE"),
}


def _normalized(path: Path) -> str:
    return os.path.normcase(os.path.abspath(os.fspath(path)))


def validate_paths(source_input: Path, derived_input: Path, output_root: Path) -> None:
    """Validate the two read-only input sets and isolate every output write."""

    missing = [
        str(Path(source_input) / name)
        for name in SOURCE_EXPECTED
        if not (Path(source_input) / name).is_file()
    ]
    missing.extend(
        str(Path(derived_input) / name)
        for name in DERIVED_EXPECTED
        if not (Path(derived_input) / name).is_file()
    )
    if missing:
        raise FileNotFoundError("Missing showcase inputs: " + ", ".join(missing))
    if _normalized(Path(output_root)) != _normalized(APPROVED_OUTPUT_ROOT):
        raise ValueError("Refusing to write outside the approved showcase directory")


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
        "fields": [field.name for field in arcpy.ListFields(feature_class)],
    }


def _add_indexes(feature_class: str) -> None:
    fields = {field.name.lower(): field.name for field in arcpy.ListFields(feature_class)}
    for key in (
        "road_class",
        "water_class",
        "display_rank",
        "label_name",
        "road_id",
        "water_id",
    ):
        if key in fields:
            arcpy.management.AddIndex(
                feature_class,
                fields[key],
                f"idx_{key}",
                "NON_UNIQUE",
                "NON_ASCENDING",
            )


def _import_feature_class(
    input_path: Path,
    gdb_path: Path,
    feature_name: str,
    geometry_type: str,
    target_spatial_reference,
) -> str:
    scratch_name = f"tmp_show_{feature_name.lower()}"
    scratch_path = os.path.join(arcpy.env.scratchGDB, scratch_name)
    final_path = os.path.join(str(gdb_path), feature_name)
    if arcpy.Exists(scratch_path):
        arcpy.management.Delete(scratch_path)
    if arcpy.Exists(final_path):
        arcpy.management.Delete(final_path)
    arcpy.conversion.JSONToFeatures(str(input_path), scratch_path, geometry_type)
    arcpy.management.Project(scratch_path, final_path, target_spatial_reference)
    arcpy.management.Delete(scratch_path)
    _add_indexes(final_path)
    return final_path


def build_geodatabase(
    source_input: Path,
    derived_input: Path,
    output_root: Path,
) -> dict[str, Any]:
    """Import quiet context and derived showcase layers into a new GDB."""

    source_input = Path(source_input)
    derived_input = Path(derived_input)
    output_root = Path(output_root)
    validate_paths(source_input, derived_input, output_root)
    output_root.mkdir(parents=True, exist_ok=True)
    gdb_path = output_root / "FutianShowcaseBasemap.gdb"
    if not arcpy.Exists(str(gdb_path)):
        arcpy.management.CreateFileGDB(str(output_root), gdb_path.name)

    arcpy.env.overwriteOutput = True
    target_spatial_reference = arcpy.SpatialReference(3857)
    report: dict[str, Any] = {
        "status": "building",
        "source_input": str(source_input.resolve()),
        "derived_input": str(derived_input.resolve()),
        "geodatabase": str(gdb_path),
        "feature_classes": {},
    }
    jobs = [
        (source_input / name, feature_name, geometry_type)
        for name, (feature_name, geometry_type) in SOURCE_EXPECTED.items()
    ]
    jobs.extend(
        (derived_input / name, feature_name, geometry_type)
        for name, (feature_name, geometry_type) in DERIVED_EXPECTED.items()
    )
    for input_path, feature_name, geometry_type in jobs:
        final_path = _import_feature_class(
            input_path,
            gdb_path,
            feature_name,
            geometry_type,
            target_spatial_reference,
        )
        report["feature_classes"][feature_name] = _feature_class_report(final_path)

    failed = {
        name: details
        for name, details in report["feature_classes"].items()
        if details["count"] == 0
        or details["empty_geometry"] != 0
        or details["spatial_reference"] != "WGS_1984_Web_Mercator_Auxiliary_Sphere"
    }
    report["status"] = "passed" if not failed else "failed"
    report["failed_feature_classes"] = sorted(failed)
    report_path = output_root / "gdb_report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if failed:
        raise RuntimeError(f"Showcase geodatabase validation failed; see {report_path}")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-input", type=Path, default=DEFAULT_SOURCE_INPUT)
    parser.add_argument("--derived-input", type=Path, default=DEFAULT_DERIVED_INPUT)
    parser.add_argument("--output-root", type=Path, default=APPROVED_OUTPUT_ROOT)
    args = parser.parse_args()
    report = build_geodatabase(args.source_input, args.derived_input, args.output_root)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
