import unittest
from unittest.mock import patch

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from backend.app.database import Base
from backend.app.models import User
from backend.app.routers.mobile import navigation_plan, resolve_futian_mobile_location
from backend.app.schemas import NavigationPlanRequest


class NavigationPlanTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        self.user = User(id=1, username="tester", password_hash="x", role="user")
        self.db.add(self.user)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    @patch("backend.app.routers.mobile.recommended_metro_entrance", return_value=None)
    @patch("backend.app.routers.mobile.facilities_along_route", return_value=[])
    @patch("backend.app.routers.mobile.walking_route")
    @patch("backend.app.routers.mobile.solve_accessible_route")
    @patch("backend.app.routers.mobile.geocode")
    def test_returns_safe_and_ordinary_options(self, geocode, solve, walking, facilities, entrance):
        geocode.side_effect = [
            (114.055, 22.535, "深圳市民中心"),
            (114.061, 22.539, "深圳会展中心"),
        ]
        base_route = [{"lon": 114.055, "lat": 22.535}, {"lon": 114.061, "lat": 22.539}]
        solve.return_value = {
            "destination": "深圳会展中心", "destinationLocation": {"lon": 114.061, "lat": 22.539},
            "distanceMeters": 1800, "durationSeconds": 1800, "safeMinutes": 30,
            "route": base_route, "instructions": ["沿安全路线前行"],
            "provider": "geoscene-safe-route", "coordinateSystem": "GCJ-02",
        }
        walking.return_value = {
            "destination": "深圳会展中心", "destinationLocation": {"lon": 114.061, "lat": 22.539},
            "distanceMeters": 1500, "durationSeconds": 1200, "route": base_route,
            "instructions": ["沿普通路线前行"], "provider": "amap-walking", "coordinateSystem": "GCJ-02",
        }
        result = navigation_plan(
            NavigationPlanRequest(origin="深圳市民中心", destination="深圳会展中心"),
            self.user,
            self.db,
        )
        self.assertEqual(result["provider"], "geoscene-safe-route")
        self.assertEqual(len(result["routeOptions"]), 2)
        self.assertEqual(result["comparison"]["extraDistanceMeters"], 300)

    def test_mobile_location_falls_back_to_demo_point_outside_futian(self):
        lon, lat, fallback = resolve_futian_mobile_location(116.397, 39.908)

        self.assertEqual((lon, lat), (114.055, 22.535))
        self.assertTrue(fallback)

    def test_mobile_location_keeps_gcj02_point_inside_futian(self):
        lon, lat, fallback = resolve_futian_mobile_location(114.055, 22.535)

        self.assertEqual((lon, lat), (114.055, 22.535))
        self.assertFalse(fallback)


if __name__ == "__main__":
    unittest.main()
