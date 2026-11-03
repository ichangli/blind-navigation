from datetime import datetime
from types import SimpleNamespace

import pytest

from backend.app.routers.web import (
    _event_detail,
    _event_row,
    _event_web_coordinates,
    map_data,
)
from backend.app.services.geoscene_route import gcj02_to_wgs84


def _event(*, reporter_id, lon=114.055, lat=22.535):
    return SimpleNamespace(
        id="E-COORD",
        type="盲道被占",
        description="坐标测试",
        lon=lon,
        lat=lat,
        district="福田区",
        address="福华路",
        landmark="购物公园站",
        photo_url=None,
        status="待审核",
        priority="高",
        reporter_id=reporter_id,
        reporter_name="tester",
        reporter=None,
        reporter_type="普通用户",
        report_method="移动端表单上报",
        created_at=datetime(2026, 7, 19, 12, 0),
    )


class _Query:
    def __init__(self, events):
        self.events = events

    def order_by(self, *_args):
        return self

    def all(self):
        return self.events


class _Database:
    def __init__(self, events):
        self.events = events

    def query(self, *_args):
        return _Query(self.events)


def test_user_report_gcj02_is_converted_for_every_web_event_payload():
    event = _event(reporter_id=7)
    expected = gcj02_to_wgs84(event.lon, event.lat)

    assert _event_web_coordinates(event) == pytest.approx(expected)
    assert (_event_row(event, False)["lon"], _event_row(event, False)["lat"]) == pytest.approx(expected)
    assert (_event_detail(event)["lon"], _event_detail(event)["lat"]) == pytest.approx(expected)
    mapped = map_data(db=_Database([event]))["events"][0]
    assert (mapped["lon"], mapped["lat"]) == pytest.approx(expected)


def test_seed_event_wgs84_is_not_converted_again():
    event = _event(reporter_id=None, lon=114.0489, lat=22.5309)

    assert _event_web_coordinates(event) == (114.0489, 22.5309)
    row = _event_row(event, False)
    assert (row["lon"], row["lat"]) == (114.0489, 22.5309)


@pytest.mark.parametrize(
    ("status", "can_audit", "can_update"),
    [
        ("待审核", True, False),
        ("处理中", False, True),
        ("已修复", False, False),
        ("驳回", False, False),
    ],
)
def test_event_detail_exposes_state_aware_admin_permissions(status, can_audit, can_update):
    event = _event(reporter_id=None)
    event.status = status

    admin_detail = _event_detail(event, True)
    viewer_detail = _event_detail(event, False)

    assert admin_detail["canAudit"] is can_audit
    assert admin_detail["canUpdate"] is can_update
    assert viewer_detail["canAudit"] is False
    assert viewer_detail["canUpdate"] is False


def test_map_data_does_not_expose_static_heatmap_overlays():
    event = _event(reporter_id=None)

    result = map_data(db=_Database([event]))

    assert "heatmap" not in result
