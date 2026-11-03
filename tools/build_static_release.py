"""Build a clean Windows static demo ZIP using the Pages artifact and PyInstaller."""
import argparse
import hashlib
from importlib.metadata import distribution
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(version, output):
    output.mkdir(parents=True, exist_ok=True)
    name = "BlindNavigation-StaticDemo-" + version
    package = output / name
    archive = output / (name + "-windows-x64.zip")
    if package.exists() or archive.exists():
        raise FileExistsError("Choose a new output directory; existing packages are not overwritten")
    subprocess.run([sys.executable, str(ROOT / "tools/build_pages.py")], cwd=ROOT, check=True)
    package.mkdir()
    shutil.copytree(ROOT / "site-demo", package / "site")
    shutil.copy2(ROOT / "LICENSE", package / "LICENSE")
    runtime_licenses = package / "runtime-licenses"
    runtime_licenses.mkdir()
    shutil.copy2(Path(sys.base_prefix) / "LICENSE.txt", runtime_licenses / "Python-LICENSE.txt")
    pyinstaller = distribution("pyinstaller")
    for item in pyinstaller.files:
        if str(item).endswith("licenses/COPYING.txt"):
            shutil.copy2(pyinstaller.locate_file(item), runtime_licenses / "PyInstaller-COPYING.txt")
            break
    else:
        raise FileNotFoundError("PyInstaller license missing")
    notes = (ROOT / "docs/数据与依赖.md").read_text(encoding="utf-8").replace("../LICENSE", "LICENSE")
    (package / "数据与依赖.md").write_text(notes, encoding="utf-8")
    shutil.copy2(ROOT / "tools/static_demo_server.py", package / "start_static_demo.py")
    with tempfile.TemporaryDirectory(prefix="blind-static-build-") as temporary:
        work = Path(temporary)
        subprocess.run([sys.executable, "-m", "PyInstaller", "--noconfirm", "--clean", "--onefile", "--console", "--name", "BlindNavigationStaticDemo", "--distpath", str(work / "dist"), "--workpath", str(work / "build"), "--specpath", str(work), str(ROOT / "tools/static_demo_server.py")], cwd=ROOT, check=True)
        shutil.copy2(work / "dist/BlindNavigationStaticDemo.exe", package / "BlindNavigationStaticDemo.exe")
    (package / "启动演示.bat").write_text('@echo off\r\ncd /d "%~dp0"\r\n"BlindNavigationStaticDemo.exe"\r\nif errorlevel 1 pause\r\n', encoding="ascii")
    (package / "使用说明.txt").write_text("""盲行 · 静态演示版

运行环境：Windows 10/11 x64 与 Chrome/Edge。无需安装 Python、GeoScene、PostgreSQL 或业务后端。
1. 完整解压 ZIP，保留 site 目录，不要只复制 EXE，也不要在压缩软件内运行。
2. 双击“启动演示.bat”。浏览器将打开 http://127.0.0.1:8877/ 。
3. 选择 Web 三维管理端或移动端。无需登录；移动端是在本机浏览器中体验的手机界面。
4. 使用期间保持命令窗口打开；结束时关闭命令窗口或按 Ctrl+C。
5. 8877 端口被占用时，先关闭旧演示，或在终端执行 BlindNavigationStaticDemo.exe --port 8878。

该 EXE 仅提供本机静态 HTTP 文件服务，绑定 127.0.0.1，不运行 Python 业务 API，不连接 GeoScene 或外部数据库。页面资源与地图数据随包提供，演示可断网运行。源码和许可的外部链接仅在主动点击时需要联网。
三维地图需要 WebGL；不支持时提供本地二维回退。不要直接双击 HTML，Worker 与 JSON 需要 HTTP 服务。
上报、审核、照片、设置与收藏只保存在当前浏览器 IndexedDB/localStorage，同浏览器页面可共享，不跨设备共享。点击顶部“重置演示”可恢复样例数据。更换端口或浏览器会得到独立存储。
路线仅为三个固定离线案例，不支持任意起终点的实时规划。公交到站、天气和环境感知包含模拟内容；路线未经过现场通行验证。

原创代码及作者原创文档采用 MIT（见 LICENSE）。地图数据与第三方库保留原许可及署名要求，见“数据与依赖.md”和 site/vendor 中的声明。GeoScene 服务接入与 GIS 再制作说明属于源码库的完整程序，并非本包依赖。
可选：已安装 Python 3.10+ 的电脑也可运行 python start_static_demo.py；不需要安装其他 Python 包。
""", encoding="utf-8-sig")
    revision = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    entries = []
    for path in sorted(package.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() in {".db", ".sqlite", ".sqlite3", ".env", ".pid", ".pyc"} or path.name.startswith(".env"):
            raise ValueError("Runtime/private file in package: " + str(path.relative_to(package)))
        entries.append({"path": path.relative_to(package).as_posix(), "size": path.stat().st_size, "sha256": digest(path)})
    (package / "MANIFEST.json").write_text(json.dumps({"version": version, "sourceCommit": revision, "files": entries}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as handle:
        for path in sorted(package.rglob("*")):
            if path.is_file():
                handle.write(path, path.relative_to(output))
    with zipfile.ZipFile(archive) as handle:
        if handle.testzip() is not None:
            raise ValueError("Corrupt ZIP")
    checksum = archive.with_suffix(archive.suffix + ".sha256")
    checksum.write_text(digest(archive) + "  " + archive.name + "\n", encoding="ascii")
    print(json.dumps({"archive": str(archive), "MiB": round(archive.stat().st_size / 1048576, 2), "sha256": digest(archive), "sourceCommit": revision}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="v1.0.0")
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    build(arguments.version, arguments.output.resolve())
