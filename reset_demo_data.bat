@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title Reset Blind Navigation Demo Data
cd /d "%~dp0"

if exist "data\blind_navigation.pid" (
  set /p DEMO_PID=<"data\blind_navigation.pid"
  tasklist /FI "PID eq !DEMO_PID!" 2>nul | find "!DEMO_PID!" >nul
  if not errorlevel 1 (
    echo Please stop the demo service before resetting data.
    pause
    exit /b 1
  )
)

if exist "data\demo.db" del /f /q "data\demo.db"
if exist "data\uploads" rmdir /s /q "data\uploads"
echo Demo data has been reset. It will be recreated on the next startup.
pause
endlocal
