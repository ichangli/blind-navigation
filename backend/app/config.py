import os
import sys
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


SOURCE_ROOT = Path(__file__).resolve().parents[2]
IS_FROZEN = bool(getattr(sys, "frozen", False))
APP_ROOT = Path(sys.executable).resolve().parent if IS_FROZEN else SOURCE_ROOT
RESOURCE_ROOT = Path(getattr(sys, "_MEIPASS", SOURCE_ROOT)).resolve()

# Keep the legacy name for modules that load bundled JSON fixtures.
PROJECT_ROOT = RESOURCE_ROOT
BACKEND_ROOT = SOURCE_ROOT / "backend"


def _settings_env_file() -> str:
    override = os.getenv("BLIND_NAV_ENV_FILE", "").strip()
    if override:
        return str(Path(override).expanduser().resolve())
    if IS_FROZEN:
        return str(APP_ROOT / "demo.env")
    return str(BACKEND_ROOT / ".env")


def resource_path(relative_path: str) -> Path:
    """Resolve a read-only project resource in source and packaged modes."""
    return RESOURCE_ROOT / Path(relative_path)


def writable_path(relative_path: str) -> Path:
    """Resolve data that must remain beside the portable executable."""
    return APP_ROOT / Path(relative_path)


class Settings(BaseSettings):
    database_url: str = f"sqlite:///{(APP_ROOT / 'data' / 'demo.db').as_posix()}"
    backend_public_url: str = "http://127.0.0.1:8000"
    geoscene_portal_url: str = "http://127.0.0.1:7443/portal"
    geoscene_portal_webapps_url: str = ""
    geoscene_portal_username: str = ""
    geoscene_portal_password: str = ""
    geoscene_server_url: str = "http://127.0.0.1:6443/arcgis"
    geoscene_server_manager_url: str = ""
    geoscene_server_username: str = ""
    geoscene_server_password: str = ""
    geoscene_webscene_id: str = ""
    geoscene_building_layer_url: str = ""
    geoscene_basemap_vector_tile_url: str = ""
    geoscene_showcase_water_featureserver_url: str = ""
    geoscene_event_layer_url: str = ""
    geoscene_route_mapserver_url: str = ""
    geoscene_route_naserver_url: str = ""
    geoscene_road_visual_mapserver_url: str = ""
    geoscene_road_visual_layer_id: int = 0
    geoscene_road_layer_id: int = 6
    geoscene_route_layer_name: str = "路径 2"
    geoscene_route_impedance: str = "SafeMinutes"
    geoscene_verify_ssl: bool = True
    city_name: str = "深圳"
    district_name: str = "福田区"
    map_center_lon: float = 114.055
    map_center_lat: float = 22.535
    futian_buildings_geojson: str = (
        "shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson"
    )
    futian_buildings_route: str = "/data/buildings"
    wuhan_3dtiles_dir: str = ""
    wuhan_3dtiles_route: str = "/tiles/wuhan"
    tianditu_key: str = ""
    amap_key: str = ""
    amap_js_key: str = ""
    amap_js_security_code: str = ""
    jwt_secret: str = "change-this-in-local-env"
    jwt_expire_minutes: int = 10080
    upload_dir: str = "backend/uploads"
    cors_origins: str = "http://127.0.0.1:5500,http://localhost:5500,null"

    model_config = SettingsConfigDict(
        env_file=_settings_env_file(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        if not path.is_absolute():
            path = APP_ROOT / path
        return path

    @property
    def frontend_path(self) -> Path:
        return RESOURCE_ROOT

    @property
    def wuhan_3dtiles_path(self) -> Path | None:
        if not self.wuhan_3dtiles_dir.strip():
            return None
        path = Path(self.wuhan_3dtiles_dir)
        if not path.is_absolute():
            path = RESOURCE_ROOT / path
        return path

    @property
    def wuhan_3dtiles_url(self) -> str:
        route = "/" + self.wuhan_3dtiles_route.strip("/")
        return self.backend_public_url.rstrip("/") + route + "/tileset.json"

    @property
    def futian_buildings_path(self) -> Path | None:
        if not self.futian_buildings_geojson.strip():
            return None
        path = Path(self.futian_buildings_geojson)
        if not path.is_absolute():
            path = RESOURCE_ROOT / path
        return path

    @property
    def futian_buildings_url(self) -> str:
        path = self.futian_buildings_path
        if path is None:
            return ""
        route = "/" + self.futian_buildings_route.strip("/")
        return self.backend_public_url.rstrip("/") + route + "/" + path.name


@lru_cache
def get_settings() -> Settings:
    return Settings()
