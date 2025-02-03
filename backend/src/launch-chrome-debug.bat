REM filepath: /d:/Projects/CampAIgn/backend/scripts/launch-chrome-debug.bat
@echo off
SET CHROME_PROFILE="Profile 9"
SET USER_DATA_DIR="%LOCALAPPDATA%\Google\Chrome\User Data"

echo Launching Chrome with profile %CHROME_PROFILE%...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
--remote-debugging-port=9222 ^
--user-data-dir=%USER_DATA_DIR% ^
--profile-directory=%CHROME_PROFILE%

echo Waiting for Chrome to launch...
timeout /t 5

echo Checking if Chrome is running with debugging port...
curl http://localhost:9222/json/version
pause