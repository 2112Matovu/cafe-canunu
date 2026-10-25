@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
call npm run build
if errorlevel 1 goto failed
start "" http://127.0.0.1:4173
call npm run preview
goto end
:failed
echo Build failed. Check config, menu and images. Node.js 20 or newer is required.
pause
:end
