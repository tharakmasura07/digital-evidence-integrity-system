@echo off
title Push DEIS to GitHub
color 0B
cls
echo ==============================================================
echo       DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)
echo                PUSH CODE TO GITHUB
echo ==============================================================
echo.
echo Target Repository:
echo https://github.com/tharakmasura07/digital-evidence-integrity-system
echo.
echo Pushing code to GitHub (branch: main)...
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [*] Note: If the repository already had files created on GitHub, retrying with force push...
    git push -u origin main --force
)
echo.
echo ==============================================================
echo [*] Done! Now go to https://vercel.com/new and click Import!
echo ==============================================================
pause
