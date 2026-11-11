# Digital Evidence Vault (`evidence_vault/`)

This directory is the **physical storage vault on your computer disk** where digital evidence files are stored and organized into dedicated **Case Folders**.

---

## Case File Storage Folders:

### 1. `Case_CR-2026-8831_Apex_Breach/`
* **Case Title:** State v. Apex Infrastructure Breach
* **Case ID:** `CR-2026-8831`
* **Stored Evidence Artifacts:**
  * `EVD-2026-0941_memory_dump.raw` (Volatile RAM dump, 16.4 GB)
  * `EVD-2026-1182_surveillance_feed.mp4` (4K CCTV surveillance feed, 4.8 GB)
  * `CASE_FILE_SUMMARY.txt` (Dossier overview and forensic audit metadata)

### 2. `Case_CR-2026-9042_DarkLocker_Ransomware/`
* **Case Title:** Operation DarkLocker Ransomware
* **Case ID:** `CR-2026-9042`
* **Stored Evidence Artifacts:**
  * `EVD-2026-2401_darklocker_clone.e01` (Forensic bitstream clone, 512 GB)
  * `CASE_FILE_SUMMARY.txt` (Dossier overview and forensic audit metadata)

---

## How Case Storage Works:

1. **Creating a Case File:** When you open a case file in DEIS, a new investigation dossier is registered with its case ID, title, and lead agency.
2. **Storing Evidence in a Case:** Each evidence artifact is sealed with a genuine SHA-256 bitstream fingerprint and saved directly into its designated Case Folder.
3. **Chain of Custody:** Transferring an artifact or submitting it to court preserves its assignment to that case file, ensuring the case evidence bundle remains complete and verifiable.
