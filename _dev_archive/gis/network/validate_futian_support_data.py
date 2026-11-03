"""Validate imported Futian support layers and write JSON/Markdown reports."""

from __future__ import annotations

import argparse
import json
import statistics
from collections import Counter
from pathlib import Path

import arcpy


def field_values(dataset, field):
    return [row[0] for row in arcpy.da.SearchCursor(dataset, [field])]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gdb", type=Path, default=Path(r"D:\盲行\shenzhen_data\futian_accessible_network.gdb"))
    parser.add_argument("--output", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\support"))
    args = parser.parse_args()
    fd = str(args.gdb / "FutianNetwork")
    arcpy.env.workspace = fd

    feature_names = [
        "AccessibleRoads", "BusStops", "PublicToilets", "CommunityParks",
        "RehabServices", "Hospitals", "MetroStations", "MetroEntrances",
    ]
    features = {}
    for name in feature_names:
        path = fd + "\\" + name
        desc = arcpy.Describe(path)
        null_geometry = sum(1 for row in arcpy.da.SearchCursor(path, ["SHAPE@"]) if row[0] is None)
        confidence = Counter()
        if "confidence" in {field.name for field in arcpy.ListFields(path)}:
            confidence.update(field_values(path, "confidence"))
        features[name] = {
            "count": int(arcpy.management.GetCount(path)[0]),
            "null_geometry": null_geometry,
            "wkid": desc.spatialReference.factoryCode,
            "confidence": dict(confidence),
        }

    station_fc = fd + "\\MetroStations"
    entrance_fc = fd + "\\MetroEntrances"
    station_keys = [value for value in field_values(station_fc, "station_key") if value]
    station_key_set = set(station_keys)
    entrance_keys = field_values(entrance_fc, "station_key")
    matched_entrances = sum(value in station_key_set for value in entrance_keys if value)

    table_results = {}
    for name in ("MetroAccessibility", "MetroTransfers", "MetroExitConnections", "UnmatchedGeocoding"):
        path = str(args.gdb / name)
        fields = {field.name for field in arcpy.ListFields(path)}
        count = int(arcpy.management.GetCount(path)[0])
        matched = None
        if "station_key" in fields:
            values = field_values(path, "station_key")
            matched = sum(value in station_key_set for value in values if value)
        table_results[name] = {"count": count, "matched_to_station": matched}

    # Validate the assumed GCJ-02 -> WGS84 bus conversion against the road network.
    near_table = str(args.gdb / "tmp_bus_road_near")
    if arcpy.Exists(near_table):
        arcpy.management.Delete(near_table)
    arcpy.analysis.GenerateNearTable(
        fd + "\\BusStops", fd + "\\AccessibleRoads", near_table,
        "100 Meters", "NO_LOCATION", "NO_ANGLE", "CLOSEST", 1, "PLANAR",
    )
    distances = field_values(near_table, "NEAR_DIST")
    arcpy.management.Delete(near_table)

    relationships = []
    for dirpath, _, filenames in arcpy.da.Walk(str(args.gdb), datatype="RelationshipClass"):
        relationships.extend(filenames)

    report = {
        "features": features,
        "station_keys": {
            "total": len(station_keys), "unique": len(station_key_set),
            "blank": features["MetroStations"]["count"] - len(station_keys),
        },
        "metro_entrance_match": {
            "matched": matched_entrances,
            "total": features["MetroEntrances"]["count"],
            "percent": round(matched_entrances * 100 / max(features["MetroEntrances"]["count"], 1), 2),
        },
        "tables": table_results,
        "bus_to_road_distance_m": {
            "within_100m": len(distances),
            "total": features["BusStops"]["count"],
            "median": round(statistics.median(distances), 2) if distances else None,
            "p95": round(sorted(distances)[min(len(distances) - 1, int(len(distances) * 0.95))], 2) if distances else None,
        },
        "relationships": sorted(relationships),
    }
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "support_validation_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = ["# 福田区支撑数据验证报告", "", "## 空间图层", "", "| 图层 | 数量 | 空几何 | WKID |", "|---|---:|---:|---:|"]
    for name, values in features.items():
        lines.append(f"| {name} | {values['count']:,} | {values['null_geometry']} | {values['wkid']} |")
    lines.extend([
        "", "## 关联质量", "",
        f"- 地铁站键：{len(station_keys)}个，唯一值{len(station_key_set)}个。",
        f"- 地铁出入口匹配：{matched_entrances}/{features['MetroEntrances']['count']}（{report['metro_entrance_match']['percent']:.2f}%）。",
        f"- 无障碍记录关联：{table_results['MetroAccessibility']['matched_to_station']}/{table_results['MetroAccessibility']['count']}。",
        f"- 换乘记录关联：{table_results['MetroTransfers']['matched_to_station']}/{table_results['MetroTransfers']['count']}。",
        "", "## 坐标合理性", "",
        f"- 公交站100米内匹配道路：{len(distances)}/{features['BusStops']['count']}。",
        f"- 公交站到道路距离中位数：{report['bus_to_road_distance_m']['median']}米。",
        f"- 公交站到道路距离P95：{report['bus_to_road_distance_m']['p95']}米。",
        "", "> 注意：地铁出入口与站点的对应关系由OSM节点距离推断，尚未现场验证。",
    ])
    (args.output / "support_validation_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
