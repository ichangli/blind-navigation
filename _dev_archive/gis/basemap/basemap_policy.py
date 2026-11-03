"""Small, testable content and visual policy for the Futian basemap."""

from __future__ import annotations

from types import MappingProxyType
from typing import Mapping


WATER_NATURAL = frozenset({"water", "bay"})
WATER_LANDUSE = frozenset({"reservoir", "basin"})
PARK_LEISURE = frozenset({"park", "garden", "nature_reserve"})
PARK_LANDUSE = frozenset({"grass", "recreation_ground", "forest"})
PARK_NATURAL = frozenset({"wood", "grassland"})

ROAD_CLASSES = MappingProxyType(
    {
        "motorway": "expressway",
        "motorway_link": "expressway",
        "trunk": "expressway",
        "trunk_link": "expressway",
        "primary": "primary",
        "primary_link": "primary",
        "secondary": "secondary",
        "secondary_link": "secondary",
        "tertiary": "tertiary",
        "tertiary_link": "tertiary",
    }
)

STYLE_POLICY = MappingProxyType(
    {
        "background": "#071522",
        "land": "#0D2438",
        "water": "#061A30",
        "park": "#123F46",
        "boundary": "#2B7894",
        "label": "#B8CAD6",
    }
)

SCALE_POLICY = MappingProxyType(
    {
        "package_min": 288895.277144,
        "package_max": 2256.994353,
        "district_labels": 300000,
        "place_labels": 100000,
        "park_labels": 50000,
        "metro_labels": 30000,
        "road_labels": 30000,
    }
)


def classify_area(tags: Mapping[str, str]) -> str | None:
    """Return the quiet polygon class retained by the basemap."""

    if (
        tags.get("natural") in WATER_NATURAL
        or tags.get("landuse") in WATER_LANDUSE
        or tags.get("waterway") == "riverbank"
    ):
        return "water"
    if (
        tags.get("leisure") in PARK_LEISURE
        or tags.get("landuse") in PARK_LANDUSE
        or tags.get("natural") in PARK_NATURAL
    ):
        return "park"
    return None


def classify_road(tags: Mapping[str, str]) -> str | None:
    """Keep only roads that provide broad geographic context."""

    return ROAD_CLASSES.get(tags.get("highway", ""))


def classify_place(tags: Mapping[str, str]) -> str | None:
    """Return one of the deliberately sparse place-label classes."""

    if tags.get("place") in {"suburb", "quarter", "neighbourhood"}:
        return tags["place"]
    return None


def choose_label(tags: Mapping[str, str]) -> str:
    """Prefer a Chinese name and fall back to the ordinary OSM name."""

    return (tags.get("name:zh") or tags.get("name") or "").strip()
