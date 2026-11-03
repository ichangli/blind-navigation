import tempfile
import unittest
from pathlib import Path

from basemap.build_futian_showcase_gdb import (
    APPROVED_OUTPUT_ROOT,
    DERIVED_EXPECTED,
    SOURCE_EXPECTED,
    validate_paths,
)


class ShowcasePathContractTests(unittest.TestCase):
    def _populate(self, root: Path, names) -> None:
        for name in names:
            (root / name).write_text("{}", encoding="utf-8")

    def test_missing_source_and_derived_inputs_are_reported(self):
        with tempfile.TemporaryDirectory() as raw_source, tempfile.TemporaryDirectory() as raw_derived:
            with self.assertRaisesRegex(FileNotFoundError, "context.geojson"):
                validate_paths(Path(raw_source), Path(raw_derived), APPROVED_OUTPUT_ROOT)

    def test_output_outside_showcase_root_is_rejected(self):
        with tempfile.TemporaryDirectory() as raw_source, tempfile.TemporaryDirectory() as raw_derived:
            source = Path(raw_source)
            derived = Path(raw_derived)
            self._populate(source, SOURCE_EXPECTED)
            self._populate(derived, DERIVED_EXPECTED)
            with self.assertRaisesRegex(ValueError, "approved showcase directory"):
                validate_paths(source, derived, derived / "other")

    def test_complete_inputs_and_approved_root_are_accepted(self):
        with tempfile.TemporaryDirectory() as raw_source, tempfile.TemporaryDirectory() as raw_derived:
            source = Path(raw_source)
            derived = Path(raw_derived)
            self._populate(source, SOURCE_EXPECTED)
            self._populate(derived, DERIVED_EXPECTED)
            validate_paths(source, derived, APPROVED_OUTPUT_ROOT)


if __name__ == "__main__":
    unittest.main()
