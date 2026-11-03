"""Backend package bootstrap."""

# Python 3.13 queries Windows WMI while resolving platform.machine(). On some
# Windows installations that query never returns, which blocks SQLAlchemy and
# therefore prevents Uvicorn from starting. The standard library already has a
# registry-based fallback, so disable only the hanging WMI branch.
import platform
import sys


if sys.platform == "win32" and hasattr(platform, "_wmi"):
    platform._wmi = None
