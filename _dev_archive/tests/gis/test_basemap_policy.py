from types import MappingProxyType

import pytest

from basemap.basemap_policy import (
    SCALE_POLICY,
    STYLE_POLICY,
    choose_label,
    classify_area,
    classify_place,
    classify_road,
)


def test_area_classification_is_deliberately_small():
    assert classify_area({"natural": "water"}) == "water"
    assert classify_area({"landuse": "reservoir"}) == "water"
    assert classify_area({"leisure": "park"}) == "park"
    assert classify_area({"landuse": "grass"}) == "park"
    assert classify_area({"building": "yes"}) is None


def test_roads_keep_only_context_classes():
    assert classify_road({"highway": "motorway"}) == "expressway"
    assert classify_road({"highway": "primary"}) == "primary"
    assert classify_road({"highway": "secondary"}) == "secondary"
    assert classify_road({"highway": "tertiary"}) == "tertiary"
    assert classify_road({"highway": "residential"}) is None
    assert classify_road({"highway": "footway"}) is None


def test_minimal_labels_prefer_chinese_names():
    assert choose_label({"name:zh": "深南大道", "name": "Shennan Boulevard"}) == "深南大道"
    assert choose_label({"name": "Futian"}) == "Futian"
    assert choose_label({}) == ""
    assert classify_place({"railway": "station", "station": "subway"}) is None
    assert classify_place({"railway": "subway_entrance"}) is None
    assert classify_place({"place": "neighbourhood"}) == "neighbourhood"
    assert classify_place({"amenity": "cafe"}) is None


def test_fixed_visual_and_scale_contract_is_immutable():
    assert isinstance(STYLE_POLICY, MappingProxyType)
    assert isinstance(SCALE_POLICY, MappingProxyType)
    assert STYLE_POLICY["background"] == "#071522"
    assert STYLE_POLICY["land"] == "#0D2438"
    assert STYLE_POLICY["label"] == "#B8CAD6"
    assert SCALE_POLICY["package_min"] == 288895.277144
    assert SCALE_POLICY["package_max"] == 2256.994353
    with pytest.raises(TypeError):
        STYLE_POLICY["background"] = "#ffffff"
