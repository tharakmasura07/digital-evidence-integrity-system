/**
 * Digital Evidence Integrity System (DEIS)
 * Database Engine (IndexedDB + SQL Exporter)
 * 
 * Manages persistent relational storage for:
 * - users: Registered personnel, credentials, roles, badges
 * - evidences: Seized digital evidence artifacts, SHA-256 hashes
 * - transfers: Dual-party custody dispatch & handoff records
 * - chain_blocks: Cryptographic ledger history blocks
 */

const DB_NAME = 'DEIS_EVIDENCE_VAULT_DB';
const DB_VERSION = 1;

class DEISDatabaseManager {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.initPromise = this.init();
  }

  /**
   * Initialize IndexedDB Object Stores & Indexes
   */
  async init() {
    if (!window.indexedDB) {
      console.warn('DEIS DB: IndexedDB not supported in this browser. Using memory fallback.');
      this.isReady = true;
      return null;
    }

    return new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // 1. Users Table
          if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('badgeId', 'badgeId', { unique: true });
            userStore.createIndex('agencyId', 'agencyId', { unique: false });
            userStore.createIndex('email', 'email', { unique: false });
            userStore.createIndex('isAdmin', 'isAdmin', { unique: false });
          }

          // 2. Evidence Table
          if (!db.objectStoreNames.contains('evidences')) {
            const evStore = db.createObjectStore('evidences', { keyPath: 'id' });
            evStore.createIndex('caseNumber', 'caseNumber', { unique: false });
            evStore.createIndex('sha256', 'sha256', { unique: false });
            evStore.createIndex('custodianAgency', 'custodianAgency', { unique: false });
            evStore.createIndex('status', 'status', { unique: false });
          }

          // 3. Transfers Table
          if (!db.objectStoreNames.contains('transfers')) {
            const trfStore = db.createObjectStore('transfers', { keyPath: 'transferId' });
            trfStore.createIndex('evidenceId', 'evidenceId', { unique: false });
            trfStore.createIndex('fromAgency', 'fromAgency', { unique: false });
            trfStore.createIndex('toAgency', 'toAgency', { unique: false });
            trfStore.createIndex('status', 'status', { unique: false });
          }

          // 4. Custody Chain Ledger Table
          if (!db.objectStoreNames.contains('chain_blocks')) {
            const chainStore = db.createObjectStore('chain_blocks', { keyPath: 'blockHeight' });
            chainStore.createIndex('evidenceId', 'evidenceId', { unique: false });
            chainStore.createIndex('blockHash', 'blockHash', { unique: true });
          }

          // 5. System Metadata Table
          if (!db.objectStoreNames.contains('db_meta')) {
            db.createObjectStore('db_meta', { keyPath: 'key' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          this.isReady = true;
          this.seedInitialDataIfEmpty();
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.warn('DEIS DB: Open failed, continuing with store fallback', event.target.error);
          this.isReady = true;
          resolve(null);
        };
      } catch (err) {
        console.warn('DEIS DB: Initialization exception', err);
        this.isReady = true;
        resolve(null);
      }
    });
  }

  /**
   * Helper: Generic Transaction Runner
   */
  async _tx(storeName, mode, callback) {
    await this.initPromise;
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const req = callback(store);

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  // ==================== USERS TABLE OPERATIONS ====================
  async getAllUsers() {
    try {
      const res = await this._tx('users', 'readonly', (store) => store.getAll());
      return res || [];
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getUsers()) || [];
    }
  }

  async getUserById(id) {
    try {
      return await this._tx('users', 'readonly', (store) => store.get(id));
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getUserById(id)) || null;
    }
  }

  async getUserByBadge(badgeId) {
    try {
      await this.initPromise;
      if (!this.db) return null;
      return new Promise((resolve) => {
        const tx = this.db.transaction('users', 'readonly');
        const index = tx.objectStore('users').index('badgeId');
        const req = index.get(badgeId.toUpperCase());
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getUserByBadge(badgeId)) || null;
    }
  }

  async insertUser(user) {
    try {
      await this._tx('users', 'readwrite', (store) => store.put(user));
    } catch (e) {
      console.warn('DEIS DB: Could not write user to IndexedDB', e);
    }
  }

  async deleteUser(id) {
    try {
      await this._tx('users', 'readwrite', (store) => store.delete(id));
    } catch (e) {
      console.warn('DEIS DB: Could not delete user from IndexedDB', e);
    }
  }

  // ==================== EVIDENCE TABLE OPERATIONS ====================
  async getAllEvidence() {
    try {
      const res = await this._tx('evidences', 'readonly', (store) => store.getAll());
      return res || [];
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getEvidenceList()) || [];
    }
  }

  async getEvidenceById(id) {
    try {
      return await this._tx('evidences', 'readonly', (store) => store.get(id));
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getEvidenceById(id)) || null;
    }
  }

  async insertEvidence(evidence) {
    try {
      await this._tx('evidences', 'readwrite', (store) => store.put(evidence));
    } catch (e) {
      console.warn('DEIS DB: Could not write evidence to IndexedDB', e);
    }
  }

  async deleteEvidence(id) {
    try {
      await this._tx('evidences', 'readwrite', (store) => store.delete(id));
    } catch (e) {
      console.warn('DEIS DB: Could not delete evidence from IndexedDB', e);
    }
  }

  // ==================== TRANSFERS TABLE OPERATIONS ====================
  async getAllTransfers() {
    try {
      const res = await this._tx('transfers', 'readonly', (store) => store.getAll());
      return res || [];
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getTransfers()) || [];
    }
  }

  async insertTransfer(transfer) {
    try {
      await this._tx('transfers', 'readwrite', (store) => store.put(transfer));
    } catch (e) {
      console.warn('DEIS DB: Could not write transfer to IndexedDB', e);
    }
  }

  // ==================== CHAIN BLOCKS TABLE OPERATIONS ====================
  async getAllChainBlocks() {
    try {
      const res = await this._tx('chain_blocks', 'readonly', (store) => store.getAll());
      return res || [];
    } catch (e) {
      return (window.DEISStore && window.DEISStore.getChainBlocks()) || [];
    }
  }

  async insertChainBlock(block) {
    try {
      await this._tx('chain_blocks', 'readwrite', (store) => store.put(block));
    } catch (e) {
      console.warn('DEIS DB: Could not write block to IndexedDB', e);
    }
  }

  /**
   * Seed initial data into IndexedDB from the active Store state if empty
   */
  async seedInitialDataIfEmpty() {
    if (!this.db) return;
    try {
      const existingUsers = await this.getAllUsers();
      if (!existingUsers || existingUsers.length === 0) {
        const store = window.DEISStore;
        if (store && store.state) {
          for (const u of (store.state.users || [])) {
            await this.insertUser(u);
          }
          for (const ev of (store.state.evidence || [])) {
            await this.insertEvidence(ev);
          }
          for (const trf of (store.state.transfers || [])) {
            await this.insertTransfer(trf);
          }
          for (const blk of (store.state.chainBlocks || [])) {
            await this.insertChainBlock(blk);
          }
          await this._tx('db_meta', 'readwrite', (s) => s.put({ key: 'last_sync', value: new Date().toISOString() }));
        }
      }
    } catch (err) {
      console.warn('DEIS DB: Seed check notice', err);
    }
  }

  /**
   * Sync all state from DEISStore into IndexedDB
   */
  async syncFromStore(storeState) {
    if (!this.db || !storeState) return;
    try {
      // Sync Users
      if (Array.isArray(storeState.users)) {
        for (const u of storeState.users) {
          await this.insertUser(u);
        }
      }
      // Sync Evidence
      if (Array.isArray(storeState.evidence)) {
        for (const ev of storeState.evidence) {
          await this.insertEvidence(ev);
        }
      }
      // Sync Transfers
      if (Array.isArray(storeState.transfers)) {
        for (const trf of storeState.transfers) {
          await this.insertTransfer(trf);
        }
      }
      // Sync Chain
      if (Array.isArray(storeState.chainBlocks)) {
        for (const blk of storeState.chainBlocks) {
          await this.insertChainBlock(blk);
        }
      }
    } catch (e) {
      console.warn('DEIS DB: Background sync notice', e);
    }
  }

  // ==================== SQL GENERATION & EXPORT ====================
  /**
   * Generate clean standard SQL dump (PostgreSQL / SQLite / MySQL compatible)
   */
  generateSQLDump() {
    const store = window.DEISStore;
    const users = (store && store.getUsers()) || [];
    const evidence = (store && store.getEvidenceList()) || [];
    const transfers = (store && store.getTransfers()) || [];
    const chainBlocks = (store && store.getChainBlocks()) || [];

    const now = new Date().toISOString();

    let sql = `-- =====================================================================\n`;
    sql += `-- DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS) DATABASE DUMP\n`;
    sql += `-- Generated on: ${now}\n`;
    sql += `-- Database Engine: DEIS Structured Relational Storage\n`;
    sql += `-- Compatible with: SQLite 3, PostgreSQL, MySQL 8.0, MariaDB\n`;
    sql += `-- =====================================================================\n\n`;

    sql += `-- 1. USERS & PERSONNEL TABLE\n`;
    sql += `CREATE TABLE IF NOT EXISTS users (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  badge_id VARCHAR(32) UNIQUE NOT NULL,\n`;
    sql += `  name VARCHAR(128) NOT NULL,\n`;
    sql += `  email VARCHAR(128) NOT NULL,\n`;
    sql += `  agency_id VARCHAR(32) NOT NULL,\n`;
    sql += `  agency_name VARCHAR(128) NOT NULL,\n`;
    sql += `  job_title VARCHAR(128) NOT NULL,\n`;
    sql += `  clearance_level VARCHAR(64) NOT NULL,\n`;
    sql += `  password VARCHAR(128) NOT NULL,\n`;
    sql += `  is_admin BOOLEAN DEFAULT 0,\n`;
    sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    sql += `-- 2. EVIDENCE REPOSITORY TABLE\n`;
    sql += `CREATE TABLE IF NOT EXISTS evidences (\n`;
    sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  case_number VARCHAR(64) NOT NULL,\n`;
    sql += `  title VARCHAR(255) NOT NULL,\n`;
    sql += `  category VARCHAR(64) NOT NULL,\n`;
    sql += `  file_type VARCHAR(32) NOT NULL,\n`;
    sql += `  file_size VARCHAR(32) NOT NULL,\n`;
    sql += `  seizure_date TIMESTAMP NOT NULL,\n`;
    sql += `  seizure_location VARCHAR(255),\n`;
    sql += `  source_device VARCHAR(255),\n`;
    sql += `  current_custodian VARCHAR(64) NOT NULL,\n`;
    sql += `  custodian_agency VARCHAR(32) NOT NULL,\n`;
    sql += `  status VARCHAR(32) NOT NULL,\n`;
    sql += `  sha256 CHAR(64) NOT NULL,\n`;
    sql += `  sha512 CHAR(128) NOT NULL,\n`;
    sql += `  digital_seal VARCHAR(64),\n`;
    sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    sql += `-- 3. CUSTODY TRANSFERS TABLE\n`;
    sql += `CREATE TABLE IF NOT EXISTS transfers (\n`;
    sql += `  transfer_id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `  evidence_id VARCHAR(64) REFERENCES evidences(id),\n`;
    sql += `  from_agency VARCHAR(32) NOT NULL,\n`;
    sql += `  to_agency VARCHAR(32) NOT NULL,\n`;
    sql += `  initiator_officer VARCHAR(128) NOT NULL,\n`;
    sql += `  recipient_officer VARCHAR(128),\n`;
    sql += `  purpose TEXT NOT NULL,\n`;
    sql += `  handoff_token CHAR(6) NOT NULL,\n`;
    sql += `  status VARCHAR(32) NOT NULL,\n`;
    sql += `  dispatch_time TIMESTAMP NOT NULL,\n`;
    sql += `  accepted_time TIMESTAMP,\n`;
    sql += `  manifest_hash CHAR(64) NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- 4. IMMUTABLE CHAIN OF CUSTODY LEDGER TABLE\n`;
    sql += `CREATE TABLE IF NOT EXISTS custody_ledger (\n`;
    sql += `  block_height INT PRIMARY KEY,\n`;
    sql += `  block_hash CHAR(64) NOT NULL,\n`;
    sql += `  previous_hash CHAR(64) NOT NULL,\n`;
    sql += `  timestamp TIMESTAMP NOT NULL,\n`;
    sql += `  event_type VARCHAR(64) NOT NULL,\n`;
    sql += `  evidence_id VARCHAR(64) NOT NULL,\n`;
    sql += `  agency VARCHAR(32) NOT NULL,\n`;
    sql += `  action_description TEXT NOT NULL,\n`;
    sql += `  merkle_root CHAR(64) NOT NULL,\n`;
    sql += `  signature VARCHAR(128) NOT NULL\n`;
    sql += `);\n\n`;

    // INSERT STATEMENTS
    sql += `-- =====================================================================\n`;
    sql += `-- DATA RECORDS INSERTION\n`;
    sql += `-- =====================================================================\n\n`;

    // Users Inserts
    sql += `-- Seed Users\n`;
    users.forEach(u => {
      const id = `'${this.escapeSQL(u.id)}'`;
      const badge = `'${this.escapeSQL(u.badgeId)}'`;
      const name = `'${this.escapeSQL(u.name)}'`;
      const email = `'${this.escapeSQL(u.email || '')}'`;
      const agency = `'${this.escapeSQL(u.agencyId)}'`;
      const agName = `'${this.escapeSQL(u.agencyName || '')}'`;
      const title = `'${this.escapeSQL(u.jobTitle || '')}'`;
      const clr = `'${this.escapeSQL(u.clearanceLevel || '')}'`;
      const pass = `'${this.escapeSQL(u.password)}'`;
      const isAdmin = u.isAdmin ? '1' : '0';
      sql += `INSERT INTO users (id, badge_id, name, email, agency_id, agency_name, job_title, clearance_level, password, is_admin) VALUES (${id}, ${badge}, ${name}, ${email}, ${agency}, ${agName}, ${title}, ${clr}, ${pass}, ${isAdmin});\n`;
    });

    // Evidence Inserts
    sql += `\n-- Seed Evidences\n`;
    evidence.forEach(ev => {
      const id = `'${this.escapeSQL(ev.id)}'`;
      const cnum = `'${this.escapeSQL(ev.caseNumber)}'`;
      const title = `'${this.escapeSQL(ev.title)}'`;
      const cat = `'${this.escapeSQL(ev.category)}'`;
      const ft = `'${this.escapeSQL(ev.fileType)}'`;
      const fs = `'${this.escapeSQL(ev.fileSize)}'`;
      const dt = `'${this.escapeSQL(ev.seizureDate)}'`;
      const loc = `'${this.escapeSQL(ev.seizureLocation || 'N/A')}'`;
      const dev = `'${this.escapeSQL(ev.sourceDevice || 'N/A')}'`;
      const cust = `'${this.escapeSQL(ev.currentCustodian)}'`;
      const custAg = `'${this.escapeSQL(ev.custodianAgency)}'`;
      const st = `'${this.escapeSQL(ev.status)}'`;
      const h256 = `'${this.escapeSQL(ev.sha256)}'`;
      const h512 = `'${this.escapeSQL(ev.sha512 || '')}'`;
      const seal = `'${this.escapeSQL(ev.digitalSeal || 'VALID')}'`;
      sql += `INSERT INTO evidences (id, case_number, title, category, file_type, file_size, seizure_date, seizure_location, source_device, current_custodian, custodian_agency, status, sha256, sha512, digital_seal) VALUES (${id}, ${cnum}, ${title}, ${cat}, ${ft}, ${fs}, ${dt}, ${loc}, ${dev}, ${cust}, ${custAg}, ${st}, ${h256}, ${h512}, ${seal});\n`;
    });

    // Transfers Inserts
    sql += `\n-- Seed Transfers\n`;
    transfers.forEach(t => {
      const tid = `'${this.escapeSQL(t.transferId)}'`;
      const eid = `'${this.escapeSQL(t.evidenceId)}'`;
      const fa = `'${this.escapeSQL(t.fromAgency)}'`;
      const ta = `'${this.escapeSQL(t.toAgency)}'`;
      const io = `'${this.escapeSQL(t.initiatorOfficer)}'`;
      const ro = `'${this.escapeSQL(t.recipientOfficer || '')}'`;
      const pur = `'${this.escapeSQL(t.purpose)}'`;
      const tok = `'${this.escapeSQL(t.handoffToken)}'`;
      const st = `'${this.escapeSQL(t.status)}'`;
      const dt = `'${this.escapeSQL(t.dispatchTime)}'`;
      const at = t.acceptedTime ? `'${this.escapeSQL(t.acceptedTime)}'` : 'NULL';
      const mh = `'${this.escapeSQL(t.transferManifestHash || '')}'`;
      sql += `INSERT INTO transfers (transfer_id, evidence_id, from_agency, to_agency, initiator_officer, recipient_officer, purpose, handoff_token, status, dispatch_time, accepted_time, manifest_hash) VALUES (${tid}, ${eid}, ${fa}, ${ta}, ${io}, ${ro}, ${pur}, ${tok}, ${st}, ${dt}, ${at}, ${mh});\n`;
    });

    // Ledger Blocks Inserts
    sql += `\n-- Seed Custody Ledger Blocks\n`;
    chainBlocks.forEach(b => {
      const bh = b.blockHeight;
      const h = `'${this.escapeSQL(b.blockHash)}'`;
      const ph = `'${this.escapeSQL(b.previousHash)}'`;
      const ts = `'${this.escapeSQL(b.timestamp)}'`;
      const et = `'${this.escapeSQL(b.eventType)}'`;
      const eid = `'${this.escapeSQL(b.evidenceId)}'`;
      const ag = `'${this.escapeSQL(b.agency)}'`;
      const desc = `'${this.escapeSQL(b.actionDescription)}'`;
      const mr = `'${this.escapeSQL(b.merkleRoot)}'`;
      const sig = `'${this.escapeSQL(b.signature || '')}'`;
      sql += `INSERT INTO custody_ledger (block_height, block_hash, previous_hash, timestamp, event_type, evidence_id, agency, action_description, merkle_root, signature) VALUES (${bh}, ${h}, ${ph}, ${ts}, ${et}, ${eid}, ${ag}, ${desc}, ${mr}, ${sig});\n`;
    });

    return sql;
  }

  escapeSQL(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/'/g, "''");
  }

  /**
   * Trigger browser file download for SQL Dump
   */
  downloadSQLDump() {
    const sql = this.generateSQLDump();
    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deis_database_dump_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Trigger browser file download for Users JSON
   */
  downloadUsersJSON() {
    const store = window.DEISStore;
    const users = (store && store.getUsers()) || [];
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Trigger browser file download for Evidences JSON
   */
  downloadEvidencesJSON() {
    const store = window.DEISStore;
    const evidences = (store && store.getEvidenceList()) || [];
    const blob = new Blob([JSON.stringify(evidences, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidences.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Trigger browser file download for JSON Backup
   */
  downloadJSONBackup() {
    const store = window.DEISStore;
    const backupData = {
      database: DB_NAME,
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      schema: ['users', 'evidences', 'transfers', 'chain_blocks'],
      data: {
        users: (store && store.getUsers()) || [],
        evidences: (store && store.getEvidenceList()) || [],
        transfers: (store && store.getTransfers()) || [],
        chainBlocks: (store && store.getChainBlocks()) || []
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deis_database_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Instantiate Global Database Manager
window.DEISDatabase = new DEISDatabaseManager();
