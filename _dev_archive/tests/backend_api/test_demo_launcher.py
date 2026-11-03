import unittest
from unittest.mock import patch

import demo_launcher


class DemoLauncherBrowserTests(unittest.TestCase):
    @patch("demo_launcher.webbrowser.open")
    @patch("demo_launcher.local_backend_is_ours", return_value=True)
    def test_wait_and_open_browser_opens_web_and_mobile_logins(
        self,
        _backend_is_ours,
        browser_open,
    ) -> None:
        demo_launcher.wait_and_open_browser()

        self.assertEqual(
            browser_open.call_args_list,
            [
                unittest.mock.call(
                    f"{demo_launcher.BASE_URL}/登录.html",
                    new=2,
                ),
                unittest.mock.call(
                    f"{demo_launcher.BASE_URL}/移动端登录.html",
                    new=2,
                ),
            ],
        )

    @patch("demo_launcher.webbrowser.open")
    @patch("demo_launcher.local_backend_is_ours", return_value=True)
    @patch("demo_launcher.port_is_open", return_value=True)
    def test_existing_server_opens_web_and_mobile_logins(
        self,
        _port_is_open,
        _backend_is_ours,
        browser_open,
    ) -> None:
        result = demo_launcher.run_server()

        self.assertEqual(result, 0)
        self.assertEqual(
            browser_open.call_args_list,
            [
                unittest.mock.call(
                    f"{demo_launcher.BASE_URL}/登录.html",
                    new=2,
                ),
                unittest.mock.call(
                    f"{demo_launcher.BASE_URL}/移动端登录.html",
                    new=2,
                ),
            ],
        )


if __name__ == "__main__":
    unittest.main()
