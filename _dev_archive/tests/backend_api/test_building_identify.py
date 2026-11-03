import unittest
from unittest.mock import patch

from fastapi import HTTPException

from backend.app.routers import web
from backend.app.services.building_semantics import (
    BuildingCatalogUnavailable,
    BuildingSpatialCatalog,
    identify_building,
    load_building_catalog,
)


def _square_feature() -> dict:
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [114.0000, 22.0000],
                [114.0010, 22.0000],
                [114.0010, 22.0010],
                [114.0000, 22.0010],
                [114.0000, 22.0000],
            ]],
        },
        "properties": {
            "building_id": "test-building-1",
            "osm_id": "123",
            "name": "测试建筑",
            "building": "commercial",
            "bldg_class": "commercial",
            "height_m": 36.5,
            "min_height_m": 4.0,
            "levels_est": 10,
            "height_source": "osm_height",
            "footprint_area_m2": 900.0,
            "roof_shape": "flat",
            "source": "OpenStreetMap",
        },
    }


class BuildingSpatialCatalogTests(unittest.TestCase):
    def test_identifies_containing_building_and_normalizes_fields(self):
        catalog = BuildingSpatialCatalog.from_features([_square_feature()])

        result = catalog.identify(114.0005, 22.0005)

        self.assertTrue(result["matched"])
        self.assertEqual(result["matchType"], "contains")
        self.assertEqual(result["distanceMeters"], 0.0)
        self.assertEqual(result["building"]["buildingId"], "test-building-1")
        self.assertEqual(result["building"]["name"], "测试建筑")
        self.assertEqual(result["building"]["heightM"], 36.5)
        self.assertEqual(result["building"]["estimatedLevels"], 10)
        self.assertEqual(result["highlight"]["geometry"], _square_feature()["geometry"])
        self.assertEqual(result["highlight"]["heightM"], 36.5)
        self.assertEqual(result["highlight"]["minHeightM"], 4.0)

    def test_uses_nearest_building_only_within_tolerance(self):
        catalog = BuildingSpatialCatalog.from_features([_square_feature()])

        nearby = catalog.identify(114.00105, 22.0005, tolerance_meters=10.0)
        far_away = catalog.identify(114.00130, 22.0005, tolerance_meters=10.0)

        self.assertTrue(nearby["matched"])
        self.assertEqual(nearby["matchType"], "nearest")
        self.assertGreater(nearby["distanceMeters"], 0.0)
        self.assertFalse(far_away["matched"])
        self.assertIsNone(far_away["building"])
        self.assertNotIn("highlight", far_away)

    def test_real_catalog_contains_all_published_building_records(self):
        catalog = load_building_catalog()

        self.assertEqual(catalog.building_count, 8897)
        result = identify_building(114.0823, 22.5440)
        self.assertTrue(result["matched"])
        self.assertEqual(result["building"]["buildingId"], "a129792214_0")
        self.assertEqual(result["building"]["buildingClass"], "commercial")


class BuildingIdentifyRouteTests(unittest.TestCase):
    def test_route_returns_building_identify_result(self):
        expected = {
            "matched": True,
            "matchType": "contains",
            "distanceMeters": 0.0,
            "building": {"buildingId": "test-building-1"},
        }
        with patch.object(web, "identify_building", return_value=expected) as identify:
            result = web.map_building_identify(114.0005, 22.0005)

        self.assertEqual(result, expected)
        identify.assert_called_once_with(114.0005, 22.0005)

    def test_route_rejects_out_of_range_coordinates(self):
        with self.assertRaises(HTTPException) as raised:
            web.map_building_identify(181.0, 22.0)

        self.assertEqual(raised.exception.status_code, 422)

    def test_route_returns_503_when_catalog_is_unavailable(self):
        with patch.object(
            web,
            "identify_building",
            side_effect=BuildingCatalogUnavailable("missing building data"),
        ):
            with self.assertRaises(HTTPException) as raised:
                web.map_building_identify(114.0, 22.0)

        self.assertEqual(raised.exception.status_code, 503)


if __name__ == "__main__":
    unittest.main()
