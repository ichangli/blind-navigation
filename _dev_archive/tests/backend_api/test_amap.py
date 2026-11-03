import unittest
from unittest.mock import patch

from backend.app.services.amap import AmapError, distance_to_route_m, geocode, walking_route


class AmapServiceTests(unittest.TestCase):
    @patch("backend.app.services.amap._request")
    def test_geocode_returns_first_result(self, request):
        request.return_value = {
            "status": "1",
            "geocodes": [{"location": "114.410537,30.477059", "formatted_address": "武汉市光谷天地"}],
        }
        self.assertEqual(geocode("光谷天地"), (114.410537, 30.477059, "武汉市光谷天地"))

    @patch("backend.app.services.amap._request")
    def test_walking_route_parses_steps_and_polyline(self, request):
        request.return_value = {
            "status": "1",
            "route": {"paths": [{
                "distance": "850",
                "duration": "720",
                "steps": [{
                    "instruction": "向东直行",
                    "polyline": "114.404000,30.510800;114.405000,30.511000",
                }],
            }]},
        }
        result = walking_route(114.404, 30.5108, "测试终点", 114.405, 30.511)
        self.assertEqual(result["provider"], "amap-walking")
        self.assertEqual(result["distanceMeters"], 850)
        self.assertEqual(len(result["route"]), 2)
        self.assertEqual(result["instructions"], ["向东直行"])

    @patch("backend.app.services.amap._request")
    def test_walking_route_rejects_empty_paths(self, request):
        request.return_value = {"status": "1", "route": {"paths": []}}
        with self.assertRaises(AmapError):
            walking_route(114.404, 30.5108, "测试终点", 114.405, 30.511)

    def test_distance_to_route(self):
        route = [{"lon": 114.4, "lat": 30.5}, {"lon": 114.41, "lat": 30.5}]
        self.assertLess(distance_to_route_m(114.405, 30.5001, route), 12)
        self.assertGreater(distance_to_route_m(114.405, 30.51, route), 1000)


if __name__ == "__main__":
    unittest.main()
