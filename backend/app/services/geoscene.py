from ..config import get_settings


def get_map_config() -> dict:
    settings = get_settings()
    tk = settings.tianditu_key
    token_part = f"&tk={tk}" if tk else "&tk="
    tiles_path = settings.wuhan_3dtiles_path
    tiles_enabled = bool(
        tiles_path
        and tiles_path.exists()
        and (tiles_path / "tileset.json").exists()
    )
    buildings_path = settings.futian_buildings_path
    local_buildings_enabled = bool(buildings_path and buildings_path.exists())
    scene_proxy_url = (
        "/api/web/map/scene"
        if settings.geoscene_building_layer_url.strip()
        else ""
    )
    basemap_vector_tile_url = getattr(
        settings, "geoscene_basemap_vector_tile_url", ""
    ).strip()
    basemap_proxy_url = (
        "/api/web/map/basemap"
        if basemap_vector_tile_url
        else ""
    )
    water_source_url = getattr(
        settings, "geoscene_showcase_water_featureserver_url", ""
    ).strip()
    water_proxy_url = (
        "/api/web/map/water/0"
        if water_source_url
        else ""
    )
    road_visual_url = getattr(
        settings, "geoscene_road_visual_mapserver_url", ""
    ).strip()
    road_source_url = road_visual_url or settings.geoscene_route_mapserver_url.strip()
    road_proxy_url = (
        "/api/web/map/roads"
        if road_source_url
        else ""
    )
    road_layer_id = (
        getattr(settings, "geoscene_road_visual_layer_id", 0)
        if road_visual_url
        else settings.geoscene_road_layer_id
    )
    return {
        "portalUrl": settings.geoscene_portal_url,
        "portalWebappsUrl": settings.geoscene_portal_webapps_url,
        "serverUrl": settings.geoscene_server_url,
        "serverManagerUrl": settings.geoscene_server_manager_url,
        "webSceneId": settings.geoscene_webscene_id,
        "center": {
            "longitude": settings.map_center_lon,
            "latitude": settings.map_center_lat,
            "z": 2200 if (tiles_enabled or local_buildings_enabled) else 9000,
            "heading": 0,
            "tilt": 55,
        },
        "basemap": {
            "provider": "geoscene" if basemap_vector_tile_url else "tianditu",
            "type": "wmts",
            "vectorTileUrl": basemap_proxy_url,
            "vecUrl": "https://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile"
            + token_part,
            "cvaUrl": "https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile"
            + token_part,
            "imgUrl": "https://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile"
            + token_part,
            "ciaUrl": "https://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile"
            + token_part,
        },
        "layers": {
            # I3S 几何统一经后端同源流式转发。这样既能复用连接和缓存头，
            # 也不会让浏览器因内网 GeoScene 证书链而退回整份 GeoJSON。
            "buildingLayerUrl": scene_proxy_url,
            "waterLayerUrl": water_proxy_url,
            "roadLayerUrl": road_proxy_url,
            "roadLayerId": road_layer_id,
            "roadFeatureCount": 52201 if road_visual_url else 0,
            "roadThematicEnabled": bool(road_visual_url),
            "eventLayerUrl": settings.geoscene_event_layer_url,
            "blindLaneHeatLayerUrl": "",
            "busCoverageLayerUrl": "",
        },
        "localBuildings": {
            "enabled": local_buildings_enabled,
            "type": "geojson-extrusion",
            "name": "福田区建筑白模",
            "url": settings.futian_buildings_url if local_buildings_enabled else "",
            "heightField": "height_m",
            "classField": "bldg_class",
            "featureCount": 8897,
            "note": "本地建筑面按高度字段在 SceneView 中动态拉伸，不依赖 Hosted SceneServer。",
        },
        "tiles3d": {
            "enabled": tiles_enabled,
            "type": "3dtiles",
            "name": "福田区建筑白模",
            "tilesetUrl": settings.wuhan_3dtiles_url if tiles_enabled else "",
            "sourcePath": str(tiles_path) if tiles_path else "",
            "eventHeight": -620,
            "note": "福田区 3D Tiles 建筑白模，用作无障碍治理端地标参照",
        },
        "amap": {
            "enabled": bool(settings.amap_key),
            "note": "高德 Key 只在后端代理中使用，前端不直接写死",
        },
        "tianditu": {
            "enabled": bool(settings.tianditu_key),
            "keyConfigured": bool(settings.tianditu_key),
        },
    }
