DEFAULT_LON = 114.0550
DEFAULT_LAT = 22.5350


def detect_event_type(text: str) -> str:
    if any(word in text for word in ["占", "堵", "共享单车", "电动车"]):
        return "盲道被占"
    if any(word in text for word in ["坏", "破", "裂", "坑"]):
        return "盲道损坏"
    if any(word in text for word in ["没有", "缺失", "断了"]):
        return "盲道缺失"
    return "盲道被占"


def detect_landmark(text: str) -> str:
    parts = []
    for word in ["福华路", "市民中心", "市民中心地铁站", "深南大道", "彩田路", "福民路", "会展中心"]:
        if word in text:
            parts.append(word)
    return "".join(parts) if parts else "附近道路"


def parse_report_text(text: str, lon: float | None = None, lat: float | None = None) -> dict:
    parsed_lon = lon if lon is not None else DEFAULT_LON
    parsed_lat = lat if lat is not None else DEFAULT_LAT
    return {
        "type": detect_event_type(text),
        "coords": f"{parsed_lon:.3f}, {parsed_lat:.3f}",
        "lon": parsed_lon,
        "lat": parsed_lat,
        "landmark": detect_landmark(text),
        "description": text,
    }
