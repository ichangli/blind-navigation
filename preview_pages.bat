@echo off
cd /d "%~dp0"
python tools\build_pages.py
if errorlevel 1 (
  pause
  exit /b 1
)
start "" http://127.0.0.1:8777
python -m http.server 8777 --directory site-demo

