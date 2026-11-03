"""Import the extracted Futian GeoJSON files into an ArcGIS file geodatabase."""

from __future__ import annotations

import argparse
from pathlib import Path

import arcpy


def delete_if_exists(path: str) -> None:
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("shenzhen_data/processed"))
    parser.add_argument("--output", type=Path, default=Path("shenzhen_data"))
    args = parser.parse_args()

    arcpy.env.overwriteOutput = True
    args.output.mkdir(parents=True, exist_ok=True)
    gdb = args.output / "futian_accessible_network.gdb"
    if not arcpy.Exists(str(gdb)):
        arcpy.management.CreateFileGDB(str(args.output), gdb.name)

    # EPSG:4547 — CGCS2000 / 3-degree Gauss-Kruger CM 114E.
    target_sr = arcpy.SpatialReference(4547)
    feature_dataset = str(gdb / "FutianNetwork")
    if not arcpy.Exists(feature_dataset):
        arcpy.management.CreateFeatureDataset(str(gdb), "FutianNetwork", target_sr)

    imports = {
        "boundary": (args.input / "futian_boundary.geojson", "POLYGON"),
        "roads": (args.input / "futian_osm_roads.geojson", "POLYLINE"),
        "points": (args.input / "futian_osm_accessibility_points.geojson", "POINT"),
    }
    temp = {}
    for name, (source, geometry_type) in imports.items():
        if not source.is_file():
            raise FileNotFoundError(source)
        output = str(gdb / f"tmp_{name}_wgs84")
        delete_if_exists(output)
        arcpy.conversion.JSONToFeatures(str(source), output, geometry_type)
        temp[name] = output

    boundary = str(feature_dataset + "\\FutianBoundary")
    roads_all = str(feature_dataset + "\\FutianRoads_All")
    points = str(feature_dataset + "\\AccessibilityPoints")
    for output in (boundary, roads_all, points):
        delete_if_exists(output)

    arcpy.management.Project(temp["boundary"], boundary, target_sr)
    projected_roads = str(gdb / "tmp_roads_projected")
    projected_points = str(gdb / "tmp_points_projected")
    delete_if_exists(projected_roads)
    delete_if_exists(projected_points)
    arcpy.management.Project(temp["roads"], projected_roads, target_sr)
    arcpy.management.Project(temp["points"], projected_points, target_sr)

    # Exact polygon clipping removes the small boundary overshoot retained by the
    # fast PBF pre-filter.
    arcpy.analysis.Clip(projected_roads, boundary, roads_all)
    arcpy.analysis.Clip(projected_points, boundary, points)
    arcpy.management.RepairGeometry(roads_all, "DELETE_NULL")
    arcpy.management.RepairGeometry(points, "DELETE_NULL")

    accessible_roads = str(feature_dataset + "\\AccessibleRoads")
    delete_if_exists(accessible_roads)
    arcpy.analysis.Select(roads_all, accessible_roads, "walkable = 1")

    for field_name, field_type, field_length in (
        ("risk_score", "DOUBLE", None),
        ("data_status", "TEXT", 20),
        ("source_date", "DATE", None),
    ):
        if field_name not in {f.name for f in arcpy.ListFields(accessible_roads)}:
            kwargs = {"field_length": field_length} if field_length else {}
            arcpy.management.AddField(accessible_roads, field_name, field_type, **kwargs)

    # Unknown accessibility information is penalized rather than treated as safe.
    fields = [
        "highway", "sidewalk", "surface", "smoothness", "wheelchair",
        "tactile_pa", "incline", "risk_score", "data_status",
    ]
    existing = {f.name for f in arcpy.ListFields(accessible_roads)}
    fields = [f for f in fields if f in existing]
    with arcpy.da.UpdateCursor(accessible_roads, fields) as cursor:
        indexes = {name: fields.index(name) for name in fields}
        for row in cursor:
            risk = 1.0
            evidence = 0
            highway = row[indexes["highway"]] if "highway" in indexes else None
            if highway == "steps":
                risk += 100.0
                evidence += 1
            for field in ("sidewalk", "surface", "smoothness", "wheelchair", "tactile_pa", "incline"):
                if field in indexes and row[indexes[field]] not in (None, ""):
                    evidence += 1
            if "sidewalk" in indexes and row[indexes["sidewalk"]] in (None, ""):
                risk += 3.0
            if "surface" in indexes and row[indexes["surface"]] in (None, ""):
                risk += 1.0
            row[indexes["risk_score"]] = risk
            row[indexes["data_status"]] = "网络属性较完整" if evidence >= 3 else "公开数据待验证"
            cursor.updateRow(row)

    for item in list(temp.values()) + [projected_roads, projected_points]:
        delete_if_exists(item)
    arcpy.management.Compact(str(gdb))

    print(f"GDB={gdb.resolve()}")
    for fc in (boundary, roads_all, accessible_roads, points):
        print(f"{Path(fc).name}={int(arcpy.management.GetCount(fc)[0])}")


if __name__ == "__main__":
    main()
