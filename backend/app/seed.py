from datetime import datetime

from sqlalchemy.orm import Session

from . import models
from .security import hash_password
from .services.mock_loader import load_mobile_config, load_mobile_mock, load_web_mock
from .time_utils import local_now


DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "123456"


def _parse_coords(coords: str) -> tuple[float, float]:
    try:
        lon_s, lat_s = coords.replace(" ", "").split(",", 1)
        return float(lon_s), float(lat_s)
    except Exception:
        return 114.0550, 22.5350


def _parse_mock_time(value: str) -> datetime:
    try:
        return datetime.strptime(f"2026-{value}", "%Y-%m-%d %H:%M")
    except Exception:
        return local_now().replace(tzinfo=None)


def _default_priority(event_type: str, status: str) -> str:
    if event_type in {"盲道被占", "盲道缺失"} and status in {"待审核", "处理中"}:
        return "高"
    if status == "驳回":
        return "低"
    return "中"


def ensure_admin(db: Session) -> models.User:
    admin = db.query(models.User).filter(models.User.username == DEFAULT_ADMIN_USERNAME).first()
    if admin:
        return admin
    admin = models.User(
        username=DEFAULT_ADMIN_USERNAME,
        password_hash=hash_password(DEFAULT_ADMIN_PASSWORD),
        role="admin",
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def _route_templates() -> list[dict]:
    mobile = load_mobile_mock()
    routes = (
        mobile.get("profile", {}).get("favoriteRoutes")
        or mobile.get("home", {}).get("favoriteRoutes")
        or []
    )
    return routes[:3]


def ensure_user_defaults(db: Session, user: models.User) -> None:
    if not db.get(models.UserSetting, user.id):
        defaults = load_mobile_config().get("profile", {}).get("settings", {}).get("defaults", {})
        toggles = defaults.get("toggles", {})
        db.add(
            models.UserSetting(
                user_id=user.id,
                speed=float(defaults.get("speed", 1.0)),
                volume=int(defaults.get("volume", 80)),
                vibration=int(defaults.get("vibration", 2)),
                voice_type=defaults.get("voiceType", "温柔女声"),
                nav_blind_lane=bool(toggles.get("nav_blind_lane", True)),
                nav_avoid_construction=bool(toggles.get("nav_avoid_construction", True)),
                nav_avoid_stairs=bool(toggles.get("nav_avoid_stairs", False)),
                nav_auto_reroute=bool(toggles.get("nav_auto_reroute", True)),
                ui_large_font=bool(toggles.get("ui_large_font", False)),
                ui_high_contrast=bool(toggles.get("ui_high_contrast", False)),
                ui_screen_reader=bool(toggles.get("ui_screen_reader", True)),
                ui_key_sound=bool(toggles.get("ui_key_sound", True)),
            )
        )

    has_routes = (
        db.query(models.FavoriteRoute)
        .filter(models.FavoriteRoute.user_id == user.id)
        .first()
        is not None
    )
    if not has_routes:
        for route in _route_templates():
            db.add(
                models.FavoriteRoute(
                    user_id=user.id,
                    icon=route.get("icon", "⭐"),
                    name=route.get("name", route.get("dest", "常用路线")),
                    detail=route.get("detail", ""),
                    destination=route.get("dest") or route.get("destination") or route.get("name", ""),
                )
            )
    db.commit()


def seed_events(db: Session) -> None:
    web = load_web_mock()
    detail = web.get("eventDetail", {})
    for item in web.get("events", []):
        existing = db.get(models.Event, item["id"])
        if existing:
            continue
        lon, lat = _parse_coords(item.get("coords", "114.0550,22.5350"))
        is_detail = item["id"] == detail.get("id")
        created_at = _parse_mock_time(item.get("time", "07-01 09:32"))
        db.add(
            models.Event(
                id=item["id"],
                type=item.get("type", "盲道被占"),
                description=detail.get("description", "").strip('"') if is_detail else item.get("type", ""),
                lon=lon,
                lat=lat,
                district=detail.get("district", item.get("district", "福田区")) if is_detail else item.get("district", "福田区"),
                address=detail.get("address", "") if is_detail else "",
                landmark=detail.get("landmark", item.get("district", "")) if is_detail else item.get("district", ""),
                status=item.get("status", "待审核"),
                priority=detail.get("priority", _default_priority(item.get("type", ""), item.get("status", ""))) if is_detail else _default_priority(item.get("type", ""), item.get("status", "")),
                reporter_name=item.get("reporter", ""),
                reporter_type=detail.get("reporterType", "普通用户") if is_detail else "普通用户",
                report_method=detail.get("reportMethod", "语音一键上报 (M-11)") if is_detail else "语音一键上报 (M-11)",
                created_at=created_at,
                updated_at=created_at,
            )
        )
    db.commit()


def seed_all(db: Session) -> None:
    admin = ensure_admin(db)
    ensure_user_defaults(db, admin)
    seed_events(db)
