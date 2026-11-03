"""Import standardized Futian support layers and tables into the network GDB."""

from __future__ import annotations

import argparse
from pathlib import Path

import arcpy


def delete_if_exists(path: str) -> None:
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\support"))
    parser.add_argument("--gdb", type=Path, default=Path(r"D:\盲行\shenzhen_data\futian_accessible_network.gdb"))
    args = parser.parse_args()
    arcpy.env.overwriteOutput = True

    if not arcpy.Exists(str(args.gdb)):
        raise FileNotFoundError(args.gdb)
    feature_dataset = str(args.gdb / "FutianNetwork")
    if not arcpy.Exists(feature_dataset):
        raise RuntimeError(f"Missing feature dataset: {feature_dataset}")
    target_sr = arcpy.Describe(feature_dataset).spatialReference

    layers = {
        "BusStops": "futian_bus_stops.geojson",
        "PublicToilets": "futian_public_toilets.geojson",
        "CommunityParks": "futian_community_parks.geojson",
        "RehabServices": "futian_rehab_services.geojson",
        "Hospitals": "futian_hospitals.geojson",
        "MetroStations": "futian_metro_stations.geojson",
        "MetroEntrances": "futian_metro_entrances.geojson",
    }
    counts = {}
    for output_name, filename in layers.items():
        source = args.input / filename
        if not source.is_file():
            raise FileNotFoundError(source)
        temp_wgs = str(args.gdb / f"tmp_{output_name}_wgs84")
        output = feature_dataset + "\\" + output_name
        delete_if_exists(temp_wgs)
        delete_if_exists(output)
        arcpy.conversion.JSONToFeatures(str(source), temp_wgs, "POINT")
        arcpy.management.Project(temp_wgs, output, target_sr)
        arcpy.management.RepairGeometry(output, "DELETE_NULL")
        delete_if_exists(temp_wgs)
        counts[output_name] = int(arcpy.management.GetCount(output)[0])

    tables = {
        "MetroAccessibility": "metro_accessibility.csv",
        "MetroTransfers": "metro_transfers.csv",
        "MetroExitConnections": "metro_exit_connections.csv",
        "UnmatchedGeocoding": "unmatched_geocoding.csv",
    }
    for output_name, filename in tables.items():
        source = args.input / filename
        output = str(args.gdb / output_name)
        delete_if_exists(output)
        arcpy.conversion.ExportTable(str(source), output)
        counts[output_name] = int(arcpy.management.GetCount(output)[0])

    station_fc = feature_dataset + "\\MetroStations"
    entrance_fc = feature_dataset + "\\MetroEntrances"
    accessibility_table = str(args.gdb / "MetroAccessibility")
    transfer_table = str(args.gdb / "MetroTransfers")
    for dataset in (station_fc, entrance_fc, accessibility_table, transfer_table):
        fields = {field.name for field in arcpy.ListFields(dataset)}
        if "station_key" in fields:
            try:
                arcpy.management.AddIndex(dataset, "station_key", "idx_station_key")
            except arcpy.ExecuteError:
                pass

    relationships = (
        ("MetroStation_Entrances", station_fc, entrance_fc, "地铁出入口", "所属地铁站"),
        ("MetroStation_Accessibility", station_fc, accessibility_table, "无障碍设施信息", "所属地铁站"),
        ("MetroStation_Transfers", station_fc, transfer_table, "换乘信息", "所属地铁站"),
    )
    for name, origin, destination, forward, backward in relationships:
        output = str(args.gdb / name)
        delete_if_exists(output)
        if "station_key" not in {field.name for field in arcpy.ListFields(destination)}:
            continue
        arcpy.management.CreateRelationshipClass(
            origin, destination, output, "SIMPLE", forward, backward,
            "NONE", "ONE_TO_MANY", "NONE", "station_key", "station_key",
        )

    arcpy.management.Compact(str(args.gdb))
    print(f"GDB={args.gdb.resolve()}")
    for name, count in counts.items():
        print(f"{name}={count}")


if __name__ == "__main__":
    main()
