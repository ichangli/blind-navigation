"""Package network and support data into an ASCII-path delivery geodatabase."""

from __future__ import annotations

import argparse

import arcpy


def delete(path):
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-gdb", default=r"D:\盲行\shenzhen_data\futian_accessible_network.gdb")
    parser.add_argument("--target-gdb", default=r"E:\GIS_data\futian_safe_network.gdb")
    args = parser.parse_args()
    source_gdb = args.source_gdb
    target_gdb = args.target_gdb
    source_fd = source_gdb + r"\FutianNetwork"
    support_fd = target_gdb + r"\SupportData"
    if arcpy.Exists(support_fd):
        arcpy.management.Delete(support_fd)
    sr = arcpy.Describe(source_fd).spatialReference
    arcpy.management.CreateFeatureDataset(target_gdb, "SupportData", sr)

    feature_classes = [
        "FutianBoundary", "AccessibilityPoints", "BusStops", "PublicToilets",
        "CommunityParks", "RehabServices", "Hospitals", "MetroStations", "MetroEntrances",
    ]
    counts = {}
    for name in feature_classes:
        source = source_fd + "\\" + name
        target = support_fd + "\\" + name
        arcpy.management.CopyFeatures(source, target)
        counts[name] = int(arcpy.management.GetCount(target)[0])

    tables = ["MetroAccessibility", "MetroTransfers", "MetroExitConnections", "UnmatchedGeocoding"]
    for name in tables:
        source = source_gdb + "\\" + name
        target = target_gdb + "\\" + name
        delete(target)
        arcpy.management.CopyRows(source, target)
        counts[name] = int(arcpy.management.GetCount(target)[0])

    station_fc = support_fd + r"\MetroStations"
    relationships = (
        ("MetroStation_Entrances", support_fd + r"\MetroEntrances", "地铁出入口", "所属地铁站"),
        ("MetroStation_Accessibility", target_gdb + r"\MetroAccessibility", "无障碍设施信息", "所属地铁站"),
        ("MetroStation_Transfers", target_gdb + r"\MetroTransfers", "换乘信息", "所属地铁站"),
    )
    for name, destination, forward, backward in relationships:
        output = target_gdb + "\\" + name
        delete(output)
        arcpy.management.CreateRelationshipClass(
            station_fc, destination, output, "SIMPLE", forward, backward,
            "NONE", "ONE_TO_MANY", "NONE", "station_key", "station_key",
        )
    arcpy.management.Compact(target_gdb)
    print(f"TARGET={target_gdb}")
    for name, count in counts.items():
        print(f"{name}={count}")


if __name__ == "__main__":
    main()
