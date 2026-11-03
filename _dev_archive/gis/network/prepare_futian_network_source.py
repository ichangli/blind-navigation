"""Create a compact, topology-audited pedestrian network source for Futian."""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

import arcpy


TEXT_FIELDS = {
    "osm_id": 32, "road_name": 160, "highway": 32, "foot": 16,
    "access": 16, "sidewalk": 24, "surface": 32, "smoothness": 24,
    "lit": 12, "wheelchair": 16, "tactile": 16, "crossing": 32,
    "cross_signal": 24, "bridge": 32, "tunnel": 32, "layer": 12,
    "confidence": 16, "data_status": 32,
}


def delete(path):
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def endpoint_key(point, tolerance=0.01):
    return (round(point.X / tolerance), round(point.Y / tolerance))


def clean(value):
    return None if value in (None, "") else str(value)


def risk_values(highway, sidewalk, surface, smoothness, lit, tactile, crossing, signal, access, foot):
    risk = 1.0
    reasons = []
    vehicle_roads = {"primary", "primary_link", "secondary", "secondary_link", "tertiary", "tertiary_link", "residential", "service", "unclassified"}
    if highway == "steps":
        risk += 20.0
        reasons.append("steps")
    if highway in vehicle_roads:
        if sidewalk in (None, "", "no", "none"):
            risk += 4.0
            reasons.append("sidewalk_unknown")
        else:
            risk += 1.0
    if surface in {"unpaved", "gravel", "fine_gravel", "dirt", "earth", "ground", "sand", "mud"}:
        risk += 4.0
        reasons.append("rough_surface")
    elif surface in {"cobblestone", "sett", "paving_stones"}:
        risk += 1.5
    if smoothness in {"bad", "very_bad", "horrible", "very_horrible", "impassable"}:
        risk += 4.0
        reasons.append("poor_smoothness")
    if lit == "no":
        risk += 2.0
        reasons.append("unlit")
    elif lit in (None, ""):
        risk += 0.5
    if tactile in {"yes", "contrasted"}:
        risk = max(0.2, risk - 0.7)
    if crossing in {"unmarked", "uncontrolled"}:
        risk += 3.0
        reasons.append("uncontrolled_crossing")
    if signal in {"yes", "traffic_signals"}:
        risk = max(0.2, risk - 0.5)
    prohibited = int(access in {"no", "private"} or foot == "no")
    unknown = int(highway in vehicle_roads and sidewalk in (None, ""))
    return risk, prohibited, unknown, ";".join(reasons)[:120]


class UnionFind:
    def __init__(self):
        self.parent = {}

    def add(self, item):
        self.parent.setdefault(item, item)

    def find(self, item):
        parent = self.parent[item]
        while parent != self.parent[parent]:
            self.parent[parent] = self.parent[self.parent[parent]]
            parent = self.parent[parent]
        while item != parent:
            nxt = self.parent[item]
            self.parent[item] = parent
            item = nxt
        return parent

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[rb] = ra


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gdb", type=Path, default=Path(r"D:\盲行\shenzhen_data\futian_accessible_network.gdb"))
    parser.add_argument("--report-dir", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\network"))
    args = parser.parse_args()
    fd = str(args.gdb / "FutianNetwork")
    source = fd + "\\AccessibleRoads"
    raw_split = str(args.gdb / "tmp_roads_split_raw")
    output = fd + "\\AccessibleRoads_Final"
    if not arcpy.Exists(source):
        raise FileNotFoundError(source)

    arcpy.env.overwriteOutput = True
    delete(raw_split)
    delete(output)
    arcpy.management.SplitLine(source, raw_split)
    raw_count = int(arcpy.management.GetCount(raw_split)[0])

    spatial_ref = arcpy.Describe(source).spatialReference
    arcpy.management.CreateFeatureclass(fd, "AccessibleRoads_Final", "POLYLINE", spatial_reference=spatial_ref)
    for name, length in TEXT_FIELDS.items():
        arcpy.management.AddField(output, name, "TEXT", field_length=length)
    for name, field_type in (
        ("length_m", "DOUBLE"), ("walk_min", "DOUBLE"), ("safe_min", "DOUBLE"),
        ("risk_score", "DOUBLE"), ("prohibited", "SHORT"), ("avoid_steps", "SHORT"),
        ("unknown_access", "SHORT"), ("from_degree", "SHORT"), ("to_degree", "SHORT"),
        ("component_id", "LONG"), ("component_size", "LONG"),
        ("is_dangle", "SHORT"), ("is_isolated", "SHORT"),
    ):
        arcpy.management.AddField(output, name, field_type)
    arcpy.management.AddField(output, "risk_reason", "TEXT", field_length=120)

    read_fields = [
        "SHAPE@", "osm_id", "name_zh", "name", "highway", "foot", "access",
        "sidewalk", "sidewalk_left", "sidewalk_right", "surface", "smoothness",
        "lit", "wheelchair", "tactile_paving", "crossing", "crossing_signals",
        "bridge", "tunnel", "layer", "confidence", "data_status",
    ]
    write_fields = [
        "SHAPE@", "osm_id", "road_name", "highway", "foot", "access", "sidewalk",
        "surface", "smoothness", "lit", "wheelchair", "tactile", "crossing",
        "cross_signal", "bridge", "tunnel", "layer", "confidence", "data_status",
        "length_m", "walk_min", "safe_min", "risk_score", "prohibited",
        "avoid_steps", "unknown_access", "risk_reason",
    ]

    records = {}
    short_removed = 0
    duplicate_removed = 0
    with arcpy.da.SearchCursor(raw_split, read_fields) as cursor:
        for row in cursor:
            values = dict(zip(read_fields, row))
            shape = values["SHAPE@"]
            length = shape.length if shape else 0
            if not shape or shape.pointCount == 0 or length < 0.20:
                short_removed += 1
                continue
            highway = clean(values["highway"])
            sidewalk = clean(values["sidewalk"]) or clean(values["sidewalk_left"]) or clean(values["sidewalk_right"])
            risk, prohibited, unknown, reason = risk_values(
                highway, sidewalk, clean(values["surface"]), clean(values["smoothness"]),
                clean(values["lit"]), clean(values["tactile_paving"]), clean(values["crossing"]),
                clean(values["crossing_signals"]), clean(values["access"]), clean(values["foot"]),
            )
            walk_min = length / 72.0
            safe_min = walk_min * (1.0 + risk * 0.12) + (2.0 if highway == "steps" else 0.0)
            first, last = endpoint_key(shape.firstPoint), endpoint_key(shape.lastPoint)
            geometry_key = (
                tuple(sorted((first, last))), round(length, 2), highway,
                clean(values["layer"]), clean(values["bridge"]), clean(values["tunnel"]),
            )
            out_row = (
                shape, clean(values["osm_id"]), clean(values["name_zh"]) or clean(values["name"]),
                highway, clean(values["foot"]), clean(values["access"]), sidewalk,
                clean(values["surface"]), clean(values["smoothness"]), clean(values["lit"]),
                clean(values["wheelchair"]), clean(values["tactile_paving"]), clean(values["crossing"]),
                clean(values["crossing_signals"]), clean(values["bridge"]), clean(values["tunnel"]),
                clean(values["layer"]), clean(values["confidence"]), clean(values["data_status"]),
                length, walk_min, safe_min, risk, prohibited, int(highway == "steps"), unknown, reason,
            )
            detail = sum(value not in (None, "") for value in out_row[4:19])
            if geometry_key in records:
                duplicate_removed += 1
                if detail > records[geometry_key][0]:
                    records[geometry_key] = (detail, out_row)
            else:
                records[geometry_key] = (detail, out_row)

    with arcpy.da.InsertCursor(output, write_fields) as cursor:
        for _, row in records.values():
            cursor.insertRow(row)

    delete(raw_split)
    final_count = int(arcpy.management.GetCount(output)[0])

    oid_field = arcpy.Describe(output).OIDFieldName
    segment_endpoints = {}
    endpoint_to_oids = defaultdict(list)
    uf = UnionFind()
    with arcpy.da.SearchCursor(output, [oid_field, "SHAPE@"]) as cursor:
        for oid, shape in cursor:
            a, b = endpoint_key(shape.firstPoint), endpoint_key(shape.lastPoint)
            segment_endpoints[oid] = (a, b)
            endpoint_to_oids[a].append(oid)
            endpoint_to_oids[b].append(oid)
            uf.add(oid)
    for oids in endpoint_to_oids.values():
        first = oids[0]
        for oid in oids[1:]:
            uf.union(first, oid)
    root_sizes = Counter(uf.find(oid) for oid in segment_endpoints)
    roots_ordered = sorted(root_sizes, key=lambda root: (-root_sizes[root], root))
    component_ids = {root: i + 1 for i, root in enumerate(roots_ordered)}

    update_fields = [oid_field, "from_degree", "to_degree", "component_id", "component_size", "is_dangle", "is_isolated"]
    with arcpy.da.UpdateCursor(output, update_fields) as cursor:
        for row in cursor:
            oid = row[0]
            a, b = segment_endpoints[oid]
            root = uf.find(oid)
            size = root_sizes[root]
            degree_a, degree_b = len(endpoint_to_oids[a]), len(endpoint_to_oids[b])
            row[1:] = [degree_a, degree_b, component_ids[root], size, int(degree_a == 1 or degree_b == 1), int(size == 1)]
            cursor.updateRow(row)

    for field in ("component_id", "highway", "prohibited", "avoid_steps"):
        arcpy.management.AddIndex(output, field, f"idx_{field}")
    arcpy.management.RepairGeometry(output, "DELETE_NULL")

    largest = root_sizes[roots_ordered[0]] if roots_ordered else 0
    highway_counts = Counter(field_values[0] for field_values in arcpy.da.SearchCursor(output, ["highway"]))
    report = {
        "input_features": int(arcpy.management.GetCount(source)[0]),
        "split_segments_raw": raw_count,
        "short_segments_removed": short_removed,
        "duplicate_segments_removed": duplicate_removed,
        "final_segments": final_count,
        "components": len(root_sizes),
        "largest_component_segments": largest,
        "largest_component_percent": round(largest * 100 / max(final_count, 1), 2),
        "isolated_segments": sum(1 for size in root_sizes.values() if size == 1),
        "dangle_segments": sum(1 for values in segment_endpoints.values() if len(endpoint_to_oids[values[0]]) == 1 or len(endpoint_to_oids[values[1]]) == 1),
        "highway_types": dict(highway_counts.most_common()),
        "wkid": spatial_ref.factoryCode,
    }
    args.report_dir.mkdir(parents=True, exist_ok=True)
    (args.report_dir / "network_source_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# 福田区网络源质量报告", "",
        f"- 输入道路：{report['input_features']:,}",
        f"- 原始拆分线段：{raw_count:,}",
        f"- 删除极短线段：{short_removed:,}",
        f"- 删除重复线段：{duplicate_removed:,}",
        f"- 最终网络线段：{final_count:,}",
        f"- 连通分量：{len(root_sizes):,}",
        f"- 最大连通分量：{largest:,}（{report['largest_component_percent']:.2f}%）",
        f"- 独立线段：{report['isolated_segments']:,}",
        f"- 含悬挂端点的线段：{report['dangle_segments']:,}",
        "", "> 拆分仅按原始道路顶点执行，不会把桥梁与地面道路的几何交叉误建为路口。",
    ]
    (args.report_dir / "network_source_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
