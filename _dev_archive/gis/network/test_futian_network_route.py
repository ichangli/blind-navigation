"""Run a local end-to-end route solve on the built Futian network dataset."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import arcpy


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gdb", type=Path, default=Path(r"E:\GIS_data\futian_network.gdb"))
    parser.add_argument("--report-dir", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\network"))
    parser.add_argument("--network-name", default="FutianAccessible_ND")
    parser.add_argument("--impedance", default="Length")
    parser.add_argument("--skip-export", action="store_true")
    args = parser.parse_args()
    fd = str(args.gdb / "FutianNetwork")
    roads = fd + "\\AccessibleRoads_Final"
    nd = fd + "\\" + args.network_name
    stops_fc = str(args.gdb / "LocalSolve_TestStops")
    routes_fc = str(args.gdb / "LocalSolve_TestRoute")
    for item in (stops_fc, routes_fc):
        if arcpy.Exists(item):
            arcpy.management.Delete(item)

    candidates = []
    where = "component_id = 1"
    with arcpy.da.SearchCursor(roads, ["SHAPE@"], where_clause=where) as cursor:
        for (shape,) in cursor:
            candidates.append((shape.firstPoint.X, shape.firstPoint.Y))
            candidates.append((shape.lastPoint.X, shape.lastPoint.Y))
    if not candidates:
        raise RuntimeError("No edges in largest component")
    start = min(candidates, key=lambda point: point[0])
    end = max(candidates, key=lambda point: point[0])

    sr = arcpy.Describe(roads).spatialReference
    arcpy.management.CreateFeatureclass(str(args.gdb), "LocalSolve_TestStops", "POINT", spatial_reference=sr)
    arcpy.management.AddField(stops_fc, "Name", "TEXT", field_length=40)
    with arcpy.da.InsertCursor(stops_fc, ["SHAPE@XY", "Name"]) as cursor:
        cursor.insertRow((start, "West_Test_Stop"))
        cursor.insertRow((end, "East_Test_Stop"))

    if arcpy.CheckExtension("network") != "Available":
        raise RuntimeError("Network Analyst extension is not available")
    arcpy.CheckOutExtension("network")
    try:
        print("MILESTONE=before_make_route", flush=True)
        route_layer = arcpy.na.MakeRouteLayer(
            nd, "Futian_Local_Solve", args.impedance, "USE_INPUT_ORDER", "PRESERVE_BOTH",
            "NO_TIMEWINDOWS", [args.impedance], "ALLOW_UTURNS", [], "NO_HIERARCHY", "",
            "TRUE_LINES_WITHOUT_MEASURES",
        ).getOutput(0)
        print("MILESTONE=after_make_route", flush=True)
        class_names = arcpy.na.GetNAClassNames(route_layer)
        stops_name = class_names["Stops"]
        print("MILESTONE=before_add_locations", flush=True)
        arcpy.na.AddLocations(route_layer, stops_name, stops_fc, "", "50 Meters")
        print("MILESTONE=before_solve", flush=True)
        solve_result = arcpy.na.Solve(route_layer, "HALT", "TERMINATE")
        print("MILESTONE=after_solve", flush=True)
        preliminary = {
            "network_dataset": nd,
            "solve_succeeded": True,
            "impedance": args.impedance,
            "start_xy": start,
            "end_xy": end,
            "test_stops": stops_fc,
            "route_export_skipped": bool(args.skip_export),
        }
        args.report_dir.mkdir(parents=True, exist_ok=True)
        report_name = "local_solve_safe_report.json" if args.impedance == "SafeMinutes" else "local_solve_report.json"
        (args.report_dir / report_name).write_text(json.dumps(preliminary, ensure_ascii=False, indent=2), encoding="utf-8")
        if args.skip_export:
            print(json.dumps(preliminary, ensure_ascii=False, indent=2))
            return
        routes_layer_path = f"Futian_Local_Solve\\{class_names['Routes']}"
        arcpy.management.CopyFeatures(routes_layer_path, routes_fc)
    finally:
        arcpy.CheckInExtension("network")

    route_count = int(arcpy.management.GetCount(routes_fc)[0])
    fields = {field.name for field in arcpy.ListFields(routes_fc)}
    total_length = None
    length_field = next((name for name in ("Total_Length", "Total_Meters", "Shape_Length") if name in fields), None)
    if length_field and route_count:
        total_length = next(arcpy.da.SearchCursor(routes_fc, [length_field]))[0]
    report = {
        "network_dataset": nd,
        "solve_succeeded": bool(route_count),
        "route_count": route_count,
        "impedance": args.impedance,
        "route_length": total_length,
        "start_xy": start,
        "end_xy": end,
        "test_stops": stops_fc,
        "test_route": routes_fc,
    }
    args.report_dir.mkdir(parents=True, exist_ok=True)
    (args.report_dir / "local_solve_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
