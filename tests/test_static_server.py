import importlib.util
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import unittest
from urllib.request import urlopen, Request
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location("static_demo_server", Path(__file__).resolve().parents[1] / "tools/static_demo_server.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class StaticServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.temp.name)
        cls.site = cls.root / "site"
        cls.site.mkdir()
        (cls.site / "index.html").write_text("static demo", encoding="utf-8")
        (cls.site / "test.wasm").write_bytes(b"wasm")
        (cls.site / "folder").mkdir()
        (cls.root / "private.env").write_text("private", encoding="utf-8")
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), partial(module.StaticHandler, directory=str(cls.site)))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = "http://127.0.0.1:%d" % cls.server.server_port

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def test_static_files_and_worker_mime(self):
        with urlopen(self.url + "/") as response:
            self.assertEqual(response.read(), b"static demo")
            self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        with urlopen(self.url + "/test.wasm") as response:
            self.assertEqual(response.headers.get_content_type(), "application/wasm")
        with urlopen(Request(self.url + "/", method="HEAD")) as response:
            self.assertEqual(response.read(), b"")

    def test_no_directory_listing_or_parent_access(self):
        for path in ["/folder/", "/../private.env", "/%2e%2e/private.env"]:
            with self.assertRaises(HTTPError) as failure:
                urlopen(self.url + path)
            self.assertEqual(failure.exception.code, 404)

    def test_no_business_api_or_post(self):
        with self.assertRaises(HTTPError) as failure:
            urlopen(Request(self.url + "/api/mobile/report", data=b"{}"))
        self.assertEqual(failure.exception.code, 501)
        self.assertFalse((self.site / "api").exists())

if __name__ == "__main__":
    unittest.main()
