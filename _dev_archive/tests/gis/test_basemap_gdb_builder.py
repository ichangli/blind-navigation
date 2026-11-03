import tempfile
import unittest
from pathlib import Path

from basemap.build_futian_basemap_gdb import (
    APPROVED_OUTPUT_ROOT,
    EXPECTED,
    validate_paths,
)


class ValidatePathsTests(unittest.TestCase):
    def test_missing_inputs_are_listed(self):
        with tempfile.TemporaryDirectory() as raw:
            with self.assertRaisesRegex(FileNotFoundError, "context.geojson"):
                validate_paths(Path(raw), APPROVED_OUTPUT_ROOT)

    def test_output_outside_approved_root_is_rejected(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            for name in EXPECTED:
                (root / name).write_text("{}", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "approved derived-data directory"):
                validate_paths(root, root / "other")

    def test_complete_inputs_and_approved_root_are_accepted(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            for name in EXPECTED:
                (root / name).write_text("{}", encoding="utf-8")
            validate_paths(root, APPROVED_OUTPUT_ROOT)


if __name__ == "__main__":
    unittest.main()
