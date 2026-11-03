import mimetypes

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from .app import models  # noqa: F401
from .app.config import get_settings
from .app.database import Base, SessionLocal, engine
from .app.routers import auth, mobile, web
from .app.seed import seed_all, ensure_admin


settings = get_settings()
settings.upload_path.mkdir(parents=True, exist_ok=True)
mimetypes.add_type("application/geo+json", ".geojson")

app = FastAPI(
    title="无障碍出行助手后端",
    description="FastAPI 单体服务：注册登录、移动端上报、Web 无障碍治理端展示与审核。",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(settings.upload_path)), name="uploads")

buildings_path = settings.futian_buildings_path
if buildings_path and buildings_path.exists():
    app.mount(
        settings.futian_buildings_route,
        StaticFiles(directory=str(buildings_path.parent)),
        name="futian-buildings",
    )

tiles_path = settings.wuhan_3dtiles_path
if tiles_path and tiles_path.exists():
    app.mount(
        settings.wuhan_3dtiles_route,
        StaticFiles(directory=str(tiles_path)),
        name="wuhan-3dtiles",
    )

app.include_router(auth.router)
app.include_router(web.router)
app.include_router(mobile.router)


@app.on_event("startup")
def initialize_runtime_database() -> None:
    """Create and seed SQLite automatically; remains idempotent for PostgreSQL."""
    settings.validate_deployment()
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if settings.app_env == "demo":
            seed_all(db)
        else:
            ensure_admin(db)


@app.on_event("shutdown")
async def close_http_clients() -> None:
    await web.close_scene_proxy_client()


@app.get("/api/health")
def health() -> dict:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {
        "name": "无障碍出行助手后端",
        "docs": "/docs",
        "status": "ok",
        "database": engine.url.get_backend_name(),
        "buildings": bool(buildings_path and buildings_path.exists()),
    }


FRONTEND_FILES = {
    "登录.html",
    "Web管理端.html",
    "移动端登录.html",
    "移动端.html",
    "road-visuals.js",
    "water-visuals.js",
    "web.js",
    "mobile.js",
}
FRONTEND_DATA_FILES = {
    "web-config.json",
    "web-mock-api.json",
    "mobile-config.json",
    "mobile-mock-api.json",
}


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    return RedirectResponse(url="/登录.html")


@app.get("/data/{filename}", include_in_schema=False)
def frontend_data(filename: str) -> FileResponse:
    if filename not in FRONTEND_DATA_FILES:
        raise HTTPException(status_code=404, detail="Frontend data file not found")
    path = settings.frontend_path / "data" / filename
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Frontend data file not found")
    return FileResponse(path)


@app.get("/{filename}", include_in_schema=False)
def frontend_file(filename: str) -> FileResponse:
    if filename not in FRONTEND_FILES:
        raise HTTPException(status_code=404, detail="Frontend file not found")
    path = settings.frontend_path / filename
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Frontend file not found")
    return FileResponse(path)


styles_path = settings.frontend_path / "styles"
if styles_path.is_dir():
    app.mount("/styles", StaticFiles(directory=str(styles_path)), name="frontend-styles")
