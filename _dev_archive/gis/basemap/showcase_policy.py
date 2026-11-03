"""Filtering and symbol policy for the Futian showcase basemap."""

from __future__ import annotations

from types import MappingProxyType
from typing import Any, Mapping


WATER_AREA_MIN_M2 = 1000.0
WATER_AREA_MEDIUM_M2 = 10000.0
WATER_AREA_MAJOR_M2 = 100000.0
SECONDARY_MIN_GROUP_LENGTH_M = 3000.0

SHOWCASE_STYLE_POLICY: Mapping[str, str] = MappingProxyType(
    {
        "background": "#06131F",
        "land": "#0B2234",
        "park": "#103F45",
        "water_major": "#087DA0",
        "water_medium": "#08607D",
        "water_minor": "#07445E",
        "water_outline": "#18B7D8",
        "boundary": "#2688A6",
        "label": "#C7DCE8",
        "road_casing": "#06131F",
    }
)

ROAD_STYLE_POLICY: Mapping[str, Mapping[str, Any]] = MappingProxyType(
    {
        "expressway": MappingProxyType(
            {
                "display_rank": 1,
                "glow_color": "#00D9FF",
                "glow_width": 10.0,
                "glow_alpha": 28,
                "casing_color": "#06131F",
                "casing_width": 5.0,
                "casing_alpha": 96,
                "core_color": "#7AEAFF",
                "core_width": 2.6,
                "core_alpha": 100,
                "min_scale": 0.0,
            }
        ),
        "primary": MappingProxyType(
            {
                "display_rank": 2,
                "glow_color": "#00C8F0",
                "glow_width": 8.0,
                "glow_alpha": 24,
                "casing_color": "#06131F",
                "casing_width": 4.0,
                "casing_alpha": 94,
                "core_color": "#39D1F2",
                "core_width": 2.0,
                "core_alpha": 96,
                "min_scale": 150000.0,
            }
        ),
        "secondary": MappingProxyType(
            {
                "display_rank": 3,
                "glow_color": "#158FB1",
                "glow_width": 6.0,
                "glow_alpha": 18,
                "casing_color": "#06131F",
                "casing_width": 3.0,
                "casing_alpha": 92,
                "core_color": "#2B9DBB",
                "core_width": 1.4,
                "core_alpha": 90,
                "min_scale": 60000.0,
            }
        ),
    }
)


def classify_water_area(area_m2: float) -> dict[str, Any] | None:
    """Return presentation attributes for a water polygon or reject it."""

    area = float(area_m2)
    if area < WATER_AREA_MIN_M2:
        return None
    if area >= WATER_AREA_MAJOR_M2:
        return {
            "water_class": "major",
            "display_rank": 1,
            "waterbody_size": "large",
            "wave_strength": "moderate",
        }
    if area >= WATER_AREA_MEDIUM_M2:
        return {
            "water_class": "medium",
            "display_rank": 2,
            "waterbody_size": "medium",
            "wave_strength": "slight",
        }
    return {
        "water_class": "minor",
        "display_rank": 3,
        "waterbody_size": "small",
        "wave_strength": "calm",
    }


def road_is_retained(road_class: str, label: object, grouped_length_m: float) -> bool:
    """Return whether a dissolved named road belongs in the showcase skeleton."""

    if not str(label or "").strip():
        return False
    if road_class in {"expressway", "primary"}:
        return True
    if road_class == "secondary":
        return float(grouped_length_m) >= SECONDARY_MIN_GROUP_LENGTH_M
    return False
