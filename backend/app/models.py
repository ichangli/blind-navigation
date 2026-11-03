from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base
from .time_utils import utc_now_naive


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive, nullable=False)

    events: Mapped[list["Event"]] = relationship(back_populates="reporter")
    favorite_routes: Mapped[list["FavoriteRoute"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    settings: Mapped["UserSetting | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    district: Mapped[str] = mapped_column(String(80), default="福田区", nullable=False)
    address: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    landmark: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    photo_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="待审核", nullable=False)
    priority: Mapped[str] = mapped_column(String(10), default="中", nullable=False)
    reporter_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    reporter_name: Mapped[str] = mapped_column(String(80), default="", nullable=False)
    reporter_type: Mapped[str] = mapped_column(String(40), default="普通用户", nullable=False)
    report_method: Mapped[str] = mapped_column(String(80), default="语音一键上报 (M-11)", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utc_now_naive, onupdate=utc_now_naive, nullable=False
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    reporter: Mapped[User | None] = relationship(back_populates="events")


class FavoriteRoute(Base):
    __tablename__ = "favorite_routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    icon: Mapped[str] = mapped_column(String(20), default="⭐", nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    detail: Mapped[str] = mapped_column(Text, default="", nullable=False)
    destination: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive, nullable=False)

    user: Mapped[User] = relationship(back_populates="favorite_routes")


class UserSetting(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    speed: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    volume: Mapped[int] = mapped_column(Integer, default=80, nullable=False)
    vibration: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    voice_type: Mapped[str] = mapped_column(String(40), default="温柔女声", nullable=False)
    nav_blind_lane: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    nav_avoid_construction: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    nav_avoid_stairs: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    nav_auto_reroute: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ui_large_font: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ui_high_contrast: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ui_screen_reader: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ui_key_sound: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user: Mapped[User] = relationship(back_populates="settings")


class NavigationHistory(Base):
    __tablename__ = "navigation_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    origin: Mapped[str] = mapped_column(String(200), default="当前位置", nullable=False)
    destination: Mapped[str] = mapped_column(String(200), nullable=False)
    route_json: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive, nullable=False)
