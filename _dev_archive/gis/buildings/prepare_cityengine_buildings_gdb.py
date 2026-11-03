"""Convert enriched Futian GeoJSON buildings to a metric FileGDB for CityEngine."""

from __future__ import annotations

import argparse
import os

import arcpy


def delete(path: str) -> None:
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=r"E:\GIS_data\futian_buildings_cityengine.geojson")
    parser.add_argument("--gdb", default=r"E:\GIS_data\futian_cityengine.gdb")
    args = parser.parse_args()
    arcpy.env.overwriteOutput = True
    gdb_folder, gdb_name = os.path.split(args.gdb)
    if not arcpy.Exists(args.gdb):
        arcpy.management.CreateFileGDB(gdb_folder, gdb_name)
    wgs84_fc = os.path.join(args.gdb, "FutianBuildings_WGS84")
    metric_fc = os.path.join(args.gdb, "FutianBuildings_CGCS2000")
    delete(wgs84_fc)
    delete(metric_fc)
    arcpy.conversion.JSONToFeatures(args.input, wgs84_fc, "POLYGON")
    arcpy.management.RepairGeometry(wgs84_fc, "DELETE_NULL", "ESRI")
    arcpy.management.Project(wgs84_fc, metric_fc, arcpy.SpatialReference(4547))
    arcpy.management.RepairGeometry(metric_fc, "DELETE_NULL", "ESRI")
    for field in ("building_id", "bldg_class", "height_source"):
        if field in {item.name for item in arcpy.ListFields(metric_fc)}:
            arcpy.management.AddIndex(metric_fc, field, f"idx_{field}")
    count = int(arcpy.management.GetCount(metric_fc)[0])
    desc = arcpy.Describe(metric_fc)
    print(f"GDB={args.gdb}")
    print(f"FEATURE_CLASS={metric_fc}")
    print(f"COUNT={count}")
    print(f"WKID={desc.spatialReference.factoryCode}")


if __name__ == "__main__":
    main()
