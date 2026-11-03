import unittest
from unittest.mock import Mock, patch

from backend.app.services.geoscene_route import (
    gcj02_to_wgs84,
    solve_accessible_route,
    wgs84_to_gcj02,
)


class GeoSceneRouteTests(unittest.TestCase):
    def test_coordinate_round_trip_in_futian(self):
        wgs = (114.049, 22.535)
        gcj = wgs84_to_gcj02(*wgs)
        restored = gcj02_to_wgs84(*gcj)
        self.assertAlmostEqual(restored[0], wgs[0], places=6)
        self.assertAlmostEqual(restored[1], wgs[1], places=6)

    @patch("backend.app.services.geoscene_route.httpx.post")
    def test_solve_parses_safe_minutes_and_geometry(self, post):
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {
            "routes": {
                "features": [{
                    "attributes": {"Total_SafeMinutes": 4.25},
                    "geometry": {"paths": [[[114.049, 22.535], [114.050, 22.536]]]},
                }]
            },
            "stops": {"features": [
                {"geometry": {"x": 114.049, "y": 22.535}},
                {"geometry": {"x": 114.050, "y": 22.536}},
            ]},
        }
        post.return_value = response

        origin_gcj = wgs84_to_gcj02(114.049, 22.535)
        destination_gcj = wgs84_to_gcj02(114.050, 22.536)
        result = solve_accessible_route(
            *origin_gcj, "测试终点", *destination_gcj
        )

        self.assertEqual(result["provider"], "geoscene-safe-route")
        self.assertEqual(result["safeMinutes"], 4.25)
        self.assertEqual(result["durationSeconds"], 255)
        self.assertEqual(len(result["route"]), 2)
        sent = post.call_args.kwargs["data"]
        self.assertEqual(sent["returnDirections"], "false")
        self.assertEqual(sent["impedanceAttributeName"], "SafeMinutes")


if __name__ == "__main__":
    unittest.main()
