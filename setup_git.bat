@echo off
title DEIS - GitHub Upload Assistant
color 0B
cls
echo ==============================================================
echo       DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)
echo             GITHUB REPOSITORY SETUP ASSISTANT
echo ==============================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git command-line tool is not detected in your system PATH.
    echo.
    echo --------------------------------------------------------------
    echo THREE EASY WAYS TO UPLOAD TO GITHUB:
    echo --------------------------------------------------------------
    echo.
    echo OPTION 1: UPLOAD VIA GITHUB WEBSITE (No installation needed)
    echo   1. Go to https://github.com/new and create a new repository.
    echo   2. On the empty repo page, click "uploading an existing file".
    echo   3. Drag and drop all files from this folder directly into GitHub.
    echo   4. Click "Commit changes". Done!
    echo.
    echo OPTION 2: USE GITHUB DESKTOP (Official GUI app)
    echo   1. Download and install GitHub Desktop from https://desktop.github.com
    echo   2. Click File -^> Add Local Repository -^> Select this folder.
    echo   3. Click "Publish repository" to push to your GitHub account.
    echo.
    echo OPTION 3: INSTALL GIT CLI
    echo   1. Download Git from https://git-scm.com/download/win
    echo   2. Run the installer and re-run this setup_git.bat file!
    echo.
    echo ==============================================================
    pause
    exit /b
)

echo [*] Git detected on your machine!
echo.
echo Initializing Git repository...
if not exist .git (
    git init
) else (
    echo [.git folder already exists]
)

echo Adding all project files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: Digital Evidence Integrity System (DEIS) v1.0"

echo Setting default branch to 'main'...
git branch -M main

echo.
echo ==============================================================
echo               LOCAL GIT SETUP COMPLETE!
echo ==============================================================
echo.
echo To push this repository to GitHub right now:
echo 1. Create a new repository at: https://github.com/new
echo    (Do NOT check "Add a README file" since we already have one)
echo 2. Copy the repository URL (e.g. https://github.com/your-username/deis.git)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (or press ENTER to skip): "

if not "%REPO_URL%"=="" (
    echo.
    echo Linking remote origin to %REPO_URL%...
    git remote remove origin >nul 2>nul
    git remote add origin %REPO_URL%
    echo Pushing code to GitHub...
    git push -u origin main
    echo.
    echo [DONE] Project successfully published to GitHub!
) else (
    echo.
    echo Pushing skipped. When ready, you can push manually with:
    echo   git remote add origin ^<your-github-url^>
    echo   git push -u origin main
)

echo.
echo ==============================================================
pause
