import unittest
from pathlib import Path

from basemap.configure_and_package_futian_basemap import (
    PACKAGE_MAX_SCALE,
    PACKAGE_MIN_SCALE,
    PROJECT_TEMPLATE,
    hex_to_rgba,
    place_layer_specs,
    road_layer_specs,
)


class ArcGISMapPolicyTests(unittest.TestCase):
    def test_arcgis_project_template_exists(self):
        self.assertTrue(Path(PROJECT_TEMPLATE).is_file())

    def test_hex_color_conversion_uses_arcgis_alpha_range(self):
        self.assertEqual(hex_to_rgba("#071522"), [7, 21, 34, 100])
        self.assertEqual(hex_to_rgba("#B8CAD6", alpha=65), [184, 202, 214, 65])

    def test_road_layers_have_independent_scale_ranges(self):
        specs = road_layer_specs()
        self.assertEqual([item["road_class"] for item in specs], ["tertiary", "secondary", "primary", "expressway"])
        self.assertEqual([item["min_scale"] for item in specs], [30000, 80000, 150000, 0])
        self.assertEqual(specs[-1]["width"], 2.2)
        self.assertNotEqual(specs[0]["color"], specs[-1]["color"])

    def test_place_layers_exclude_neighbourhood_clutter(self):
        specs = place_layer_specs()
        self.assertEqual(
            [item["place_class"] for item in specs],
            ["suburb", "quarter", "park", "metro"],
        )
        self.assertEqual(specs[0]["where"], "place_class = 'suburb'")
        self.assertEqual(specs[1]["where"], "place_class = 'quarter'")
        self.assertTrue(all("neighbourhood" not in item["where"] for item in specs))
        self.assertEqual(
            [item["min_scale"] for item in specs],
            [150000, 50000, 50000, 30000],
        )

    def test_package_uses_the_approved_online_scale_range(self):
        self.assertEqual(PACKAGE_MIN_SCALE, 288895.277144)
        self.assertEqual(PACKAGE_MAX_SCALE, 2256.994353)


if __name__ == "__main__":
    unittest.main()
