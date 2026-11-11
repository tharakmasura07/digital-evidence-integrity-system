-- =============================================================================
-- DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)
-- PRODUCTION DATABASE SCHEMA & INITIAL SEED SPECIFICATION
-- =============================================================================
-- Compatible with: SQLite 3, PostgreSQL 14+, MySQL 8.0, MariaDB 10.5+
-- Specification Standard: ISO/IEC 27037:2012 & CJIS Security Policy 5.9
-- =============================================================================

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS custody_ledger;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS evidences;
DROP TABLE IF EXISTS case_files;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS agencies;

-- =============================================================================
-- 1. AGENCIES / OPERATING BODIES TABLE
-- =============================================================================
CREATE TABLE agencies (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    badge VARCHAR(32) UNIQUE NOT NULL,
    role_label VARCHAR(128) NOT NULL,
    icon VARCHAR(32) DEFAULT 'shield',
    color VARCHAR(32) DEFAULT 'cyan',
    public_key VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. USERS & PERSONNEL CREDENTIALS TABLE
-- =============================================================================
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    badge_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    agency_id VARCHAR(32) NOT NULL,
    agency_name VARCHAR(128) NOT NULL,
    job_title VARCHAR(128) NOT NULL,
    clearance_level VARCHAR(64) NOT NULL,
    password VARCHAR(128) NOT NULL,
    security_token VARCHAR(64),
    is_admin BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- =============================================================================
-- 3. LEGAL CASE FILES DOSSIER TABLE
-- =============================================================================
CREATE TABLE case_files (
    id VARCHAR(64) PRIMARY KEY,
    case_number VARCHAR(15) UNIQUE NOT NULL, -- Limited to maximum 15 characters
    title VARCHAR(255) UNIQUE NOT NULL,      -- Case title must be globally unique
    category VARCHAR(64) NOT NULL,
    lead_agency VARCHAR(32) NOT NULL,
    investigating_officer VARCHAR(128) NOT NULL,
    court_jurisdiction VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE_INVESTIGATION',
    storage_folder VARCHAR(255) NOT NULL,
    description TEXT,
    opened_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_agency) REFERENCES agencies(id) ON DELETE CASCADE
);

-- =============================================================================
-- 4. DIGITAL EVIDENCE VAULT REPOSITORY TABLE
-- =============================================================================
CREATE TABLE evidences (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL,
    case_number VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    file_type VARCHAR(32) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    seizure_date TIMESTAMP NOT NULL,
    seizure_location VARCHAR(255),
    source_device VARCHAR(255),
    current_custodian VARCHAR(64) NOT NULL,
    custodian_agency VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    sha256 CHAR(64) NOT NULL,
    sha512 CHAR(128) NOT NULL,
    digital_seal VARCHAR(64) NOT NULL,
    classification VARCHAR(64) DEFAULT 'RESTRICTED-LEGAL',
    notes TEXT,
    stored_file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES case_files(id) ON DELETE CASCADE,
    FOREIGN KEY (custodian_agency) REFERENCES agencies(id) ON DELETE CASCADE
);
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (custodian_agency) REFERENCES agencies(id)
);

-- =============================================================================
-- 4. CUSTODY TRANSFERS TABLE (DUAL-PARTY PROTOCOL)
-- =============================================================================
CREATE TABLE transfers (
    transfer_id VARCHAR(64) PRIMARY KEY,
    evidence_id VARCHAR(64) NOT NULL,
    evidence_title VARCHAR(255) NOT NULL,
    from_agency VARCHAR(32) NOT NULL,
    to_agency VARCHAR(32) NOT NULL,
    initiator_officer VARCHAR(128) NOT NULL,
    recipient_officer VARCHAR(128),
    purpose TEXT NOT NULL,
    transfer_mode VARCHAR(128) DEFAULT 'Air-Gapped Vault + Dual Verification Token',
    handoff_token CHAR(6) NOT NULL,
    sender_signature VARCHAR(128) NOT NULL,
    recipient_signature VARCHAR(128),
    status VARCHAR(32) NOT NULL,
    dispatch_time TIMESTAMP NOT NULL,
    accepted_time TIMESTAMP,
    integrity_verified BOOLEAN DEFAULT 0,
    transfer_manifest_hash CHAR(64) NOT NULL,
    FOREIGN KEY (evidence_id) REFERENCES evidences(id) ON DELETE CASCADE,
    FOREIGN KEY (from_agency) REFERENCES agencies(id),
    FOREIGN KEY (to_agency) REFERENCES agencies(id)
);

-- =============================================================================
-- 5. IMMUTABLE CHAIN OF CUSTODY LEDGER (BLOCKCHAIN BLOCKS)
-- =============================================================================
CREATE TABLE custody_ledger (
    block_height INT PRIMARY KEY,
    block_hash CHAR(64) UNIQUE NOT NULL,
    previous_hash CHAR(64) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    evidence_id VARCHAR(64) NOT NULL,
    case_id VARCHAR(64) NOT NULL,
    agency VARCHAR(32) NOT NULL,
    officer VARCHAR(128) NOT NULL,
    action_description TEXT NOT NULL,
    evidence_hash CHAR(64) NOT NULL,
    merkle_root CHAR(64) NOT NULL,
    signature VARCHAR(128) NOT NULL,
    tampered BOOLEAN DEFAULT 0
);

-- =============================================================================
-- INDEXES FOR FAST QUERYING & FORENSIC SEARCH
-- =============================================================================
CREATE INDEX idx_users_badge ON users(badge_id);
CREATE INDEX idx_users_agency ON users(agency_id);
CREATE INDEX idx_evidences_sha256 ON evidences(sha256);
CREATE INDEX idx_evidences_case ON evidences(case_number);
CREATE INDEX idx_evidences_agency ON evidences(custodian_agency);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_ledger_evidence ON custody_ledger(evidence_id);

-- =============================================================================
-- INITIAL SEED DATA
-- =============================================================================

-- Seed Agencies
INSERT INTO agencies (id, name, badge, role_label, icon, color, public_key) VALUES
('admin', 'DEIS Root Access & Identity Control Authority', 'ROOT-ADMIN', 'Root System Administrator', 'shield-check', 'cyan', '0x000000000000000000000000000000000000000000000000000000000000ADMIN'),
('police', 'Cyber Crime Investigation Cell (CCIC)', 'CCIC-HQ', 'Law Enforcement / Seizing Agency', 'shield-alert', 'cyan', '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A'),
('forensics', 'Central Forensic Science Laboratory (CFSL)', 'CFSL-CYBER', 'Digital Forensics & Scientific Analysis', 'microscope', 'emerald', '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34'),
('prosecution', 'Office of the District Attorney & State Prosecution', 'ODA-LEGAL', 'Prosecution & Legal Custody', 'briefcase', 'amber', '0x9D4C221084976BB4991204859032CD881765290A812938475901238475910283'),
('court', 'Metropolitan High Judicial Registry (Courtroom 4)', 'JUDICIAL-REG', 'Judiciary / Court of Law', 'scale', 'purple', '0xAB198F0029384756192837465019283746501928374650192837465019283746'),
('defense', 'Bar Association Criminal Defense Coalition', 'DEFENSE-BAR', 'Defense Counsel / Discovery Verifier', 'user-check', 'rose', '0xC32E094857291048572910485729104857291048572910485729104857291048');

-- Seed Only Administrator (No dummy personnel per user mandate)
INSERT INTO users (id, badge_id, name, email, agency_id, agency_name, job_title, clearance_level, password, security_token, is_admin, created_at, last_login) VALUES
('usr_admin_0001', 'ADMIN-0001', 'System Security Administrator', 'admin@deis.sec.gov', 'admin', 'DEIS Root Access & Identity Control Authority', 'Chief Security Officer & Access Governance Lead', 'LEVEL 6 — ROOT SECURITY & ACCESS CONTROL', 'admin@0001', 'TOKEN-ROOT-0001-FIPS', 1, '2026-10-28 00:00:00', '2026-10-29 10:00:00');

-- Seed Initial Vault Evidence
INSERT INTO evidences (id, case_number, title, category, file_type, file_size, seizure_date, seizure_location, source_device, current_custodian, custodian_agency, status, sha256, sha512, digital_seal, classification, notes) VALUES
('EVD-2026-0941', 'CR-2026-8831 (State v. Apex Infrastructure Breach)', 'Volatile RAM Memory Dump (C2 Command Node)', 'Memory Dump', 'raw-image (.dmp)', '16.4 GB', '2026-10-24 03:15:22', 'Server Room 4B, 100 Wall Street, NY', 'Dell PowerEdge R750 (Serial: 8G4K992-X)', 'CFSL-CYBER', 'forensics', 'UNDER_ANALYSIS', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', 'SEAL-2026-0941-VALID', 'TOP-SECRET-FORENSIC', 'Preserved with LiME acquisition module. Write-blocker hardware verified during bitstream imaging.'),
('EVD-2026-1182', 'CR-2026-8831 (State v. Apex Infrastructure Breach)', 'High-Res 4K CCTV Data Vault Optical Disk Extract', 'Video Surveillance', 'h265 (.mp4)', '4.8 GB', '2026-10-24 06:40:10', 'Apex Data Center Loading Dock Camera 09', 'Hikvision NVR 64-Ch (MAC: 00:1E:67:8A:2C:11)', 'CCIC-HQ', 'police', 'IN_VAULT', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff', 'SEAL-2026-1182-VALID', 'RESTRICTED-LEGAL', 'Continuous recording snippet from 02:45 to 04:15 UTC. No dropped frames detected.'),
('EVD-2026-2401', 'CR-2026-9042 (Operation DarkLocker Ransomware)', 'Forensic Bitstream Clone of Banking Database SSD', 'Disk Image', 'expert-witness (.e01)', '512 GB', '2026-10-25 14:20:00', 'Finance Sector Headquarters, Floor 12', 'Samsung Enterprise PM9A3 NVMe SSD', 'CCIC-HQ', 'police', 'IN_VAULT', '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b', '13f8d387349b1424d80a133df17f935399589a071ef69d7bdf9226cb8e8c87de647898863f6087b7a70a8dcf8c859c23565bcff16541f4864fa920dff0a6f4fa', 'SEAL-2026-2401-VALID', 'TOP-SECRET-FINANCIAL', 'Bit-by-bit physical cloning verified via Tableau forensic write-blocker T8u.');

-- Seed Initial Transfer
INSERT INTO transfers (transfer_id, evidence_id, evidence_title, from_agency, to_agency, initiator_officer, recipient_officer, purpose, transfer_mode, handoff_token, sender_signature, recipient_signature, status, dispatch_time, accepted_time, integrity_verified, transfer_manifest_hash) VALUES
('TRF-8891B', 'EVD-2026-0941', 'Volatile RAM Memory Dump (C2 Command Node)', 'police', 'forensics', 'Authorized Seizing Officer', 'Authorized Forensic Specialist', 'Deep memory forensic extraction, rootkit carving & malware reverse engineering.', 'Air-Gapped Hardware Vault + Dual Verification Token', '849201', '0x5b3a98c019284756291048572910485729104857291048572910485729104857', '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34', 'ACCEPTED', '2026-10-24 10:15:00', '2026-10-24 11:42:15', 1, '8f434346648f6b96df89dda901c5176b10e6d0ceec3e6a81e2dd4f0476074646');

-- Seed Custody Ledger Blocks (Immutable Blockchain with Stored Evidence SHA-256 Hashes)
INSERT INTO custody_ledger (block_height, block_hash, previous_hash, timestamp, event_type, evidence_id, case_id, agency, officer, action_description, evidence_hash, merkle_root, signature, tampered) VALUES
(0, '00000a941f82938475629102837465019283746501928374650192837465a1b2', '0000000000000000000000000000000000000000000000000000000000000000', '2026-10-24 03:15:22', 'GENESIS_SEIZURE', 'EVD-2026-0941', 'CR-2026-8831', 'police', 'Authorized Seizing Officer', 'Primary physical seizure and volatile RAM dump acquisition under warrant #WR-9921.', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'd892837465019283746501928374650192837465019283746501928374650192', '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A', 0),
(1, '00000b1182c47562910283746501928374650192837465019283746501928374', '00000a941f82938475629102837465019283746501928374650192837465a1b2', '2026-10-24 06:40:10', 'GENESIS_SEIZURE', 'EVD-2026-1182', 'CR-2026-8831', 'police', 'Authorized Seizing Officer', 'CCTV surveillance video feed extraction from optical media. Immutably sealed with SHA-256 hash.', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'a418938475629102837465019283746501928374650192837465019283746501', '0x88F1C34A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837', 0),
(2, '00000c8891d47562910283746501928374650192837465019283746501928375', '00000b1182c47562910283746501928374650192837465019283746501928374', '2026-10-24 11:42:15', 'TRANSFER_ACCEPTED_VERIFIED', 'EVD-2026-0941', 'CR-2026-8831', 'forensics', 'Authorized Forensic Specialist', 'Evidence received and accepted by CFSL-CYBER. Dual-PIN authenticated. Bitstream hash re-verified (100% SHA-256 match).', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'b729104857291048572910485729104857291048572910485729104857291048', '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34', 0),
(3, '00000d2401e47562910283746501928374650192837465019283746501928376', '00000c8891d47562910283746501928374650192837465019283746501928375', '2026-10-25 14:20:00', 'GENESIS_SEIZURE', 'EVD-2026-2401', 'CR-2026-9042', 'police', 'Authorized Seizing Officer', 'Initial intake and NVMe forensic bitstream clone registration. Primary SHA-256 seal generated.', '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b', 'c918273645019283746501928374650192837465019283746501928374650192', '0x99A2B4CD76AA4410984DE1942055610034AC91B4920049458902341786EF3412', 0);
