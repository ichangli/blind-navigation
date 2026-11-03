import unittest

from backend.app.services.building_semantics import load_building_semantics
from backend.app.services.support_data import (
    facilities_along_route,
    load_support_points,
    load_web_map_context,
    nearby_bus_stops,
)


class SupportDataTests(unittest.TestCase):
    def test_loads_futian_support_points(self):
        points = load_support_points()
        self.assertGreater(len(points), 1800)
        self.assertIn("metroEntrance", {point["category"] for point in points})
        self.assertTrue(all("lon" in point and "lat" in point for point in points))

    def test_loads_web_map_context_in_wgs84(self):
        context = load_web_map_context()
        self.assertEqual(context["coordinateSystem"], "WGS84")
        self.assertEqual(context["featureCount"], 1968)
        self.assertEqual(context["boundary"]["name"], "福田区")
        categories = {item["category"] for item in context["features"]}
        self.assertIn("metroStation", categories)
        self.assertIn("busStop", categories)
        station = next(item for item in context["features"] if item["category"] == "metroStation")
        self.assertTrue(station["stationKey"])
        self.assertTrue(station["accessibility"])

    def test_filters_points_near_route(self):
        route = [{"lon": 114.055, "lat": 22.535}, {"lon": 114.061, "lat": 22.539}]
        facilities = facilities_along_route(route, corridor_m=100)
        self.assertLessEqual(len(facilities), 24)
        self.assertTrue(all(item["distanceToRouteMeters"] <= 100 for item in facilities))

    def test_returns_real_bus_stops_sorted_by_distance(self):
        stops = nearby_bus_stops(114.055, 22.535, limit=5)

        self.assertEqual(len(stops), 5)
        self.assertEqual(
            [stop["distanceMeters"] for stop in stops],
            sorted(stop["distanceMeters"] for stop in stops),
        )
        self.assertTrue(all(stop["name"] for stop in stops))
        self.assertTrue(all(stop["source"] for stop in stops))
        self.assertTrue(all("lon" in stop and "lat" in stop for stop in stops))
        self.assertTrue(all(stop["distanceMeters"] >= 0 for stop in stops))
        self.assertEqual(
            len({(stop["name"], stop["address"]) for stop in stops}),
            len(stops),
            "nearby station cards should not repeat the same named roadside stop",
        )

    def test_building_semantics_links_only_building_based_facilities(self):
        semantics = load_building_semantics()
        metadata = semantics["metadata"]
        self.assertEqual(metadata["sourceBuildingCount"], 8897)
        self.assertGreater(metadata["buildingCount"], 20)
        self.assertGreater(metadata["linkedFacilityCount"], 20)
        self.assertTrue(semantics["features"])
        linked_ids = set(semantics["facilityLinks"])
        context = load_web_map_context()
        linked_categories = {
            item["category"] for item in context["features"] if item["id"] in linked_ids
        }
        self.assertTrue(linked_categories <= {"hospital", "rehab", "toilet", "metroStation"})
        self.assertNotIn("busStop", linked_categories)


if __name__ == "__main__":
    unittest.main()
