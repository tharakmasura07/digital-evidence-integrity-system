@echo off
title DEIS - Digital Evidence Integrity System
color 0B
cls
echo ==============================================================
echo       DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS) v1.0
echo ==============================================================
echo [i] Mode: 100%% Offline Air-Gapped Operation (Instant Load)
echo [i] Admin ID:       ADMIN-0001
echo [i] Admin Password: admin@0001
echo [i] Local Database: %~dp0database\
echo [i] Evidence Vault: %~dp0evidence_vault\
echo ==============================================================
echo Launching DEIS in your default browser...
start "" "%~dp0index.html"
echo.
echo Application online. You may keep or close this window.
timeout /t 5 >nul
exit
