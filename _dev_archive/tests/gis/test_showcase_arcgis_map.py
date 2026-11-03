import unittest
from pathlib import Path

from basemap.configure_and_package_futian_showcase import (
    BASEMAP_MAP_NAME,
    OPERATIONAL_MAP_NAME,
    PACKAGE_MAX_SCALE,
    PACKAGE_MIN_SCALE,
    PROJECT_TEMPLATE,
    hex_to_rgba,
    place_layer_specs,
    road_layer_specs,
    save_layer_copy,
    water_layer_specs,
)


class ShowcaseArcGISMapPolicyTests(unittest.TestCase):
    def test_project_template_and_map_names_are_fixed(self):
        self.assertTrue(Path(PROJECT_TEMPLATE).is_file())
        self.assertEqual(BASEMAP_MAP_NAME, "FutianShowcaseBasemap")
        self.assertEqual(OPERATIONAL_MAP_NAME, "FutianShowcaseOperationalLayers")

    def test_color_conversion_uses_arcgis_alpha_range(self):
        self.assertEqual(hex_to_rgba("#06131F"), [6, 19, 31, 100])
        self.assertEqual(hex_to_rgba("#00D9FF", 28), [0, 217, 255, 28])

    def test_water_layers_are_ranked_minor_to_major_for_drawing(self):
        specs = water_layer_specs()
        self.assertEqual([item["water_class"] for item in specs], ["minor", "medium", "major"])
        self.assertEqual(specs[-1]["fill"], "#087DA0")
        self.assertTrue(all("water_class =" in item["where"] for item in specs))

    def test_road_layers_form_three_strokes_with_expressways_on_top(self):
        specs = road_layer_specs()
        self.assertEqual(len(specs), 9)
        self.assertEqual([item["stroke"] for item in specs[:3]], ["glow", "casing", "core"])
        self.assertEqual([item["road_class"] for item in specs[-3:]], ["expressway"] * 3)
        self.assertEqual([item["width"] for item in specs[-3:]], [10.0, 5.0, 2.6])
        self.assertEqual(specs[-1]["color"], "#7AEAFF")

    def test_labels_remain_deliberately_sparse_and_scale_range_is_approved(self):
        self.assertEqual(
            [item["place_class"] for item in place_layer_specs()],
            ["suburb", "quarter", "park", "metro"],
        )
        self.assertEqual(PACKAGE_MIN_SCALE, 288895.277144)
        self.assertEqual(PACKAGE_MAX_SCALE, 2256.994353)

    def test_layer_files_use_the_layer_object_copy_api(self):
        calls = []

        class FakeLayer:
            def saveACopy(self, path):
                calls.append(path)

        save_layer_copy(FakeLayer(), Path(r"E:\derived\water.lyrx"))
        self.assertEqual(calls, [r"E:\derived\water.lyrx"])


if __name__ == "__main__":
    unittest.main()
