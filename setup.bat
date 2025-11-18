@echo off
REM VibeVerse Quick Setup Script for Windows
REM This script automates the initial setup process

echo ========================================
echo 🎬 VibeVerse Setup Script (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
echo 📦 Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB not found on PATH
    echo If using MongoDB Atlas, you can ignore this warning
) else (
    echo ✅ MongoDB found
)

echo.
echo 📥 Installing server dependencies...
cd server

REM Check for package managers and install
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using pnpm...
    pnpm install
) else (
    where yarn >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Using yarn...
        yarn install
    ) else (
        echo Using npm...
        npm install
    )
)

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

echo ⚙️  Setting up environment...

REM Create .env file if it doesn't exist
if not exist .env (
    if exist .env.template (
        copy .env.template .env
        echo ✅ Created .env file from template
        echo ⚠️  Please edit .env with your API keys and credentials
    ) else (
        echo ❌ .env.template not found
        pause
        exit /b 1
    )
) else (
    echo ⚠️  .env file already exists, skipping
)

echo.
echo 🔍 Configuration checklist:
echo    [ ] MONGODB_URI - Database connection string
echo    [ ] TMDB_API_KEY - TMDB API key
echo    [ ] YOUTUBE_API_KEY - YouTube API key
echo    [ ] SPOTIFY_CLIENT_ID - Spotify client ID
echo    [ ] SPOTIFY_CLIENT_SECRET - Spotify client secret
echo    [ ] WEBHOOK_URL - Your public server URL
echo.

REM Ask if user wants to start MongoDB locally
set /p START_MONGO="Do you want to start a local MongoDB instance? (y/n) "
if /i "%START_MONGO%"=="y" (
    where mongod >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Starting MongoDB on default port 27017...
        if not exist ..\data\db mkdir ..\data\db
        start "MongoDB" mongod --dbpath ..\data\db --logpath ..\data\mongodb.log
        echo ✅ MongoDB started
        echo    Database path: ..\data\db
        echo    Log file: ..\data\mongodb.log
    ) else (
        echo ❌ mongod command not found
    )
)

echo.
echo ✅ Setup complete!
echo.
echo 📚 Next steps:
echo    1. Edit server\.env with your API keys
echo    2. Review SETUP_GUIDE.md for detailed instructions
echo    3. Start server: cd server ^&^& npm start
echo    4. Test health: curl http://localhost:5000/api/health
echo    5. Setup Cliq extension using plugin-manifest.json
echo    6. Setup SalesIQ bot using salesiq-bot-config.json
echo.
echo 📖 Documentation:
echo    - CLIQ_SALESIQ_README.md - Full documentation
echo    - SETUP_GUIDE.md - Step-by-step setup
echo    - BOT_QUICK_REFERENCE.md - Command reference
echo    - IMPLEMENTATION_SUMMARY.md - What was built
echo.
echo 🎉 Happy coding with VibeVerse!
echo.

pause
