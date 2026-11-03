"""Prepare Shenzhen government/OSM support layers for the Futian network.

Inputs are never modified. Outputs are standard UTF-8 GeoJSON/CSV/JSON files
under shenzhen_data/processed/support.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
import re
import time
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

import osmium
import requests


NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
AMAP_GEOCODE = "https://restapi.amap.com/v3/geocode/geo"


def load_json_array(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8-sig").strip()
    if text.startswith("{[") and text.endswith("]}"):
        text = text[1:-1]
    value = json.loads(text)
    if not isinstance(value, list):
        raise ValueError(f"Expected a JSON array: {path}")
    return value


def col_index(reference: str) -> int:
    letters = re.match(r"[A-Z]+", reference).group(0)
    result = 0
    for char in letters:
        result = result * 26 + ord(char) - 64
    return result - 1


def read_xlsx(path: Path) -> list[list]:
    with zipfile.ZipFile(path) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall("m:si", NS):
                shared.append("".join(node.text or "" for node in item.findall(".//m:t", NS)))
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        relmap = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        rid = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
        sheet = workbook.find(".//m:sheet", NS)
        target = relmap[sheet.attrib[rid]].lstrip("/")
        if not target.startswith("xl/"):
            target = "xl/" + target
        root = ET.fromstring(archive.read(target))
        rows = []
        for row_node in root.findall(".//m:sheetData/m:row", NS):
            cells = {}
            for cell in row_node.findall("m:c", NS):
                idx = col_index(cell.attrib["r"])
                kind = cell.attrib.get("t")
                value_node = cell.find("m:v", NS)
                if kind == "inlineStr":
                    value = "".join(node.text or "" for node in cell.findall(".//m:t", NS))
                elif value_node is None:
                    value = None
                elif kind == "s":
                    value = shared[int(value_node.text)]
                else:
                    value = value_node.text
                cells[idx] = value
            if cells:
                width = max(cells) + 1
                rows.append([cells.get(i) for i in range(width)])
        return rows


def records_from_xlsx(path: Path, expected_header: str) -> list[dict]:
    rows = read_xlsx(path)
    header_index = next(
        i for i, row in enumerate(rows)
        if any(str(value).strip() == expected_header for value in row if value is not None)
    )
    headers = [str(value).strip() if value is not None else f"field_{i}" for i, value in enumerate(rows[header_index])]
    records = []
    for row in rows[header_index + 1:]:
        if not any(value not in (None, "") for value in row):
            continue
        padded = row + [None] * (len(headers) - len(row))
        records.append(dict(zip(headers, padded[:len(headers)])))
    return records


def iter_polygons(geometry: dict):
    if geometry["type"] == "Polygon":
        yield geometry["coordinates"]
    else:
        yield from geometry["coordinates"]


def point_in_ring(x, y, ring):
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][:2]
        xj, yj = ring[j][:2]
        if ((yi > y) != (yj > y)) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def point_in_boundary(x, y, polygons):
    return any(
        point_in_ring(x, y, polygon[0])
        and not any(point_in_ring(x, y, hole) for hole in polygon[1:])
        for polygon in polygons
    )


def out_of_china(lon, lat):
    return not (72.004 <= lon <= 137.8347 and 0.8293 <= lat <= 55.8271)


def transform_lat(lon, lat):
    ret = -100.0 + 2.0 * lon + 3.0 * lat + 0.2 * lat * lat + 0.1 * lon * lat + 0.2 * math.sqrt(abs(lon))
    ret += (20.0 * math.sin(6.0 * lon * math.pi) + 20.0 * math.sin(2.0 * lon * math.pi)) * 2.0 / 3.0
    ret += (20.0 * math.sin(lat * math.pi) + 40.0 * math.sin(lat / 3.0 * math.pi)) * 2.0 / 3.0
    ret += (160.0 * math.sin(lat / 12.0 * math.pi) + 320 * math.sin(lat * math.pi / 30.0)) * 2.0 / 3.0
    return ret


def transform_lon(lon, lat):
    ret = 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lon * lat + 0.1 * math.sqrt(abs(lon))
    ret += (20.0 * math.sin(6.0 * lon * math.pi) + 20.0 * math.sin(2.0 * lon * math.pi)) * 2.0 / 3.0
    ret += (20.0 * math.sin(lon * math.pi) + 40.0 * math.sin(lon / 3.0 * math.pi)) * 2.0 / 3.0
    ret += (150.0 * math.sin(lon / 12.0 * math.pi) + 300.0 * math.sin(lon / 30.0 * math.pi)) * 2.0 / 3.0
    return ret


def gcj_to_wgs(lon, lat):
    if out_of_china(lon, lat):
        return lon, lat
    a, ee = 6378245.0, 0.006693421622965943
    dlat = transform_lat(lon - 105.0, lat - 35.0)
    dlon = transform_lon(lon - 105.0, lat - 35.0)
    radlat = lat / 180.0 * math.pi
    magic = 1 - ee * math.sin(radlat) ** 2
    sqrtmagic = math.sqrt(magic)
    dlat = dlat * 180.0 / ((a * (1 - ee)) / (magic * sqrtmagic) * math.pi)
    dlon = dlon * 180.0 / (a / sqrtmagic * math.cos(radlat) * math.pi)
    return lon * 2 - (lon + dlon), lat * 2 - (lat + dlat)


def normalize_station(value: str | None) -> str:
    value = (value or "").strip()
    for suffix in ("地铁站总站", "地铁站", "站总站", "公交总站", "总站", "站"):
        if value.endswith(suffix):
            value = value[:-len(suffix)]
            break
    # Includes bidi marks and other invisible Unicode formatting characters.
    return re.sub(r"[^0-9A-Za-z\u4e00-\u9fff]+", "", value).lower()


def haversine(a, b):
    lon1, lat1 = map(math.radians, a)
    lon2, lat2 = map(math.radians, b)
    dlon, dlat = lon2 - lon1, lat2 - lat1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(h))


def feature(point, properties):
    return {"type": "Feature", "geometry": {"type": "Point", "coordinates": list(point)}, "properties": properties}


def write_geojson(path: Path, features: list[dict]):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False), encoding="utf-8")


def write_csv(path: Path, rows: list[dict]):
    fields = sorted({key for row in rows for key in row}) if rows else ["empty"]
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


class MetroNodeHandler(osmium.SimpleHandler):
    def __init__(self, polygons, bbox):
        super().__init__()
        self.polygons = polygons
        self.minx, self.miny, self.maxx, self.maxy = bbox
        self.stations = []
        self.entrances = []
        self.toilets = []

    def node(self, node):
        if not node.location.valid():
            return
        lon, lat = node.location.lon, node.location.lat
        if not (self.minx <= lon <= self.maxx and self.miny <= lat <= self.maxy):
            return
        if not point_in_boundary(lon, lat, self.polygons):
            return
        tags = {tag.k: tag.v for tag in node.tags}
        railway = tags.get("railway")
        public_transport = tags.get("public_transport")
        station = tags.get("station")
        props = {
            "osm_id": str(node.id), "name": tags.get("name"), "name_zh": tags.get("name:zh"),
            "ref": tags.get("ref"), "railway": railway, "public_transport": public_transport,
            "station": station, "wheelchair": tags.get("wheelchair"), "entrance": tags.get("entrance"),
        }
        if tags.get("amenity") == "toilets":
            self.toilets.append(feature((lon, lat), {
                "osm_id": str(node.id), "name": tags.get("name"),
                "wheelchair": tags.get("wheelchair"), "access": tags.get("access"),
                "fee": tags.get("fee"), "opening_hours": tags.get("opening_hours"),
                "source": "OpenStreetMap", "coord_source": "WGS84", "confidence": "medium",
            }))
        if railway == "subway_entrance":
            self.entrances.append(feature((lon, lat), props))
        elif station == "subway" or railway in {"station", "halt"} or (
            public_transport == "station" and tags.get("subway") == "yes"
        ):
            if tags.get("bus") != "yes" and tags.get("highway") != "bus_stop" and tags.get("amenity") != "bus_station":
                self.stations.append(feature((lon, lat), props))


class AmapGeocoder:
    def __init__(self, key: str | None, cache_path: Path):
        self.key = key
        self.cache_path = cache_path
        self.cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
        self.calls = 0

    def geocode(self, address: str, city="深圳"):
        cache_key = f"{city}|{address}"
        if cache_key in self.cache:
            value = self.cache[cache_key]
            return tuple(value) if value else None
        if not self.key or not address:
            return None
        payload = None
        for attempt in range(3):
            try:
                response = requests.get(
                    AMAP_GEOCODE,
                    params={"key": self.key, "address": address, "city": city},
                    timeout=20,
                )
                response.raise_for_status()
                payload = response.json()
                break
            except requests.RequestException:
                if attempt < 2:
                    time.sleep(1.5 * (attempt + 1))
        if payload is None:
            # A transient network failure is not cached as a permanent no-match.
            return None
        result = None
        if payload.get("status") == "1" and payload.get("geocodes"):
            location = payload["geocodes"][0].get("location")
            if location:
                gcj_lon, gcj_lat = map(float, location.split(","))
                result = gcj_to_wgs(gcj_lon, gcj_lat)
        self.cache[cache_key] = list(result) if result else None
        self.calls += 1
        if self.calls % 20 == 0:
            self.save()
        time.sleep(0.08)
        return result

    def save(self):
        self.cache_path.write_text(json.dumps(self.cache, ensure_ascii=False, indent=2), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", type=Path, default=Path(r"E:\GIS_data"))
    parser.add_argument("--pbf", type=Path, default=Path(r"E:\GIS_data\guangdong-260710.osm.pbf"))
    parser.add_argument("--boundary", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\futian_boundary.geojson"))
    parser.add_argument("--output", type=Path, default=Path(r"D:\盲行\shenzhen_data\processed\support"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    boundary_fc = json.loads(args.boundary.read_text(encoding="utf-8"))
    polygons = list(iter_polygons(boundary_fc["features"][0]["geometry"]))
    outer_points = [point for polygon in polygons for point in polygon[0]]
    bbox = (
        min(point[0] for point in outer_points), min(point[1] for point in outer_points),
        max(point[0] for point in outer_points), max(point[1] for point in outer_points),
    )
    geocoder = AmapGeocoder(os.environ.get("AMAP_WEB_KEY"), args.output / "amap_geocode_cache.json")

    metro_handler = MetroNodeHandler(polygons, bbox)
    metro_handler.apply_file(str(args.pbf), locations=False)

    station_info = records_from_xlsx(args.raw / "深圳地铁站点信息.xlsx", "编号")
    accessibility = records_from_xlsx(args.raw / "深圳地铁站点无障碍设施位置清单.xlsx", "编号")
    transfers = records_from_xlsx(args.raw / "深圳地铁换乘站信息.xlsx", "编号")
    bus_records = records_from_xlsx(args.raw / "深圳公交站点表.xlsx", "id")
    hospitals = records_from_xlsx(args.raw / "深圳市福田区卫生健康局管辖医院基本信息.xlsx", "名称-MC")

    station_by_norm = defaultdict(list)
    for f in metro_handler.stations:
        props = f["properties"]
        for candidate in (props.get("name_zh"), props.get("name")):
            norm = normalize_station(candidate)
            if norm:
                station_by_norm[norm].append(f)

    info_by_norm = defaultdict(list)
    for row in station_info:
        info_by_norm[normalize_station(row.get("站点名称"))].append(row)
    access_by_norm = defaultdict(list)
    for row in accessibility:
        access_by_norm[normalize_station(row.get("站点名称"))].append(row)
    transfer_by_norm = {normalize_station(row.get("站点名称")): row for row in transfers}

    metro_station_features = []
    used_station_norms = set()
    for norm, features in station_by_norm.items():
        # Collapse duplicate OSM station/platform nodes to one representative point.
        best = next((f for f in features if f["properties"].get("railway") == "station"), features[0])
        info_rows = info_by_norm.get(norm, [])
        access_rows = access_by_norm.get(norm, [])
        transfer = transfer_by_norm.get(norm, {})
        name = (info_rows[0].get("站点名称") if info_rows else None) or best["properties"].get("name_zh") or best["properties"].get("name")
        props = {
            "station_name": name,
            "station_key": norm,
            "lines": "/".join(sorted({str(row.get("线路名称")) for row in info_rows if row.get("线路名称")})),
            "transfer_lines": transfer.get("换乘线路"),
            "description": info_rows[0].get("站点简介") if info_rows else None,
            "accessibility": "\n".join(dict.fromkeys(str(row.get("无障碍设施位置")) for row in access_rows if row.get("无障碍设施位置"))),
            "has_access_info": 1 if access_rows else 0,
            "source": "OSM+深圳政府开放数据",
            "confidence": "high" if info_rows else "medium",
            "osm_id": best["properties"].get("osm_id"),
        }
        metro_station_features.append(feature(best["geometry"]["coordinates"], props))
        used_station_norms.add(norm)

    # Link subway entrances to their nearest station (max 600 m).
    for entrance in metro_handler.entrances:
        point = entrance["geometry"]["coordinates"]
        nearest = None
        nearest_distance = float("inf")
        for station_feature in metro_station_features:
            distance = haversine(point, station_feature["geometry"]["coordinates"])
            if distance < nearest_distance:
                nearest, nearest_distance = station_feature, distance
        entrance["properties"].update({
            "station_name": nearest["properties"]["station_name"] if nearest_distance <= 600 else None,
            "station_key": nearest["properties"]["station_key"] if nearest_distance <= 600 else None,
            "station_distance_m": round(nearest_distance, 1) if nearest_distance < float("inf") else None,
            "source": "OpenStreetMap",
            "confidence": "medium" if nearest_distance <= 250 else "low",
        })

    bus_features = []
    for row in bus_records:
        try:
            gcj_lat, gcj_lon = float(row["lat"]), float(row["lon"])
        except (KeyError, TypeError, ValueError):
            continue
        lon, lat = gcj_to_wgs(gcj_lon, gcj_lat)
        if point_in_boundary(lon, lat, polygons):
            bus_features.append(feature((lon, lat), {
                "bus_id": row.get("id"), "name": row.get("name"), "location": row.get("location"),
                "station_id": row.get("station_id"), "stop_id": row.get("stop_id"),
                "source": "深圳公交站点表", "coord_source": "GCJ02_to_WGS84", "confidence": "medium",
            }))

    toilet_features = []
    for row in load_json_array(args.raw / "公共厕所信息_2920000100929.json"):
        try:
            coord = json.loads(row.get("JWD") or "{}").get("wgs84")
            lon, lat = map(float, coord.split(","))
        except (ValueError, TypeError, AttributeError, json.JSONDecodeError):
            continue
        if point_in_boundary(lon, lat, polygons) and row.get("STATUS") != "作废":
            toilet_features.append(feature((lon, lat), {
                "toilet_id": row.get("ID"), "name": row.get("NAME"), "address": row.get("ADDRESS"),
                "open_time": row.get("OPEN"), "close_time": row.get("CLOSED"), "status": row.get("STATUS"),
                "third_toilet": row.get("DSWSJ"), "mother_baby": row.get("MYS"),
                "source": "深圳公共厕所信息", "coord_source": "provided_WGS84", "confidence": "high",
            }))

    def geocode_rows(rows, name_field, address_field, kind, extra_fields=()):
        features = []
        unmatched = []
        for row in rows:
            address = (row.get(address_field) or "").strip()
            point = geocoder.geocode("深圳市福田区" + address if "深圳" not in address else address)
            props = {
                "name": row.get(name_field), "address": address, "category": kind,
                "source": "深圳政府开放数据+高德地理编码", "coord_source": "AMap_GCJ02_to_WGS84",
                "confidence": "medium" if point else "unmatched",
            }
            for field in extra_fields:
                props[field] = row.get(field)
            if point and point_in_boundary(*point, polygons):
                features.append(feature(point, props))
            else:
                unmatched.append(props)
        return features, unmatched

    parks_raw = load_json_array(args.raw / "福田区-社区公园信息_2920002703870.json")
    park_features, park_unmatched = geocode_rows(parks_raw, "GYMC", "GYWZ", "社区公园", ("MJ",))
    rehab_raw = [row for row in load_json_array(args.raw / "深圳市残疾人康复服务定点机构_2920003501003.json") if row.get("LOCALAREA") == "福田区"]
    rehab_features, rehab_unmatched = geocode_rows(rehab_raw, "UNITNAME", "DETAILADDRESS", "康复服务机构", ("SERVICECONTENT", "CONTACTNUM"))
    hospital_features, hospital_unmatched = geocode_rows(hospitals, "名称-MC", "详细地址-XXDZ", "医院", ("联系电话-LXDH", "交通情况-JTQK", "级别-JB", "等级-DJ"))
    geocoder.save()

    exit_rows = load_json_array(args.raw / "地铁站点出入口及换乘信息_2920000403625.json")
    standardized_exits = []
    for row in exit_rows:
        norm = normalize_station(row.get("BUS_NAME"))
        standardized_exits.append({
            "station_key": norm, "station_or_bus_name": row.get("BUS_NAME"), "exit_name": row.get("SITE_OUT"),
            "connection_info": row.get("INFO"), "info_type": row.get("INFO_TYPE"),
            "site_code": row.get("SITE_CODE"), "line_code": row.get("LINE_CODE"), "source": "深圳政府开放数据",
        })

    write_geojson(args.output / "futian_bus_stops.geojson", bus_features)
    active_toilets = toilet_features if toilet_features else metro_handler.toilets
    write_geojson(args.output / "futian_public_toilets.geojson", active_toilets)
    write_geojson(args.output / "futian_community_parks.geojson", park_features)
    write_geojson(args.output / "futian_rehab_services.geojson", rehab_features)
    write_geojson(args.output / "futian_hospitals.geojson", hospital_features)
    write_geojson(args.output / "futian_metro_stations.geojson", metro_station_features)
    write_geojson(args.output / "futian_metro_entrances.geojson", metro_handler.entrances)
    accessibility_standardized = [dict(row, station_key=normalize_station(row.get("站点名称"))) for row in accessibility]
    transfers_standardized = [dict(row, station_key=normalize_station(row.get("站点名称"))) for row in transfers]
    write_csv(args.output / "metro_accessibility.csv", accessibility_standardized)
    write_csv(args.output / "metro_transfers.csv", transfers_standardized)
    write_csv(args.output / "metro_exit_connections.csv", standardized_exits)
    write_csv(args.output / "unmatched_geocoding.csv", park_unmatched + rehab_unmatched + hospital_unmatched)

    counts = {
        "bus_stops": len(bus_features), "public_toilets": len(active_toilets),
        "government_toilets_active": len(toilet_features), "government_toilets_rejected_obsolete": 10000 - len(toilet_features),
        "community_parks": len(park_features), "rehab_services": len(rehab_features),
        "hospitals": len(hospital_features), "metro_stations": len(metro_station_features),
        "metro_entrances": len(metro_handler.entrances), "metro_accessibility_rows": len(accessibility),
        "metro_transfer_rows": len(transfers), "metro_exit_connection_rows": len(standardized_exits),
        "unmatched_geocoding": len(park_unmatched) + len(rehab_unmatched) + len(hospital_unmatched),
        "amap_calls": geocoder.calls,
    }
    (args.output / "support_data_report.json").write_text(json.dumps(counts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(counts, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
