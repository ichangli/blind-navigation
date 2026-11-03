@echo off
setlocal
chcp 65001 >nul
title Blind Navigation Portable Demo
cd /d "%~dp0"

echo [1/2] Checking Python environment...
if not exist ".venv\Scripts\python.exe" (
  echo Creating virtual environment. This is only needed the first time.
  python -m venv .venv
  if errorlevel 1 goto :error
)

if not exist ".venv\Lib\site-packages\fastapi" (
  echo Installing dependencies. This may take several minutes...
  ".venv\Scripts\python.exe" -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r "backend\requirements.txt"
  if errorlevel 1 goto :error
)

echo [2/2] Starting portable demo at http://127.0.0.1:8000
echo This mode uses data\demo.db and does not modify PostgreSQL.
echo.
".venv\Scripts\python.exe" "demo_launcher.py"
if errorlevel 1 goto :error
goto :end

:error
echo.
echo Demo startup failed. Read the message above.
pause
exit /b 1

:end
endlocal
