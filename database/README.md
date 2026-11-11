# Digital Evidence Integrity System (DEIS) — Database Documentation

This directory contains the database design, schema specification, and relational models for the **Digital Evidence Integrity System (DEIS)**.

---

## 1. Database Architecture Overview

DEIS employs a dual-tier storage strategy designed for zero-friction setup and production compatibility:

1. **Active Application Database (`IndexedDB`)**:
   - Database Name: `DEIS_EVIDENCE_VAULT_DB` (Version 1)
   - Runs client-side directly in the browser (Chrome, Brave, Edge, Firefox).
   - Real transactional object stores with indexes on `badgeId`, `sha256`, `caseNumber`, `status`.
   - Requires zero installation of servers (MySQL/Postgres) — operates automatically when opening `start.bat`.

2. **Relational SQL Export (`schema.sql`)**:
   - Standard ANSI-compliant SQL DDL and DML script.
   - Compatible with **SQLite 3**, **PostgreSQL 14+**, **MySQL 8.0**, and **MariaDB**.
   - Contains all foreign keys, unique constraints, and indexes for formal project submission and backend migration.

---

## 2. Relational Schema & Tables

```mermaid
erDiagram
    AGENCIES ||--o{ USERS : employs
    AGENCIES ||--o{ CASE_FILES : investigates
    CASE_FILES ||--o{ EVIDENCES : stores
    EVIDENCES ||--o{ TRANSFERS : transfers
    EVIDENCES ||--o{ CUSTODY_LEDGER : recorded_in

    CASE_FILES {
        string id PK
        string case_number UK
        string title
        string category
        string lead_agency FK
        string court_jurisdiction
        string status
        string storage_folder
    }

    AGENCIES {
        string id PK
        string name
        string badge
        string role_label
        string public_key
    }

    USERS {
        string id PK
        string badge_id UK
        string name
        string email UK
        string agency_id FK
        string job_title
        string clearance_level
        string password
        boolean is_admin
    }

    EVIDENCES {
        string id PK
        string case_number
        string title
        string category
        string file_size
        string sha256
        string sha512
        string custodian_agency FK
        string status
    }

    TRANSFERS {
        string transfer_id PK
        string evidence_id FK
        string from_agency FK
        string to_agency FK
        string handoff_token
        string status
        timestamp dispatch_time
    }

    CUSTODY_LEDGER {
        int block_height PK
        string block_hash UK
        string previous_hash
        string evidence_id FK
        string agency FK
        string merkle_root
        string signature
    }
```

---

## 3. How to Use & Export the Database

* **Viewing the Database in DEIS**:
  * Log in as `ADMIN-0001` (`admin@0001`).
  * Click **Database Explorer** in the left sidebar menu.
  * You will see the live tables (`users`, `evidences`, `transfers`, `custody_ledger`), record counts, and raw data rows.
* **Exporting to SQL**:
  * In the **Database Explorer**, click **Download SQL Dump (.sql)**.
  * A full `.sql` file containing all current users and evidences will be downloaded to your computer.
* **Loading into SQLite**:
  ```bash
  sqlite3 deis.db < schema.sql
  ```
* **Loading into PostgreSQL / MySQL**:
  ```bash
  psql -U postgres -d deis_db -f schema.sql
  # or MySQL:
  mysql -u root -p deis_db < schema.sql
  ```
