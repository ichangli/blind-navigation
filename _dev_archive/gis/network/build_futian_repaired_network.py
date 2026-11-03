"""Build the repaired V2 safe network in an ASCII-only delivery path."""

from __future__ import annotations

import argparse
from pathlib import Path

import arcpy


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=r"D:\盲行\shenzhen_data\futian_accessible_network.gdb\FutianNetwork\AccessibleRoads_Repaired")
    parser.add_argument("--folder", type=Path, default=Path(r"E:\GIS_data"))
    parser.add_argument("--gdb-name", default="futian_safe_network_v2.gdb")
    parser.add_argument("--template", default=r"D:\盲行\shenzhen_data\processed\network\futian_safe_template.xml")
    args = parser.parse_args()
    gdb = str(args.folder / args.gdb_name)
    fd = gdb + r"\FutianNetwork"
    roads = fd + r"\AccessibleRoads_Final"
    nd = fd + r"\FutianAccessibleSafe_ND"
    if arcpy.Exists(gdb):
        arcpy.management.Delete(gdb)
    arcpy.management.CreateFileGDB(str(args.folder), args.gdb_name)
    sr = arcpy.Describe(args.source).spatialReference
    arcpy.management.CreateFeatureDataset(gdb, "FutianNetwork", sr)
    arcpy.management.CopyFeatures(args.source, roads)
    arcpy.na.CreateNetworkDatasetFromTemplate(args.template, fd)
    arcpy.na.BuildNetwork(nd)
    desc = arcpy.Describe(nd)
    print(f"GDB={gdb}")
    print(f"ROADS={int(arcpy.management.GetCount(roads)[0])}")
    print(f"ATTRIBUTES={[(item.name, item.usageType, item.units) for item in desc.attributes]}")


if __name__ == "__main__":
    main()
