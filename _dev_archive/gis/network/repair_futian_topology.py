"""Conservatively connect small disconnected Futian road components."""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter, defaultdict
from pathlib import Path

import arcpy


def delete(path):
    if arcpy.Exists(path):
        arcpy.management.Delete(path)


def point_key(point, tolerance=0.01):
    return (round(point.X / tolerance), round(point.Y / tolerance))


def normalized_layer(value):
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


def flag(value):
    return str(value or "").lower() not in {"", "no", "false", "0", "none"}


class UnionFind:
    def __init__(self):
        self.parent = {}

    def add(self, value):
        self.parent.setdefault(value, value)

    def find(self, value):
        root = value
        while root != self.parent[root]:
            root = self.parent[root]
        while value != root:
            nxt = self.parent[value]
            self.parent[value] = root
            value = nxt
        return root

    def union(self, left, right):
        a, b = self.find(left), self.find(right)
        if a != b:
            self.parent[b] = a


def recalculate_components(feature_class):
    oid_field = arcpy.Describe(feature_class).OIDFieldName
    endpoints = {}
    endpoint_edges = defaultdict(list)
    uf = UnionFind()
    with arcpy.da.SearchCursor(feature_class, [oid_field, "SHAPE@"]) as cursor:
        for oid, shape in cursor:
            a, b = point_key(shape.firstPoint), point_key(shape.lastPoint)
            endpoints[oid] = (a, b)
            endpoint_edges[a].append(oid)
            endpoint_edges[b].append(oid)
            uf.add(oid)
    for edges in endpoint_edges.values():
        first = edges[0]
        for oid in edges[1:]:
            uf.union(first, oid)
    sizes = Counter(uf.find(oid) for oid in endpoints)
    roots = sorted(sizes, key=lambda root: (-sizes[root], root))
    component_ids = {root: index + 1 for index, root in enumerate(roots)}
    fields = [oid_field, "from_degree", "to_degree", "component_id", "component_size", "is_dangle", "is_isolated"]
    with arcpy.da.UpdateCursor(feature_class, fields) as cursor:
        for row in cursor:
            oid = row[0]
            a, b = endpoints[oid]
            root = uf.find(oid)
            degree_a, degree_b = len(endpoint_edges[a]), len(endpoint_edges[b])
            row[1:] = [
                degree_a, degree_b, component_ids[root], sizes[root],
                int(degree_a == 1 or degree_b == 1), int(sizes[root] == 1),
            ]
            cursor.updateRow(row)
    return {
        "segments": len(endpoints), "components": len(sizes),
        "largest": sizes[roots[0]] if roots else 0,
        "isolated": sum(size == 1 for size in sizes.values()),
        "dangle_segments": sum(
            len(endpoint_edges[a]) == 1 or len(endpoint_edges[b]) == 1
            for a, b in endpoints.values()
        ),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gdb", type=Path, default=Path(r"D:\盲行\shenzhen_data\futian_accessible_network.gdb"))
    parser.add_argument("--report-dir", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\network"))
    args = parser.parse_args()
    fd = str(args.gdb / "FutianNetwork")
    roads = fd + r"\AccessibleRoads_Final"
    boundary = fd + r"\FutianBoundary"
    endpoints_fc = str(args.gdb / "tmp_dangle_endpoints")
    boundary_line = str(args.gdb / "tmp_boundary_line")
    endpoint_near = str(args.gdb / "tmp_endpoint_road_near")
    boundary_near = str(args.gdb / "tmp_endpoint_boundary_near")
    split_points = str(args.gdb / "tmp_repair_split_points")
    split_base = str(args.gdb / "tmp_repaired_split_base")
    output = fd + r"\AccessibleRoads_Repaired"
    for item in (endpoints_fc, boundary_line, endpoint_near, boundary_near, split_points, split_base, output):
        delete(item)

    sr = arcpy.Describe(roads).spatialReference
    arcpy.management.CreateFeatureclass(str(args.gdb), "tmp_dangle_endpoints", "POINT", spatial_reference=sr)
    for name, field_type, length in (
        ("edge_oid", "LONG", None), ("endpoint", "TEXT", 5), ("component_id", "LONG", None),
        ("component_size", "LONG", None), ("highway", "TEXT", 32), ("road_name", "TEXT", 160),
        ("layer", "TEXT", 12), ("bridge", "TEXT", 32), ("tunnel", "TEXT", 32),
    ):
        kwargs = {"field_length": length} if length else {}
        arcpy.management.AddField(endpoints_fc, name, field_type, **kwargs)

    oid_field = arcpy.Describe(roads).OIDFieldName
    source_fields = [
        oid_field, "SHAPE@", "from_degree", "to_degree", "component_id", "component_size",
        "highway", "road_name", "layer", "bridge", "tunnel",
    ]
    endpoint_insert = ["SHAPE@XY", "edge_oid", "endpoint", "component_id", "component_size", "highway", "road_name", "layer", "bridge", "tunnel"]
    with arcpy.da.InsertCursor(endpoints_fc, endpoint_insert) as output_cursor:
        with arcpy.da.SearchCursor(roads, source_fields) as cursor:
            for row in cursor:
                oid, shape, degree_from, degree_to, component_id, component_size, highway, name, layer, bridge, tunnel = row
                if degree_from == 1:
                    output_cursor.insertRow(((shape.firstPoint.X, shape.firstPoint.Y), oid, "from", component_id, component_size, highway, name, layer, bridge, tunnel))
                if degree_to == 1:
                    output_cursor.insertRow(((shape.lastPoint.X, shape.lastPoint.Y), oid, "to", component_id, component_size, highway, name, layer, bridge, tunnel))

    arcpy.management.PolygonToLine(boundary, boundary_line)
    arcpy.analysis.GenerateNearTable(endpoints_fc, boundary_line, boundary_near, "3 Meters", "NO_LOCATION", "NO_ANGLE", "CLOSEST", 1, "PLANAR")
    boundary_distance = {row[0]: row[1] for row in arcpy.da.SearchCursor(boundary_near, ["IN_FID", "NEAR_DIST"])}
    arcpy.analysis.GenerateNearTable(endpoints_fc, roads, endpoint_near, "3 Meters", "LOCATION", "NO_ANGLE", "ALL", 10, "PLANAR")

    endpoint_attrs = {}
    endpoint_xy = {}
    endpoint_oid_field = arcpy.Describe(endpoints_fc).OIDFieldName
    with arcpy.da.SearchCursor(endpoints_fc, [endpoint_oid_field, "SHAPE@XY", "edge_oid", "component_id", "component_size", "highway", "road_name", "layer", "bridge", "tunnel"]) as cursor:
        for row in cursor:
            endpoint_attrs[row[0]] = row[2:]
            endpoint_xy[row[0]] = row[1]
    road_attrs = {}
    with arcpy.da.SearchCursor(roads, [oid_field, "component_id", "component_size", "highway", "road_name", "layer", "bridge", "tunnel"]) as cursor:
        for row in cursor:
            road_attrs[row[0]] = row[1:]

    pedestrian = {"footway", "path", "pedestrian", "steps", "corridor", "elevator", "cycleway"}
    candidates = defaultdict(list)
    rejected = Counter()
    near_fields = ["IN_FID", "NEAR_FID", "NEAR_DIST", "NEAR_X", "NEAR_Y"]
    with arcpy.da.SearchCursor(endpoint_near, near_fields) as cursor:
        for endpoint_oid, target_oid, distance, near_x, near_y in cursor:
            source_edge, source_comp, source_size, source_type, source_name, source_layer, source_bridge, source_tunnel = endpoint_attrs[endpoint_oid]
            if source_comp == 1:
                rejected["source_already_main_component"] += 1
                continue
            if source_edge == target_oid:
                rejected["same_edge"] += 1
                continue
            if boundary_distance.get(endpoint_oid, 999) <= 3:
                rejected["district_boundary"] += 1
                continue
            target_comp, target_size, target_type, target_name, target_layer, target_bridge, target_tunnel = road_attrs[target_oid]
            if source_comp == target_comp:
                rejected["same_component"] += 1
                continue
            if normalized_layer(source_layer) != normalized_layer(target_layer) or flag(source_bridge) != flag(target_bridge) or flag(source_tunnel) != flag(target_tunnel):
                rejected["grade_or_bridge_tunnel"] += 1
                continue
            if source_type in {"steps", "elevator"} and target_type not in pedestrian:
                rejected["vertical_to_vehicle_road"] += 1
                continue
            same_name = bool(source_name and target_name and source_name == target_name)
            both_pedestrian = source_type in pedestrian and target_type in pedestrian
            if distance > 1.0 and not (same_name or both_pedestrian):
                rejected["long_ambiguous_gap"] += 1
                continue
            if target_comp != 1 and target_size < source_size * 2 and not same_name:
                rejected["no_larger_target_component"] += 1
                continue
            priority = (0 if target_comp == 1 else 1, distance, -target_size)
            candidates[source_comp].append((priority, endpoint_oid, target_oid, distance, near_x, near_y, target_comp))

    accepted = []
    for component, items in candidates.items():
        accepted.append(min(items, key=lambda item: item[0]))
    accepted.sort(key=lambda item: item[0])

    arcpy.management.CreateFeatureclass(str(args.gdb), "tmp_repair_split_points", "POINT", spatial_reference=sr)
    arcpy.management.AddField(split_points, "repair_id", "LONG")
    with arcpy.da.InsertCursor(split_points, ["SHAPE@XY", "repair_id"]) as cursor:
        seen = set()
        for repair_id, item in enumerate(accepted, 1):
            _, _, _, _, near_x, near_y, _ = item
            key = (round(near_x, 3), round(near_y, 3))
            if key not in seen:
                cursor.insertRow(((near_x, near_y), repair_id))
                seen.add(key)

    if accepted:
        arcpy.management.SplitLineAtPoint(roads, split_points, split_base, "0.05 Meters")
    else:
        arcpy.management.CopyFeatures(roads, split_base)
    arcpy.management.CopyFeatures(split_base, output)

    connector_fields = [
        "SHAPE@", "osm_id", "road_name", "highway", "confidence", "data_status",
        "length_m", "walk_min", "safe_min", "risk_score", "prohibited", "avoid_steps",
        "unknown_access", "risk_reason", "from_degree", "to_degree", "component_id",
        "component_size", "is_dangle", "is_isolated",
    ]
    with arcpy.da.InsertCursor(output, connector_fields) as cursor:
        for repair_id, item in enumerate(accepted, 1):
            _, endpoint_oid, target_oid, distance, near_x, near_y, target_comp = item
            start_x, start_y = endpoint_xy[endpoint_oid]
            line = arcpy.Polyline(arcpy.Array([arcpy.Point(start_x, start_y), arcpy.Point(near_x, near_y)]), sr)
            length = line.length
            walk_min = length / 72.0
            safe_min = walk_min * 1.3
            cursor.insertRow((
                line, f"repair_{repair_id}", "拓扑修复连接", "connector", "medium", "自动保守修复",
                length, walk_min, safe_min, 2.5, 0, 0, 0, "topology_gap_repair",
                0, 0, 0, 0, 0, 0,
            ))

    arcpy.management.RepairGeometry(output, "DELETE_NULL")
    before = {
        "segments": int(arcpy.management.GetCount(roads)[0]), "components": 166,
        "largest": 50160, "isolated": 31, "dangle_segments": 2324,
    }
    after = recalculate_components(output)
    report = {
        "before": before, "after": after,
        "dangle_endpoints_checked": int(arcpy.management.GetCount(endpoints_fc)[0]),
        "components_repaired": len(accepted),
        "connectors_added": len(accepted),
        "target_split_points": int(arcpy.management.GetCount(split_points)[0]),
        "rejected_reasons": dict(rejected),
        "output_feature_class": output,
    }
    args.report_dir.mkdir(parents=True, exist_ok=True)
    (args.report_dir / "topology_repair_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    with (args.report_dir / "topology_repair_connections.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["repair_id", "endpoint_oid", "target_road_oid", "gap_m", "target_component"])
        for repair_id, item in enumerate(accepted, 1):
            _, endpoint_oid, target_oid, distance, _, _, target_comp = item
            writer.writerow([repair_id, endpoint_oid, target_oid, round(distance, 3), target_comp])
    lines = [
        "# 福田区路网保守拓扑修复报告", "",
        f"- 检查悬挂端点：{report['dangle_endpoints_checked']:,}",
        f"- 自动连接的小连通分量：{len(accepted):,}",
        f"- 新增连接线：{len(accepted):,}",
        f"- 连通分量：{before['components']} → {after['components']}",
        f"- 最大连通分量：{before['largest']:,} → {after['largest']:,}",
        f"- 独立线段：{before['isolated']} → {after['isolated']}",
        f"- 含悬挂端点线段：{before['dangle_segments']:,} → {after['dangle_segments']:,}",
        "", "> 每个非主连通分量最多新增一条连接，且桥梁、隧道、层级必须相容。",
    ]
    (args.report_dir / "topology_repair_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))

    for item in (endpoints_fc, boundary_line, endpoint_near, boundary_near, split_points, split_base):
        delete(item)


if __name__ == "__main__":
    main()
