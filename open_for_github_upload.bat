@echo off
title DEIS - Quick GitHub Uploader
color 0A
cls
echo ==============================================================
echo       DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)
echo             QUICK GITHUB WEB UPLOADER
echo ==============================================================
echo.
echo 1. Opening GitHub New Repository page in your browser...
start https://github.com/new
echo.
echo 2. Opening your project folder in Windows File Explorer...
start explorer "%~dp0"
echo.
echo --------------------------------------------------------------
echo NEXT STEPS (Takes 30 seconds):
echo --------------------------------------------------------------
echo 1. On GitHub: Type a repository name (e.g., deis)
echo 2. Leave "Add a README file" UNCHECKED
echo 3. Click "Create repository"
echo 4. Click the link: "uploading an existing file"
echo 5. In your project folder window, press Ctrl+A (Select All)
echo 6. Drag and drop all files into the GitHub page in your browser!
echo 7. Click "Commit changes".
echo ==============================================================
echo.
pause
