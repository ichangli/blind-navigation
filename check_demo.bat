@echo off
setlocal
chcp 65001 >nul
title Blind Navigation Demo Check
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Please run run_demo.bat once before checking the source project.
  pause
  exit /b 1
)

".venv\Scripts\python.exe" "demo_launcher.py" --check
set RESULT=%ERRORLEVEL%
echo.
if not "%RESULT%"=="0" echo One or more required checks need attention.
pause
exit /b %RESULT%
