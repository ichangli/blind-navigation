@echo off
setlocal
chcp 65001 >nul
title Blind Navigation Backend
cd /d "%~dp0"

echo [1/3] Checking Python environment...
if not exist ".venv\Scripts\python.exe" (
  echo Creating virtual environment. This is only needed the first time.
  python -m venv .venv
  if errorlevel 1 goto :error
)

if not exist ".venv\Lib\site-packages\fastapi" (
  echo Installing backend dependencies. This may take several minutes...
  ".venv\Scripts\python.exe" -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r "backend\requirements.txt"
  if errorlevel 1 goto :error
) else (
  echo Dependencies are ready. Skipping pip install.
)

netstat -ano | findstr /R /C:":8000 .*LISTENING" >nul
if not errorlevel 1 (
  echo.
  echo The backend is already running at http://127.0.0.1:8000
  echo You do not need to start it again.
  echo.
  pause
  goto :end
)

echo [2/3] Checking database and seed data...
".venv\Scripts\python.exe" "backend\init_db.py"
if errorlevel 1 goto :error

echo [3/3] Starting API at http://127.0.0.1:8000
echo Keep this window open while using the application.
echo Press Ctrl+C to stop the backend.
echo.
".venv\Scripts\python.exe" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
if errorlevel 1 goto :error
goto :end

:error
echo.
echo Backend startup failed. Read the error message above.
pause
exit /b 1

:end
endlocal
