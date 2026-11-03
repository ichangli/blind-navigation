"""Loopback-only static file server; no application API or database."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading
import webbrowser


class StaticHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".wasm": "application/wasm", ".geojson": "application/geo+json", ".js": "text/javascript"}

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description="Blind Navigation local static demonstration")
    parser.add_argument("--port", type=int, default=8877)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    base = Path(sys.executable).resolve().parent if getattr(sys, "frozen", False) else Path(__file__).resolve().parent
    site = base / "site"
    if not (site / "index.html").is_file():
        print("Missing site/index.html. Extract the entire ZIP before starting.", flush=True)
        return 1
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(StaticHandler, directory=str(site)))
    except OSError:
        print("Cannot start local server. Close an existing demo window or use --port 8878.", flush=True)
        return 1
    url = "http://127.0.0.1:%d/" % server.server_port
    print("Blind Navigation STATIC DEMO\n" + url + "\nKeep this window open. Press Ctrl+C or close it to stop.", flush=True)
    if not args.no_browser:
        timer = threading.Timer(0.5, webbrowser.open, args=(url,))
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
