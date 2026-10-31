@echo off
echo ==============================================================
echo     DIGITAL EVIDENCE INTEGRITY SYSTEM — LOCAL STORAGE
echo ==============================================================
echo Opening Database folder (where users and evidence records are stored)...
start "" explorer "%~dp0database"
echo Opening Evidence Vault folder (where physical evidence files are stored)...
start "" explorer "%~dp0evidence_vault"
echo Folders opened.
