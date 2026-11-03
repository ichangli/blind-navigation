@echo off
setlocal
chcp 65001 >nul
title Build Blind Navigation Demo Package
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Please run run_demo.bat once before building the package.
  pause
  exit /b 1
)

echo [1/2] Checking PyInstaller...
".venv\Scripts\python.exe" -c "import PyInstaller" >nul 2>nul
if errorlevel 1 (
  echo Installing PyInstaller...
  ".venv\Scripts\python.exe" -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyinstaller
  if errorlevel 1 goto :error
)

echo [2/2] Building portable package...
".venv\Scripts\python.exe" "build_demo_package.py"
if errorlevel 1 goto :error
echo.
echo Build completed. See dist\盲行无障碍导航_演示包.zip
pause
exit /b 0

:error
echo.
echo Package build failed. Read the message above.
pause
exit /b 1
