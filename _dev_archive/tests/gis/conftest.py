from __future__ import annotations

import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
GIS_ARCHIVE_ROOT = PROJECT_ROOT / "_dev_archive" / "gis"

for path in (PROJECT_ROOT, GIS_ARCHIVE_ROOT):
    if str(path) not in sys.path:
        sys.path.insert(0, str(path))

