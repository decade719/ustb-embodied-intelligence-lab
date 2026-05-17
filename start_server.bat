@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting server on http://localhost:8080
echo.
echo Open your browser and go to: http://localhost:8080/index.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080
pause

