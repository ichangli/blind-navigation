from pydantic import BaseModel, Field


class AuthRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    token: str
    username: str
    role: str


class StatusUpdateRequest(BaseModel):
    status: str


class NavigationPlanRequest(BaseModel):
    origin: str = "当前位置"
    destination: str
    lon: float = 114.0550
    lat: float = 22.5350
    origin_lon: float | None = None
    origin_lat: float | None = None
    destination_lon: float | None = None
    destination_lat: float | None = None


class WebNavigationPoint(BaseModel):
    lon: float = Field(ge=-180, le=180)
    lat: float = Field(ge=-90, le=90)


class WebNavigationSolveRequest(BaseModel):
    origin: WebNavigationPoint
    destination: WebNavigationPoint


class RerouteRequest(BaseModel):
    destination: str
    lon: float = 114.0550
    lat: float = 22.5350
    reason: str = "前方盲道被占"
    destination_lon: float | None = None
    destination_lat: float | None = None


class RecognizeRequest(BaseModel):
    text: str = Field(min_length=1)
    lon: float | None = None
    lat: float | None = None


class FavoriteRouteCreate(BaseModel):
    name: str
    detail: str = ""
    destination: str
    icon: str = "⭐"


class UserSettingsUpdate(BaseModel):
    speed: float | None = None
    volume: int | None = None
    vibration: int | None = None
    voiceType: str | None = None
    voice_type: str | None = None
    toggles: dict[str, bool] | None = None
    nav_blind_lane: bool | None = None
    nav_avoid_construction: bool | None = None
    nav_avoid_stairs: bool | None = None
    nav_auto_reroute: bool | None = None
    ui_large_font: bool | None = None
    ui_high_contrast: bool | None = None
    ui_screen_reader: bool | None = None
    ui_key_sound: bool | None = None
