import unittest
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError

from backend.app import schemas
from backend.app.routers import web
from backend.app.services import geoscene_route


class WebNavigationServiceTests(unittest.TestCase):
    def test_adapts_wgs84_scene_points_and_returns_wgs84_route(self):
        origin_wgs = (114.049, 22.535)
        destination_wgs = (114.056, 22.541)
        origin_gcj = geoscene_route.wgs84_to_gcj02(*origin_wgs)
        destination_gcj = geoscene_route.wgs84_to_gcj02(*destination_wgs)
        solved = {
            "destination": "地图选点终点",
            "destinationLocation": {"lon": destination_gcj[0], "lat": destination_gcj[1]},
            "distanceMeters": 1280,
            "durationSeconds": 940,
            "safeMinutes": 15.6,
            "route": [
                {"lon": origin_gcj[0], "lat": origin_gcj[1]},
                {"lon": destination_gcj[0], "lat": destination_gcj[1]},
            ],
            "provider": "geoscene-safe-route",
            "coordinateSystem": "GCJ-02",
            "sourceCoordinateSystem": "WGS84",
            "snapInfo": [
                {"name": "起点", "distanceMeters": 2.1},
                {"name": "终点", "distanceMeters": 3.4},
            ],
        }

        with patch.object(
            geoscene_route,
            "solve_accessible_route",
            return_value=solved,
        ) as solve:
            result = geoscene_route.solve_web_accessible_route(
                *origin_wgs,
                *destination_wgs,
            )

        args = solve.call_args.args
        self.assertAlmostEqual(args[0], origin_gcj[0], places=7)
        self.assertAlmostEqual(args[1], origin_gcj[1], places=7)
        self.assertEqual(args[2], "地图选点终点")
        self.assertAlmostEqual(args[3], destination_gcj[0], places=7)
        self.assertAlmostEqual(args[4], destination_gcj[1], places=7)
        self.assertEqual(result["coordinateSystem"], "WGS84")
        self.assertEqual(result["sourceCoordinateSystem"], "GeoScene-Network-Analysis")
        self.assertEqual(result["originLocation"], {"lon": origin_wgs[0], "lat": origin_wgs[1]})
        self.assertEqual(
            result["destinationLocation"],
            {"lon": destination_wgs[0], "lat": destination_wgs[1]},
        )
        self.assertAlmostEqual(result["route"][0]["lon"], origin_wgs[0], places=6)
        self.assertAlmostEqual(result["route"][0]["lat"], origin_wgs[1], places=6)
        self.assertAlmostEqual(result["route"][1]["lon"], destination_wgs[0], places=6)
        self.assertAlmostEqual(result["route"][1]["lat"], destination_wgs[1], places=6)


class WebNavigationRouteTests(unittest.TestCase):
    def test_request_model_rejects_invalid_longitude(self):
        with self.assertRaises(ValidationError):
            schemas.WebNavigationSolveRequest(
                origin={"lon": 181, "lat": 22.535},
                destination={"lon": 114.056, "lat": 22.541},
            )

    def test_route_returns_geoscene_result(self):
        payload = schemas.WebNavigationSolveRequest(
            origin={"lon": 114.049, "lat": 22.535},
            destination={"lon": 114.056, "lat": 22.541},
        )
        expected = {
            "provider": "geoscene-safe-route",
            "coordinateSystem": "WGS84",
            "route": [
                {"lon": 114.049, "lat": 22.535},
                {"lon": 114.056, "lat": 22.541},
            ],
        }

        with patch.object(web, "solve_web_accessible_route", return_value=expected) as solve:
            result = web.solve_web_navigation(payload)

        self.assertEqual(result, expected)
        solve.assert_called_once_with(114.049, 22.535, 114.056, 22.541)

    def test_route_maps_geoscene_errors_to_422(self):
        payload = schemas.WebNavigationSolveRequest(
            origin={"lon": 114.049, "lat": 22.535},
            destination={"lon": 114.056, "lat": 22.541},
        )

        with patch.object(
            web,
            "solve_web_accessible_route",
            side_effect=geoscene_route.GeoSceneRouteError("起点和终点所在道路暂不连通"),
        ):
            with self.assertRaises(HTTPException) as raised:
                web.solve_web_navigation(payload)

        self.assertEqual(raised.exception.status_code, 422)
        self.assertEqual(raised.exception.detail, "起点和终点所在道路暂不连通")


if __name__ == "__main__":
    unittest.main()
