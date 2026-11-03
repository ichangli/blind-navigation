from types import MappingProxyType

from basemap.showcase_policy import (
    ROAD_STYLE_POLICY,
    SHOWCASE_STYLE_POLICY,
    WATER_AREA_MIN_M2,
    classify_water_area,
    road_is_retained,
)


def test_water_area_boundaries_are_explicit():
    assert WATER_AREA_MIN_M2 == 1000.0
    assert classify_water_area(999.99) is None
    assert classify_water_area(1000.0) == {
        "water_class": "minor",
        "display_rank": 3,
        "waterbody_size": "small",
        "wave_strength": "calm",
    }
    assert classify_water_area(9999.99)["water_class"] == "minor"
    assert classify_water_area(10000.0) == {
        "water_class": "medium",
        "display_rank": 2,
        "waterbody_size": "medium",
        "wave_strength": "slight",
    }
    assert classify_water_area(100000.0) == {
        "water_class": "major",
        "display_rank": 1,
        "waterbody_size": "large",
        "wave_strength": "moderate",
    }


def test_roads_reject_unnamed_and_short_secondary_groups():
    assert not road_is_retained("expressway", "", 10000)
    assert not road_is_retained("primary", "   ", 10000)
    assert road_is_retained("expressway", "北环大道", 100)
    assert road_is_retained("primary", "深南大道", 100)
    assert not road_is_retained("secondary", "测试路", 2999.99)
    assert road_is_retained("secondary", "测试路", 3000.0)
    assert not road_is_retained("tertiary", "测试路", 100000)


def test_showcase_style_contract_is_immutable_and_layered():
    assert isinstance(SHOWCASE_STYLE_POLICY, MappingProxyType)
    assert isinstance(ROAD_STYLE_POLICY, MappingProxyType)
    assert SHOWCASE_STYLE_POLICY["background"] == "#06131F"
    assert SHOWCASE_STYLE_POLICY["water_major"] == "#087DA0"
    assert set(ROAD_STYLE_POLICY) == {"expressway", "primary", "secondary"}
    for road_class in ROAD_STYLE_POLICY:
        style = ROAD_STYLE_POLICY[road_class]
        assert style["glow_width"] > style["casing_width"] > style["core_width"]
        assert style["glow_alpha"] < style["core_alpha"]
    assert ROAD_STYLE_POLICY["expressway"]["glow_width"] == 10.0
    assert ROAD_STYLE_POLICY["primary"]["glow_width"] == 8.0
    assert ROAD_STYLE_POLICY["secondary"]["glow_width"] == 6.0
