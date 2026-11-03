from __future__ import annotations

import os
import secrets
import shutil
import subprocess
import sys
from pathlib import Path

from dotenv import dotenv_values


ROOT = Path(__file__).resolve().parent
DIST_ROOT = ROOT / "dist"
WORK_ROOT = ROOT / "build" / "portable_demo"
PACKAGE_NAME = "BlindNavigationDemo"
PACKAGE_DIR = DIST_ROOT / PACKAGE_NAME
ZIP_BASE = DIST_ROOT / "盲行无障碍导航_演示包"

PACKAGED_HTML_FILES = (
    "登录.html",
    "Web管理端.html",
    "移动端登录.html",
    "移动端.html",
)
PACKAGED_ROOT_FILES = PACKAGED_HTML_FILES + (
    "road-visuals.js",
    "water-visuals.js",
    "web.js",
    "mobile.js",
)


def require(path: Path) -> Path:
    if not path.exists():
        raise FileNotFoundError(f"Required packaging resource is missing: {path}")
    return path


def add_data(source: Path, destination: str) -> str:
    require(source)
    return f"{source}{os.pathsep}{destination}"


def safe_remove(path: Path) -> None:
    resolved = path.resolve()
    allowed_parents = {DIST_ROOT.resolve(), WORK_ROOT.parent.resolve()}
    if resolved.parent not in allowed_parents:
        raise RuntimeError(f"Refusing to remove path outside build output: {resolved}")
    if resolved.is_dir():
        shutil.rmtree(resolved)
    elif resolved.exists():
        resolved.unlink()


def write_demo_env(destination: Path) -> None:
    source = dotenv_values(ROOT / "backend" / ".env")
    allowed = [
        "GEOSCENE_PORTAL_URL",
        "GEOSCENE_SERVER_URL",
        "GEOSCENE_WEBSCENE_ID",
        "GEOSCENE_BUILDING_LAYER_URL",
        "GEOSCENE_EVENT_LAYER_URL",
        "GEOSCENE_BASEMAP_VECTOR_TILE_URL",
        "GEOSCENE_SHOWCASE_WATER_FEATURESERVER_URL",
        "GEOSCENE_ROUTE_MAPSERVER_URL",
        "GEOSCENE_ROUTE_NASERVER_URL",
        "GEOSCENE_ROAD_VISUAL_MAPSERVER_URL",
        "GEOSCENE_ROAD_VISUAL_LAYER_ID",
        "GEOSCENE_ROAD_LAYER_ID",
        "GEOSCENE_ROUTE_LAYER_NAME",
        "GEOSCENE_ROUTE_IMPEDANCE",
        "GEOSCENE_VERIFY_SSL",
        "CITY_NAME",
        "DISTRICT_NAME",
        "MAP_CENTER_LON",
        "MAP_CENTER_LAT",
        "TIANDITU_KEY",
        "AMAP_KEY",
        "AMAP_JS_KEY",
        "AMAP_JS_SECURITY_CODE",
    ]
    values = {key: str(source.get(key) or "").replace("\n", "").replace("\r", "") for key in allowed}
    portal_url = values.get("GEOSCENE_PORTAL_URL", "").rstrip("/")
    values.update(
        {
            "GEOSCENE_ROAD_LAYER_ID": values.get("GEOSCENE_ROAD_LAYER_ID") or "6",
            "GEOSCENE_ROAD_VISUAL_LAYER_ID": values.get("GEOSCENE_ROAD_VISUAL_LAYER_ID") or "0",
            "GEOSCENE_ROUTE_LAYER_NAME": values.get("GEOSCENE_ROUTE_LAYER_NAME") or "路径",
            "GEOSCENE_ROUTE_IMPEDANCE": values.get("GEOSCENE_ROUTE_IMPEDANCE") or "SafeMinutes",
            "GEOSCENE_VERIFY_SSL": values.get("GEOSCENE_VERIFY_SSL") or "false",
            "CITY_NAME": values.get("CITY_NAME") or "深圳",
            "DISTRICT_NAME": values.get("DISTRICT_NAME") or "福田区",
            "MAP_CENTER_LON": values.get("MAP_CENTER_LON") or "114.055",
            "MAP_CENTER_LAT": values.get("MAP_CENTER_LAT") or "22.535",
        }
    )
    values.update(
        {
            "DATABASE_URL": "sqlite:///./data/demo.db",
            "BACKEND_PUBLIC_URL": "http://127.0.0.1:8000",
            "GEOSCENE_PORTAL_WEBAPPS_URL": portal_url + "/webapps" if portal_url else "",
            "FUTIAN_BUILDINGS_GEOJSON": "shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson",
            "FUTIAN_BUILDINGS_ROUTE": "/data/buildings",
            "WUHAN_3DTILES_DIR": "",
            "WUHAN_3DTILES_ROUTE": "/tiles/wuhan",
            "JWT_SECRET": secrets.token_urlsafe(48),
            "JWT_EXPIRE_MINUTES": "10080",
            "UPLOAD_DIR": "data/uploads",
            "CORS_ORIGINS": "http://127.0.0.1:8000,http://localhost:8000,null",
        }
    )
    order = [
        "DATABASE_URL", "BACKEND_PUBLIC_URL", "UPLOAD_DIR", "CORS_ORIGINS",
        "GEOSCENE_PORTAL_URL", "GEOSCENE_PORTAL_WEBAPPS_URL", "GEOSCENE_SERVER_URL",
        "GEOSCENE_WEBSCENE_ID", "GEOSCENE_BUILDING_LAYER_URL", "GEOSCENE_EVENT_LAYER_URL",
        "GEOSCENE_BASEMAP_VECTOR_TILE_URL", "GEOSCENE_SHOWCASE_WATER_FEATURESERVER_URL",
        "GEOSCENE_ROUTE_MAPSERVER_URL", "GEOSCENE_ROUTE_NASERVER_URL",
        "GEOSCENE_ROAD_VISUAL_MAPSERVER_URL", "GEOSCENE_ROAD_VISUAL_LAYER_ID", "GEOSCENE_ROAD_LAYER_ID",
        "GEOSCENE_ROUTE_LAYER_NAME", "GEOSCENE_ROUTE_IMPEDANCE", "GEOSCENE_VERIFY_SSL",
        "FUTIAN_BUILDINGS_GEOJSON", "FUTIAN_BUILDINGS_ROUTE", "WUHAN_3DTILES_DIR", "WUHAN_3DTILES_ROUTE",
        "CITY_NAME", "DISTRICT_NAME", "MAP_CENTER_LON", "MAP_CENTER_LAT",
        "TIANDITU_KEY", "AMAP_KEY", "AMAP_JS_KEY", "AMAP_JS_SECURITY_CODE",
        "JWT_SECRET", "JWT_EXPIRE_MINUTES",
    ]
    destination.write_text("\n".join(f"{key}={values.get(key, '')}" for key in order) + "\n", encoding="utf-8")


def write_helper_files(package_dir: Path) -> None:
    files = {
        "启动演示.bat": """@echo off
setlocal
chcp 65001 >nul
title Blind Navigation Demo
cd /d "%~dp0"
BlindNavigationDemo.exe
set RESULT=%ERRORLEVEL%
if not "%RESULT%"=="0" (
  echo.
  echo Demo startup failed. Please run the environment check.
  pause
)
exit /b %RESULT%
""",
        "停止演示.bat": """@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
if not exist "data\\blind_navigation.pid" (
  echo The demo service is not running.
  pause
  exit /b 0
)
set /p DEMO_PID=<"data\\blind_navigation.pid"
taskkill /PID !DEMO_PID! /T /F >nul 2>nul
if errorlevel 1 (
  echo The recorded demo process is no longer running.
) else (
  echo The demo service has stopped.
)
del /f /q "data\\blind_navigation.pid" >nul 2>nul
pause
endlocal
""",
        "重置演示数据.bat": """@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
if exist "data\\blind_navigation.pid" (
  set /p DEMO_PID=<"data\\blind_navigation.pid"
  tasklist /FI "PID eq !DEMO_PID!" 2>nul | find "!DEMO_PID!" >nul
  if not errorlevel 1 (
    echo Please run Stop Demo before resetting data.
    pause
    exit /b 1
  )
)
if exist "data\\demo.db" del /f /q "data\\demo.db"
if exist "data\\uploads" rmdir /s /q "data\\uploads"
echo Demo data has been reset. It will be recreated at startup.
pause
endlocal
""",
        "演示环境自检.bat": """@echo off
setlocal
chcp 65001 >nul
title Blind Navigation Demo Check
cd /d "%~dp0"
BlindNavigationDemo.exe --check
set RESULT=%ERRORLEVEL%
echo.
if not "%RESULT%"=="0" echo One or more required checks need attention.
pause
exit /b %RESULT%
""",
        "演示说明.txt": """无障碍出行助手比赛演示版

1. 解压整个文件夹，不要只复制 exe；建议放到 C:\\BlindNavigationDemo。
2. 演示前先双击“演示环境自检.bat”。
3. 双击“启动演示.bat”，浏览器会自动打开登录页。
4. 默认账号：admin  密码：123456
5. 启动成功后会自动打开 Web 管理端登录页和移动端登录页两个浏览器标签页。
6. 演示期间不要关闭服务窗口；结束后运行“停止演示.bat”。
7. 若要恢复初始事件、设置和收藏路线，先停止服务，再运行“重置演示数据.bat”。

目标电脑不需要安装 Python、PostgreSQL、ArcGIS Pro、CityEngine 或 GeoScene。
需要 Windows 10/11 x64、Edge/Chrome 和可用网络；建议准备手机热点备用。
GeoScene 远程白模不可用时，系统会回退到包内的 8,897 栋福田建筑数据。
GeoScene 底图、水域、道路和无障碍路网仍需要目标电脑能访问 https://ichangli.gisonline.cn/server。
""",
    }
    for name, content in files.items():
        (package_dir / name).write_text(content, encoding="utf-8-sig", newline="\r\n")


def build() -> Path:
    require(ROOT / "demo_launcher.py")
    require(ROOT / "shenzhen_data" / "processed" / "buildings" / "futian_buildings_cityengine.geojson")
    if PACKAGE_DIR.exists():
        safe_remove(PACKAGE_DIR)
    if WORK_ROOT.exists():
        safe_remove(WORK_ROOT)
    DIST_ROOT.mkdir(parents=True, exist_ok=True)
    WORK_ROOT.parent.mkdir(parents=True, exist_ok=True)

    data_args = [
        *(add_data(ROOT / name, ".") for name in PACKAGED_ROOT_FILES),
        add_data(ROOT / "styles", "styles"),
        add_data(ROOT / "data" / "web-config.json", "data"),
        add_data(ROOT / "data" / "web-mock-api.json", "data"),
        add_data(ROOT / "data" / "mobile-config.json", "data"),
        add_data(ROOT / "data" / "mobile-mock-api.json", "data"),
        add_data(ROOT / "shenzhen_data" / "processed" / "buildings" / "futian_buildings_cityengine.geojson", "shenzhen_data/processed/buildings"),
        add_data(ROOT / "shenzhen_data" / "processed" / "support", "shenzhen_data/processed/support"),
        add_data(ROOT / "shenzhen_data" / "processed" / "futian_boundary.geojson", "shenzhen_data/processed"),
    ]

    command = [
        sys.executable, "-m", "PyInstaller",
        str(ROOT / "demo_launcher.py"),
        "--name", PACKAGE_NAME,
        "--onedir", "--console", "--clean", "--noconfirm",
        "--distpath", str(DIST_ROOT),
        "--workpath", str(WORK_ROOT),
        "--specpath", str(WORK_ROOT),
        "--paths", str(ROOT),
        "--collect-submodules", "uvicorn",
        "--collect-submodules", "passlib",
        "--hidden-import", "sqlalchemy.dialects.sqlite",
        "--exclude-module", "psycopg2",
    ]
    for item in data_args:
        command.extend(["--add-data", item])
    subprocess.run(command, cwd=ROOT, check=True)

    write_demo_env(PACKAGE_DIR / "demo.env")
    (PACKAGE_DIR / "data").mkdir(exist_ok=True)
    write_helper_files(PACKAGE_DIR)

    zip_path = ZIP_BASE.with_suffix(".zip")
    if zip_path.exists():
        safe_remove(zip_path)
    shutil.make_archive(str(ZIP_BASE), "zip", root_dir=DIST_ROOT, base_dir=PACKAGE_NAME)
    return zip_path


if __name__ == "__main__":
    result = build()
    print(f"Portable demo package created: {result}")
