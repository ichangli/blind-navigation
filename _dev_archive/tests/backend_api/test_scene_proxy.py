import unittest
from types import SimpleNamespace
from unittest.mock import patch

import httpx
from fastapi import HTTPException
from starlette.requests import Request

from backend.app.routers import web
from backend.app.services import geoscene


class FakeUpstreamResponse:
    status_code = 200
    headers = httpx.Headers(
        {
            "content-type": "application/octet-stream",
            "cache-control": "max-age=86400",
            "x-internal-header": "not-forwarded",
        }
    )

    def __init__(self):
        self.closed = False

    async def aiter_raw(self):
        yield b"i3s-"
        yield b"geometry"

    async def aclose(self):
        self.closed = True


class FakeAsyncClient:
    def __init__(self):
        self.url = None
        self.headers = None
        self.response = FakeUpstreamResponse()

    def build_request(self, method, url, headers=None, content=None):
        self.method = method
        self.url = url
        self.headers = headers
        self.content = content
        return object()

    async def send(self, request, stream=False):
        self.stream = stream
        return self.response


class SceneProxyTests(unittest.IsolatedAsyncioTestCase):
    async def test_streams_scene_resource_and_preserves_cache_headers(self):
        settings = SimpleNamespace(
            geoscene_building_layer_url="https://scene.example/SceneServer"
        )
        client = FakeAsyncClient()
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "path": "/api/web/map/scene/layers/0/nodepages/0",
                "query_string": b"f=json",
                "headers": [(b"accept", b"application/json")],
            }
        )

        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.scene_layer_proxy(
                request, "layers/0/nodepages/0"
            )

        body = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(body, b"i3s-geometry")
        self.assertEqual(
            client.url,
            "https://scene.example/SceneServer/layers/0/nodepages/0?f=json",
        )
        self.assertTrue(client.stream)
        self.assertEqual(response.headers["cache-control"], "max-age=86400")
        self.assertNotIn("x-internal-header", response.headers)
        self.assertTrue(client.response.closed)

    async def test_rejects_parent_path_segments(self):
        settings = SimpleNamespace(
            geoscene_building_layer_url="https://scene.example/SceneServer"
        )
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "path": "/api/web/map/scene/../private",
                "query_string": b"",
                "headers": [],
            }
        )
        with patch.object(web, "get_settings", return_value=settings):
            with self.assertRaises(HTTPException) as raised:
                await web.scene_layer_proxy(request, "../private")
        self.assertEqual(raised.exception.status_code, 400)

    async def test_streams_road_mapserver_resource(self):
        settings = SimpleNamespace(
            geoscene_route_mapserver_url="https://scene.example/RouteMapServer",
            geoscene_road_visual_mapserver_url="https://scene.example/RoadVisualMapServer",
        )
        client = FakeAsyncClient()
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "path": "/api/web/map/roads/export",
                "query_string": b"f=image&layers=show%3A6",
                "headers": [(b"accept", b"image/png")],
            }
        )

        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.road_network_proxy(request, "export")

        body = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(body, b"i3s-geometry")
        self.assertEqual(
            client.url,
            "https://scene.example/RoadVisualMapServer/export?f=image&layers=show%3A6",
        )
        self.assertEqual(client.headers["accept"], "image/png")

    async def test_streams_basemap_vector_tile_resource(self):
        settings = SimpleNamespace(
            geoscene_basemap_vector_tile_url=(
                "https://scene.example/VectorTileServer"
            )
        )
        client = FakeAsyncClient()
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "path": "/api/web/map/basemap/tile/14/7138/13382.pbf",
                "query_string": b"blankTile=false",
                "headers": [(b"accept", b"application/x-protobuf")],
            }
        )

        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.basemap_vector_tile_proxy(
                request, "tile/14/7138/13382.pbf"
            )

        body = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(body, b"i3s-geometry")
        self.assertEqual(
            client.url,
            "https://scene.example/VectorTileServer/tile/14/7138/13382.pbf"
            "?blankTile=false",
        )
        self.assertEqual(client.headers["accept"], "application/x-protobuf")

    async def test_forwards_dynamic_road_post_body(self):
        settings = SimpleNamespace(
            geoscene_route_mapserver_url="https://scene.example/RouteMapServer",
            geoscene_road_visual_mapserver_url="https://scene.example/RoadVisualMapServer",
        )
        client = FakeAsyncClient()
        body = b"f=json&dynamicLayers=%5B%7B%22id%22%3A0%7D%5D"
        received = False

        async def receive():
            nonlocal received
            if received:
                return {"type": "http.disconnect"}
            received = True
            return {"type": "http.request", "body": body, "more_body": False}

        request = Request(
            {
                "type": "http",
                "method": "POST",
                "path": "/api/web/map/roads/export",
                "query_string": b"",
                "headers": [(b"content-type", b"application/x-www-form-urlencoded")],
            },
            receive,
        )

        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.road_network_proxy(request, "export")

        _ = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(client.method, "POST")
        self.assertEqual(client.content, body)
        self.assertEqual(
            client.headers["content-type"],
            "application/x-www-form-urlencoded",
        )

    async def test_streams_showcase_water_feature_query(self):
        settings = SimpleNamespace(
            geoscene_showcase_water_featureserver_url=(
                "https://scene.example/FutianShowcaseWater/FeatureServer"
            )
        )
        client = FakeAsyncClient()
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "path": "/api/web/map/water/0/query",
                "query_string": b"where=1%3D1&f=json",
                "headers": [(b"accept", b"application/json")],
            }
        )
        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.showcase_water_proxy(request, "0/query")

        body = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(body, b"i3s-geometry")
        self.assertEqual(
            client.url,
            "https://scene.example/FutianShowcaseWater/FeatureServer/0/"
            "query?where=1%3D1&f=json",
        )
        self.assertEqual(client.headers["accept"], "application/json")
        self.assertTrue(client.response.closed)

    async def test_forwards_showcase_water_post_body(self):
        settings = SimpleNamespace(
            geoscene_showcase_water_featureserver_url=(
                "https://scene.example/FutianShowcaseWater/FeatureServer"
            )
        )
        client = FakeAsyncClient()
        body = b"f=json&geometryType=esriGeometryPoint"
        received = False

        async def receive():
            nonlocal received
            if received:
                return {"type": "http.disconnect"}
            received = True
            return {"type": "http.request", "body": body, "more_body": False}

        request = Request(
            {
                "type": "http",
                "method": "POST",
                "path": "/api/web/map/water/0/query",
                "query_string": b"",
                "headers": [
                    (b"content-type", b"application/x-www-form-urlencoded"),
                ],
            },
            receive,
        )
        with (
            patch.object(web, "get_settings", return_value=settings),
            patch.object(web, "_get_scene_proxy_client", return_value=client),
        ):
            response = await web.showcase_water_proxy(request, "0/query")

        _ = b"".join([chunk async for chunk in response.body_iterator])
        self.assertEqual(client.method, "POST")
        self.assertEqual(
            client.url,
            "https://scene.example/FutianShowcaseWater/FeatureServer/0/query",
        )
        self.assertEqual(client.content, body)
        self.assertEqual(
            client.headers["content-type"],
            "application/x-www-form-urlencoded",
        )
        self.assertTrue(client.response.closed)


class SceneConfigTests(unittest.TestCase):
    def test_browser_receives_same_origin_showcase_water_proxy_url(self):
        settings = SimpleNamespace(
            tianditu_key="",
            wuhan_3dtiles_path=None,
            futian_buildings_path=None,
            geoscene_building_layer_url="",
            backend_public_url="http://127.0.0.1:8000",
            geoscene_portal_url="",
            geoscene_portal_webapps_url="",
            geoscene_server_url="",
            geoscene_server_manager_url="",
            geoscene_webscene_id="",
            map_center_lon=114.055,
            map_center_lat=22.535,
            geoscene_event_layer_url="",
            geoscene_route_mapserver_url="",
            geoscene_road_visual_mapserver_url="",
            geoscene_road_visual_layer_id=0,
            geoscene_road_layer_id=6,
            geoscene_showcase_water_featureserver_url=(
                "https://scene.example/FutianShowcaseWater/FeatureServer"
            ),
            amap_key="",
        )
        with patch.object(geoscene, "get_settings", return_value=settings):
            config = geoscene.get_map_config()
        self.assertEqual(
            config["layers"]["waterLayerUrl"],
            "/api/web/map/water/0",
        )

    def test_browser_receives_same_origin_scene_proxy_url(self):
        settings = SimpleNamespace(
            tianditu_key="",
            wuhan_3dtiles_path=None,
            futian_buildings_path=None,
            geoscene_building_layer_url="https://scene.example/SceneServer",
            backend_public_url="http://127.0.0.1:8000",
            geoscene_portal_url="",
            geoscene_portal_webapps_url="",
            geoscene_server_url="",
            geoscene_server_manager_url="",
            geoscene_webscene_id="",
            map_center_lon=114.055,
            map_center_lat=22.535,
            geoscene_event_layer_url="",
            geoscene_route_mapserver_url="https://scene.example/MapServer",
            geoscene_road_visual_mapserver_url="https://scene.example/RoadVisualMapServer",
            geoscene_road_visual_layer_id=0,
            geoscene_road_layer_id=6,
            amap_key="",
        )
        with patch.object(geoscene, "get_settings", return_value=settings):
            config = geoscene.get_map_config()
        self.assertEqual(
            config["layers"]["buildingLayerUrl"],
            "/api/web/map/scene",
        )
        self.assertEqual(
            config["layers"]["roadLayerUrl"],
            "/api/web/map/roads",
        )
        self.assertEqual(config["layers"]["roadLayerId"], 0)
        self.assertTrue(config["layers"]["roadThematicEnabled"])
        self.assertEqual(config["layers"]["roadFeatureCount"], 52201)

    def test_browser_receives_same_origin_vector_basemap_proxy_url(self):
        settings = SimpleNamespace(
            tianditu_key="",
            wuhan_3dtiles_path=None,
            futian_buildings_path=None,
            geoscene_building_layer_url="",
            backend_public_url="http://127.0.0.1:8000",
            geoscene_portal_url="",
            geoscene_portal_webapps_url="",
            geoscene_server_url="",
            geoscene_server_manager_url="",
            geoscene_webscene_id="",
            map_center_lon=114.055,
            map_center_lat=22.535,
            geoscene_event_layer_url="",
            geoscene_route_mapserver_url="",
            geoscene_road_visual_mapserver_url="",
            geoscene_road_visual_layer_id=0,
            geoscene_road_layer_id=6,
            geoscene_basemap_vector_tile_url=(
                "https://ichangli.gisonline.cn/server/rest/services/Hosted/"
                "FutianDeepSeaBasemap/VectorTileServer"
            ),
            amap_key="",
        )
        with patch.object(geoscene, "get_settings", return_value=settings):
            config = geoscene.get_map_config()

        browser_url = config["basemap"]["vectorTileUrl"]
        self.assertEqual(config["basemap"]["provider"], "geoscene")
        self.assertEqual(
            browser_url,
            "/api/web/map/basemap",
        )
        self.assertNotIn("ichangli.gisonline.cn", browser_url)


if __name__ == "__main__":
    unittest.main()
