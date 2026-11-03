from datetime import datetime
from types import SimpleNamespace

from backend.app.routers.mobile import report_history


class _EventQuery:
    def __init__(self, events):
        self.events = events

    def filter(self, *_args):
        return self

    def order_by(self, *_args):
        return self

    def all(self):
        return self.events


class _Database:
    def __init__(self, events):
        self.events = events

    def query(self, *_args):
        return _EventQuery(self.events)


def test_mobile_report_history_returns_uploaded_photo_url():
    event = SimpleNamespace(
        id="E20260719002",
        type="盲道被占",
        description="测试现场图片",
        landmark="购物公园",
        address="福华路",
        status="待审核",
        photo_url="/uploads/E20260719002.png",
        created_at=datetime(2026, 7, 19, 11, 17, 28),
    )

    result = report_history(
        user=SimpleNamespace(id=7),
        db=_Database([event]),
    )

    assert result[0]["photoUrl"] == "/uploads/E20260719002.png"

