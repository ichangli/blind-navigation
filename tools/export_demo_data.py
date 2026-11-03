"""Offline build of public demo data. Never contacts GeoScene or map APIs."""
from pathlib import Path
import argparse
import heapq
import json
import math
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')


def export():
    import pyogrio
    from pyproj import Transformer
    from scipy.spatial import cKDTree
    from backend.app.services.support_data import load_web_map_context
    from backend.app.services.building_semantics import load_building_semantics

    out = ROOT / 'demo' / 'data'
    facilities = load_web_map_context()
    write_json(out / 'facilities.json', facilities)
    write_json(out / 'building-semantics.json', load_building_semantics())
    frame = pyogrio.read_dataframe(ROOT / 'datasets' / 'futian_safe_network_v2.gdb', layer='AccessibleRoads_Final', fid_as_index=True)
    source_count = len(frame)
    frame = frame.explode(index_parts=False)
    transform = Transformer.from_crs(frame.crs, 'EPSG:4326', always_xy=True)
    node_keys, nodes, adjacency, edges = {}, [], [], []

    def node(point):
        key = (round(point[0], 3), round(point[1], 3))
        if key not in node_keys:
            node_keys[key] = len(nodes)
            nodes.append(key)
            adjacency.append([])
        return node_keys[key]

    corrected = []
    for fid, row in frame.iterrows():
        geometry = row.geometry
        coords = list(geometry.coords)
        u, v = node(coords[0]), node(coords[-1])
        length = float(geometry.length)
        risk = float(row['risk_score'])
        walk = length / 72
        safe = walk * (1 + risk * .12) + (2 if row['highway'] == 'steps' else 0)
        if abs(length - float(row['length_m'])) > .05:
            corrected.append(int(fid))
        edge_index = len(edges)
        edges.append((u, v, length, walk, safe, coords))
        # Cases use the final prepared edge geometries. They are examples,
        # not a replacement for a fully validated production network dataset.
        if not int(row['prohibited']):
            adjacency[u].append((v, edge_index))
            adjacency[v].append((u, edge_index))

    tree = cKDTree(nodes)
    to_xy = Transformer.from_crs('EPSG:4326', frame.crs, always_xy=True)

    def snap(lon, lat):
        distance, index = tree.query(to_xy.transform(lon, lat))
        return int(index), float(distance)

    def shortest(start, end, safe):
        costs = {start: 0.0}
        previous = {}
        queue = [(0.0, start)]
        while queue:
            cost, vertex = heapq.heappop(queue)
            if cost != costs[vertex]:
                continue
            if vertex == end:
                break
            for following, edge_index in adjacency[vertex]:
                edge = edges[edge_index]
                candidate = cost + edge[4 if safe else 3]
                if candidate < costs.get(following, math.inf):
                    costs[following] = candidate
                    previous[following] = (vertex, edge_index)
                    heapq.heappush(queue, (candidate, following))
        if end not in costs:
            raise ValueError('Example endpoints are disconnected')
        selected = []
        current = end
        while current != start:
            parent, edge_index = previous[current]
            selected.append((parent, edge_index))
            current = parent
        selected.reverse()
        points = []
        distance = walking = safety = 0.0
        for parent, edge_index in selected:
            edge = edges[edge_index]
            coords = edge[5] if edge[0] == parent else list(reversed(edge[5]))
            for x, y, *_ in coords:
                lon, lat = transform.transform(x, y)
                point = {'lon': round(lon, 7), 'lat': round(lat, 7)}
                if not points or points[-1] != point:
                    points.append(point)
            distance += edge[2]
            walking += edge[3]
            safety += edge[4]
        return points, round(distance), round(walking * 60), round(safety, 2)

    targets = [
        ('civic', '市民中心地铁站F口', (114.055, 22.5436)),
        ('park', '莲花山公园', (114.0533, 22.5527)),
        ('expo', '会展中心', (114.059, 22.5329)),
    ]
    start, start_snap = snap(114.055, 22.535)
    cases = []
    for case_id, name, (lon, lat) in targets:
        end, end_snap = snap(lon, lat)
        options = []
        for safe in [True, False]:
            points, distance, duration, safety = shortest(start, end, safe)
            options.append({
                'provider': 'demo-safe-route' if safe else 'demo-walking-route',
                'coordinateSystem': 'WGS84', 'route': points,
                'distanceMeters': distance, 'durationSeconds': duration,
                'safeMinutes': safety, 'distance': f'{distance}米' if distance < 1000 else f'{distance/1000:.2f}公里',
                'duration': f'约{max(1, round(duration/60))}分钟',
                'instructions': ['预设路线案例：从购物公园演示起点出发', '按地图中的路线查看沿途道路与设施', f'到达{name}案例终点；本案例不代表现场实时通行情况'],
                'accessibility': {'level': '案例展示', 'summary': '基于已有路网的离线权重方案，未进行现场通行验证', 'risks': []},
                'source': 'offline-example', 'isDemo': True,
                'snapInfo': [{'name':'起点','distanceMeters':round(start_snap,1)}, {'name':'终点','distanceMeters':round(end_snap,1)}],
            })
        selected = options[0]
        selected.update({
            'caseId': case_id, 'destination': name, 'origin': '购物公园演示点',
            'originLocation': selected['route'][0], 'destinationLocation': selected['route'][-1],
            'routeOptions': [dict(option) for option in options],
            'comparison': {'extraDistanceMeters': options[0]['distanceMeters']-options[1]['distanceMeters']},
            'nearbyFacilities': [],
        })
        # Keep options independent; never build a recursive routeOptions object.
        cases.append(selected)
    write_json(out / 'routes.json', cases)
    frame['length_m'] = frame.geometry.length
    roads = frame.to_crs('EPSG:4326')
    fields = ['road_name','highway','risk_score','risk_reason','prohibited','avoid_steps','unknown_access','length_m','geometry']
    # Display geometry is separate from the unsimplified offline solver data.
    roads = roads[fields].copy()
    roads.geometry = roads.geometry.simplify(.000006, preserve_topology=True)
    (out / 'network-display.geojson').write_text(roads.to_json(drop_id=False, to_wgs84=True), encoding='utf-8')
    write_json(out / 'manifest.json', {
        'version':'2026-11-03-demo-v1', 'coordinateSystem':'WGS84',
        'sourceNetworkCRS':str(frame.crs), 'sourceEdgeCount':source_count, 'exportedPartCount':len(frame), 'exampleCount':len(cases),
        'costPolicy':'Geometry length / 72 * (1 + risk_score * .12), plus 2 minutes for steps; sample generation excludes prohibited edges.',
        'correctedGeometryCostRows':corrected,
        'limitations':['Static demonstration; not live accessibility observations','Endpoint snapping and generated examples require visual review','Not a production routing engine'],
    })
    print(json.dumps({'facilities':len(facilities['features']), 'cases':len(cases), 'edges':len(frame), 'correctedCostRows':corrected}))


if __name__ == '__main__':
    export()
