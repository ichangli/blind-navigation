from __future__ import annotations

import argparse
import os
import socket
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path


HOST = "127.0.0.1"
PORT = 8000
BASE_URL = f"http://{HOST}:{PORT}"
IS_FROZEN = bool(getattr(sys, "frozen", False))
APP_ROOT = Path(sys.executable).resolve().parent if IS_FROZEN else Path(__file__).resolve().parent
DATA_DIR = APP_ROOT / "data"
PID_FILE = DATA_DIR / "blind_navigation.pid"


def configure_console() -> None:
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure:
            reconfigure(encoding="utf-8", errors="replace")


def configure_portable_environment() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    database_path = (DATA_DIR / "demo.db").resolve().as_posix()
    os.environ["APP_ENV"] = "demo"
    os.environ["DATABASE_URL"] = f"sqlite:///{database_path}"
    os.environ["BACKEND_PUBLIC_URL"] = BASE_URL
    os.environ["UPLOAD_DIR"] = "data/uploads"
    os.environ["CORS_ORIGINS"] = f"{BASE_URL},http://localhost:{PORT}"


def port_is_open() -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.4)
        return sock.connect_ex((HOST, PORT)) == 0


def local_backend_is_ours() -> bool:
    try:
        with urllib.request.urlopen(f"{BASE_URL}/api/health", timeout=2) as response:
            return response.status == 200 and "无障碍出行助手" in response.read().decode("utf-8")
    except Exception:
        return False


def open_demo_pages() -> None:
    webbrowser.open(f"{BASE_URL}/登录.html", new=2)
    webbrowser.open(f"{BASE_URL}/移动端登录.html", new=2)


def wait_and_open_browser() -> None:
    for _ in range(40):
        if local_backend_is_ours():
            open_demo_pages()
            return
        time.sleep(0.25)


def check_url(name: str, url: str, *, verify_ssl: bool = True, binary: bool = False) -> tuple[bool, str]:
    if not url:
        return False, f"{name}：未配置"
    try:
        import httpx

        with httpx.Client(verify=verify_ssl, timeout=12, follow_redirects=True) as client:
            response = client.get(url)
        size = len(response.content)
        ok = response.status_code == 200 and (size > 0 if binary else True)
        return ok, f"{name}：HTTP {response.status_code}，{size} 字节"
    except Exception as exc:
        return False, f"{name}：{type(exc).__name__}"


def run_preflight() -> int:
    from backend.app.config import get_settings

    settings = get_settings()
    checks: list[tuple[bool, str]] = []

    try:
        from backend.init_db import main as initialize_database

        initialize_database()
        checks.append((True, "SQLite 演示数据库：正常"))
    except Exception as exc:
        checks.append((False, f"SQLite 演示数据库：{type(exc).__name__}"))

    buildings = settings.futian_buildings_path
    building_ok = bool(buildings and buildings.is_file() and buildings.stat().st_size > 1_000_000)
    checks.append((building_ok, "本地 8,897 栋建筑兜底：" + ("正常" if building_ok else "缺失")))

    verify = settings.geoscene_verify_ssl
    scene_url = settings.geoscene_building_layer_url.rstrip("/")
    route_url = settings.geoscene_route_naserver_url.rstrip("/")
    checks.append(check_url("GeoScene 白模元数据", scene_url + "?f=json" if scene_url else "", verify_ssl=verify))
    checks.append(check_url("GeoScene 白模节点", scene_url + "/layers/0/nodepages/0" if scene_url else "", verify_ssl=verify, binary=True))
    checks.append(check_url("GeoScene 无障碍路网", route_url + "?f=json" if route_url else "", verify_ssl=verify))
    checks.append(check_url("ArcGIS JavaScript SDK", "https://js.arcgis.com/4.30/"))
    checks.append(check_url("高德地图网络", "https://restapi.amap.com/"))

    print("\n========== 演示环境自检 ==========")
    for ok, message in checks:
        print(("[正常] " if ok else "[警告] ") + message)
    print("==================================")
    print("说明：远程白模异常时会自动使用本地 8,897 栋建筑；路网和高德网络应保持可用。")
    required_ok = checks[0][0] and checks[1][0] and checks[4][0] and checks[5][0]
    return 0 if required_ok else 1


def run_server(no_browser: bool = False) -> int:
    if port_is_open():
        if local_backend_is_ours():
            print(f"演示服务已经运行：{BASE_URL}")
            if not no_browser:
                open_demo_pages()
            return 0
        print(f"端口 {PORT} 已被其他程序占用，请关闭占用程序后重试。")
        return 2

    from backend.main import app
    import uvicorn

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PID_FILE.write_text(str(os.getpid()), encoding="ascii")
    if not no_browser:
        threading.Thread(target=wait_and_open_browser, daemon=True).start()

    print("\n无障碍出行助手演示服务正在启动……")
    print(f"登录页：{BASE_URL}/登录.html")
    print(f"移动端：{BASE_URL}/移动端登录.html")
    print("默认演示账号：admin / 123456")
    print("演示期间请保持本窗口打开。\n")
    try:
        uvicorn.run(app, host=HOST, port=PORT, log_level="info")
    finally:
        try:
            PID_FILE.unlink(missing_ok=True)
        except OSError:
            pass
    return 0


def main() -> int:
    configure_console()
    configure_portable_environment()
    parser = argparse.ArgumentParser(description="无障碍出行助手便携演示启动器")
    parser.add_argument("--check", action="store_true", help="只执行演示环境自检")
    parser.add_argument("--no-browser", action="store_true", help="启动后不自动打开浏览器")
    args = parser.parse_args()
    return run_preflight() if args.check else run_server(args.no_browser)


if __name__ == "__main__":
    raise SystemExit(main())
