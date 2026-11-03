import tempfile
import unittest
import re
import inspect
from pathlib import Path
from unittest.mock import patch

import build_demo_package


class DemoEnvironmentTests(unittest.TestCase):
    def test_write_demo_env_preserves_showcase_service_urls(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            backend = root / "backend"
            backend.mkdir()
            (backend / ".env").write_text(
                "GEOSCENE_BASEMAP_VECTOR_TILE_URL=https://scene.example/VectorTileServer\n"
                "GEOSCENE_SHOWCASE_WATER_FEATURESERVER_URL=https://scene.example/FeatureServer\n",
                encoding="utf-8",
            )
            destination = root / "demo.env"

            with patch.object(build_demo_package, "ROOT", root):
                build_demo_package.write_demo_env(destination)

            output = destination.read_text(encoding="utf-8")
            self.assertIn(
                "GEOSCENE_BASEMAP_VECTOR_TILE_URL=https://scene.example/VectorTileServer",
                output,
            )
            self.assertIn(
                "GEOSCENE_SHOWCASE_WATER_FEATURESERVER_URL=https://scene.example/FeatureServer",
                output,
            )

    def test_portable_manifest_includes_every_local_html_script(self):
        local_scripts = set()
        for html_name in build_demo_package.PACKAGED_HTML_FILES:
            html = (build_demo_package.ROOT / html_name).read_text(encoding="utf-8")
            for source in re.findall(r'<script[^>]+src=["\']([^"\']+)', html):
                asset = source.split("?", 1)[0].removeprefix("./")
                if not asset.startswith(("http://", "https://", "//")):
                    local_scripts.add(asset)

        packaged = set(build_demo_package.PACKAGED_ROOT_FILES)
        self.assertTrue(local_scripts)
        self.assertTrue(
            local_scripts.issubset(packaged),
            f"Portable manifest is missing local scripts: "
            f"{sorted(local_scripts - packaged)}",
        )
        self.assertIn("road-visuals.js", local_scripts)
        self.assertIn("water-visuals.js", local_scripts)

    def test_portable_manifest_keeps_building_attribute_catalog(self):
        build_source = inspect.getsource(build_demo_package.build)
        self.assertIn("futian_buildings_cityengine.geojson", build_source)
        self.assertIn('"shenzhen_data/processed/buildings"', build_source)


if __name__ == "__main__":
    unittest.main()
