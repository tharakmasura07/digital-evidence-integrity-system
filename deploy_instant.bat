@echo off
title DEIS - Instant Web Deployment
color 0B
cls
echo ==============================================================
echo       DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)
echo                INSTANT WEB DEPLOYMENT
echo ==============================================================
echo.
echo DEIS is 100%% client-side and requires NO server installation!
echo You can deploy it live on the internet in 30 seconds for FREE.
echo.
echo --------------------------------------------------------------
echo OPTION 1: INSTANT NETLIFY DRAG ^& DROP (Live in 10 seconds)
echo --------------------------------------------------------------
echo   1. Opening https://app.netlify.com/drop in your browser...
start https://app.netlify.com/drop
echo   2. Opening your project folder in Windows File Explorer...
start explorer "%~dp0"
echo.
echo   ACTION: Simply drag and drop this project folder into the
echo   Netlify webpage in your browser. Done! You will get an instant
echo   live https://... link.
echo.
echo --------------------------------------------------------------
echo OPTION 2: GITHUB PAGES (If already uploaded to GitHub)
echo --------------------------------------------------------------
echo   1. Go to your repository on GitHub.
echo   2. Click: Settings -^> Pages (on the left menu)
echo   3. Under Branch, select: main -^> / (root) -^> Click Save!
echo   4. In 30 seconds, your site is live at:
echo      https://^<your-username^>.github.io/^<repo-name^>/
echo.
echo ==============================================================
pause
