/**
 * Digital Evidence Integrity System (DEIS)
 * Supabase Free Cloud Database Client & Synchronization Engine
 * 
 * Provides real-time synchronization between the DEIS client store 
 * and a free hosted Supabase PostgreSQL cloud database.
 */

const SUPABASE_STORAGE_KEY = 'DEIS_SUPABASE_CONFIG';

class DEISSupabaseManager {
  constructor() {
    this.client = null;
    this.url = '';
    this.anonKey = '';
    this.isConnected = false;
    this.lastSyncTime = null;
    this.isSyncing = false;
    this.init();
  }

  /**
   * Load stored credentials and initialize Supabase client if configured
   */
  init() {
    try {
      const saved = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        if (config && config.url && config.anonKey) {
          this.url = config.url.trim();
          this.anonKey = config.anonKey.trim();
          this.initClient();
        }
      } else if (window.DEIS_SUPABASE_CONFIG && window.DEIS_SUPABASE_CONFIG.url && window.DEIS_SUPABASE_CONFIG.anonKey) {
        this.url = window.DEIS_SUPABASE_CONFIG.url.trim();
        this.anonKey = window.DEIS_SUPABASE_CONFIG.anonKey.trim();
        this.initClient();
      }
    } catch (err) {
      console.warn('DEIS Supabase: Failed to parse stored config', err);
    }
    this.updateStatusBadge();
  }

  initClient() {
    if (!this.url || !this.anonKey) return false;
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      console.warn('DEIS Supabase: supabase-js SDK not loaded yet. Will retry after script loads.');
      return false;
    }

    try {
      this.client = window.supabase.createClient(this.url, this.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return true;
    } catch (err) {
      console.error('DEIS Supabase: Error initializing client', err);
      this.client = null;
      return false;
    }
  }

  isConfigured() {
    return !!(this.url && this.anonKey && this.client);
  }

  /**
   * Test live connectivity by querying the deis_cases table
   */
  async testConnection() {
    if (!this.client && !this.initClient()) {
      return { success: false, message: 'Supabase client could not be initialized. Check URL and Anon Key.' };
    }

    try {
      const { data, error } = await this.client.from('deis_cases').select('count', { count: 'exact', head: true });
      if (error) {
        // Table might not exist yet
        if (error.code === '42P01') {
          return {
            success: false,
            needsSchema: true,
            message: 'Connected to Supabase, but DEIS tables are missing! Please run the SQL schema script in your Supabase SQL Editor.'
          };
        }
        return { success: false, message: `Supabase Error (${error.code || 'API'}): ${error.message}` };
      }

      this.isConnected = true;
      this.updateStatusBadge();
      return { success: true, message: 'Successfully connected to free Supabase PostgreSQL cloud database!' };
    } catch (err) {
      return { success: false, message: `Network error connecting to Supabase: ${err.message}` };
    }
  }

  /**
   * Save credentials, re-init, test, and perform initial sync
   */
  async saveCredentials(url, anonKey, autoSync = true) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (anonKey || '').trim();

    if (!cleanUrl || !cleanKey) {
      throw new Error('Both Supabase Project URL and Public Anon Key are required.');
    }

    this.url = cleanUrl;
    this.anonKey = cleanKey;
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));

    this.initClient();
    const testResult = await this.testConnection();
    if (!testResult.success) {
      this.updateStatusBadge();
      return testResult;
    }

    if (autoSync && window.DEISStore) {
      await this.syncLocalToCloud(window.DEISStore);
    }

    this.updateStatusBadge();
    return testResult;
  }

  /**
   * Disconnect and remove saved credentials
   */
  disconnect() {
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
    this.url = '';
    this.anonKey = '';
    this.client = null;
    this.isConnected = false;
    this.updateStatusBadge();
  }

  /**
   * Push all local store records up to Supabase
   */
  async syncLocalToCloud(store) {
    if (!this.isConfigured()) return { success: false, message: 'Supabase is not configured.' };
    this.isSyncing = true;
    this.updateStatusBadge();

    try {
      const cases = store.getCases();
      const evidence = store.getEvidenceList();
      const transfers = store.getTransfers();
      const blocks = store.getChainBlocks();
      const reports = store.getForensicReports();
      const users = store.getUsers();

      // 1. Upsert Cases
      if (cases.length > 0) {
        const payload = cases.map(c => ({
          id: c.id,
          case_number: c.caseNumber,
          title: c.title,
          category: c.category,
          lead_agency: c.leadAgency,
          lead_agency_name: c.leadAgencyName,
          investigating_officer: c.investigatingOfficer,
          court_jurisdiction: c.courtJurisdiction,
          status: c.status,
          opened_date: c.openedDate,
          storage_folder: c.storageFolder,
          description: c.description
        }));
        await this.client.from('deis_cases').upsert(payload, { onConflict: 'id' });
      }

      // 2. Upsert Evidence
      if (evidence.length > 0) {
        const payload = evidence.map(e => ({
          id: e.id,
          case_id: e.caseId,
          case_number: e.caseNumber,
          case_title: e.caseTitle,
          title: e.title,
          category: e.category,
          file_type: e.fileType,
          file_size: e.fileSize,
          file_name: e.fileName,
          stored_file_path: e.storedFilePath,
          seizure_date: e.seizureDate,
          seizure_location: e.seizureLocation,
          source_device: e.sourceDevice,
          current_custodian: e.currentCustodian,
          custodian_agency: e.custodianAgency,
          status: e.status,
          sha256: e.sha256,
          sha512: e.sha512,
          digital_seal: e.digitalSeal,
          classification: e.classification,
          tags: e.tags || [],
          notes: e.notes
        }));
        await this.client.from('deis_evidence').upsert(payload, { onConflict: 'id' });
      }

      // 3. Upsert Transfers
      if (transfers.length > 0) {
        const payload = transfers.map(t => ({
          transfer_id: t.transferId,
          item_type: t.itemType || 'EVIDENCE_ARTIFACT',
          evidence_id: t.evidenceId,
          evidence_title: t.evidenceTitle,
          report_id: t.reportId,
          report_title: t.reportTitle,
          from_agency: t.fromAgency,
          to_agency: t.toAgency,
          initiator_officer: t.initiatorOfficer,
          recipient_officer: t.recipientOfficer,
          purpose: t.purpose,
          transfer_mode: t.transferMode,
          handoff_token: t.handoffToken,
          sender_signature: t.senderSignature,
          recipient_signature: t.recipientSignature,
          status: t.status,
          dispatch_time: t.dispatchTime,
          accepted_time: t.acceptedTime,
          integrity_verified: t.integrityVerified !== false,
          transfer_manifest_hash: t.transferManifestHash
        }));
        await this.client.from('deis_transfers').upsert(payload, { onConflict: 'transfer_id' });
      }

      // 4. Upsert Blocks
      if (blocks.length > 0) {
        const payload = blocks.map(b => ({
          block_height: b.blockHeight,
          block_hash: b.blockHash,
          previous_hash: b.previousHash,
          timestamp: b.timestamp,
          event_type: b.eventType,
          evidence_id: b.evidenceId,
          case_id: b.caseId,
          agency: b.agency,
          officer: b.officer,
          action_description: b.actionDescription,
          evidence_hash: b.evidenceHash,
          merkle_root: b.merkleRoot,
          signature: b.signature,
          tampered: !!b.tampered
        }));
        await this.client.from('deis_chain_blocks').upsert(payload, { onConflict: 'block_height' });
      }

      // 5. Upsert Reports
      if (reports.length > 0) {
        const payload = reports.map(r => ({
          report_id: r.reportId,
          evidence_id: r.evidenceId,
          case_number: r.caseNumber,
          title: r.title,
          examiner_name: r.examinerName,
          examiner_badge: r.examinerBadge,
          laboratory_name: r.laboratoryName,
          author_agency_id: r.authorAgencyId,
          examination_date: r.examinationDate,
          hardware_profile: r.hardwareProfile,
          tool_chain: r.toolChain,
          findings: r.findings,
          conclusion: r.conclusion,
          integrity_verified: r.integrityVerified !== false,
          report_signature: r.reportSignature
        }));
        await this.client.from('deis_forensic_reports').upsert(payload, { onConflict: 'report_id' });
      }

      // 6. Upsert Users
      if (users.length > 0) {
        const payload = users.map(u => ({
          id: u.id,
          name: u.name,
          badge_id: u.badgeId,
          email: u.email,
          agency_id: u.agencyId,
          agency_name: u.agencyName,
          job_title: u.jobTitle,
          clearance_level: u.clearanceLevel,
          initials: u.initials,
          color: u.color,
          icon: u.icon,
          password: u.password,
          department: u.department,
          security_token: u.securityToken,
          is_admin: !!u.isAdmin,
          created_at: u.createdAt,
          last_login: u.lastLogin
        }));
        await this.client.from('deis_users').upsert(payload, { onConflict: 'id' });
      }

      this.lastSyncTime = new Date().toISOString();
      this.isConnected = true;
      this.isSyncing = false;
      this.updateStatusBadge();
      return { success: true, message: `Synced ${cases.length} cases, ${evidence.length} exhibits, and ${blocks.length} chain blocks to Supabase Cloud!` };
    } catch (err) {
      this.isSyncing = false;
      this.updateStatusBadge();
      console.error('DEIS Supabase: Cloud sync failed', err);
      return { success: false, message: `Sync failed: ${err.message}` };
    }
  }

  /**
   * Pull records from Supabase into local memory/localStorage
   */
  async syncCloudToLocal(store) {
    if (!this.isConfigured()) return { success: false, message: 'Supabase is not configured.' };
    this.isSyncing = true;
    this.updateStatusBadge();

    try {
      // 1. Fetch Cases
      const { data: casesData } = await this.client.from('deis_cases').select('*');
      if (casesData && casesData.length > 0) {
        store.state.cases = casesData.map(c => ({
          id: c.id,
          caseNumber: c.case_number,
          title: c.title,
          category: c.category,
          leadAgency: c.lead_agency,
          leadAgencyName: c.lead_agency_name,
          investigatingOfficer: c.investigating_officer,
          courtJurisdiction: c.court_jurisdiction,
          status: c.status,
          openedDate: c.opened_date,
          storageFolder: c.storage_folder,
          description: c.description
        }));
      }

      // 2. Fetch Evidence
      const { data: evData } = await this.client.from('deis_evidence').select('*');
      if (evData && evData.length > 0) {
        store.state.evidence = evData.map(e => ({
          id: e.id,
          caseId: e.case_id,
          caseNumber: e.case_number,
          caseTitle: e.case_title,
          title: e.title,
          category: e.category,
          fileType: e.file_type,
          fileSize: e.file_size,
          fileName: e.file_name,
          storedFilePath: e.stored_file_path,
          seizureDate: e.seizure_date,
          seizureLocation: e.seizure_location,
          sourceDevice: e.source_device,
          currentCustodian: e.current_custodian,
          custodianAgency: e.custodian_agency,
          status: e.status,
          sha256: e.sha256,
          sha512: e.sha512,
          digitalSeal: e.digital_seal,
          classification: e.classification,
          tags: Array.isArray(e.tags) ? e.tags : [],
          notes: e.notes
        }));
      }

      // 3. Fetch Transfers
      const { data: trfData } = await this.client.from('deis_transfers').select('*');
      if (trfData && trfData.length > 0) {
        store.state.transfers = trfData.map(t => ({
          transferId: t.transfer_id,
          itemType: t.item_type || 'EVIDENCE_ARTIFACT',
          evidenceId: t.evidence_id,
          evidenceTitle: t.evidence_title,
          reportId: t.report_id,
          reportTitle: t.report_title,
          fromAgency: t.from_agency,
          toAgency: t.to_agency,
          initiatorOfficer: t.initiator_officer,
          recipientOfficer: t.recipient_officer,
          purpose: t.purpose,
          transferMode: t.transfer_mode,
          handoffToken: t.handoff_token,
          senderSignature: t.sender_signature,
          recipientSignature: t.recipient_signature,
          status: t.status,
          dispatchTime: t.dispatch_time,
          acceptedTime: t.accepted_time,
          integrityVerified: t.integrity_verified,
          transferManifestHash: t.transfer_manifest_hash
        }));
      }

      // 4. Fetch Chain Blocks
      const { data: blockData } = await this.client.from('deis_chain_blocks').select('*').order('block_height', { ascending: true });
      if (blockData && blockData.length > 0) {
        store.state.chainBlocks = blockData.map(b => ({
          blockHeight: b.block_height,
          blockHash: b.block_hash,
          previousHash: b.previous_hash,
          timestamp: b.timestamp,
          eventType: b.event_type,
          evidenceId: b.evidence_id,
          caseId: b.case_id,
          agency: b.agency,
          officer: b.officer,
          actionDescription: b.action_description,
          evidenceHash: b.evidence_hash,
          merkleRoot: b.merkle_root,
          signature: b.signature,
          tampered: b.tampered
        }));
      }

      // 5. Fetch Forensic Reports
      const { data: rptData } = await this.client.from('deis_forensic_reports').select('*');
      if (rptData && rptData.length > 0) {
        store.state.forensicReports = rptData.map(r => ({
          reportId: r.report_id,
          evidenceId: r.evidence_id,
          caseNumber: r.case_number,
          title: r.title,
          examinerName: r.examiner_name,
          examinerBadge: r.examiner_badge,
          laboratoryName: r.laboratory_name,
          authorAgencyId: r.author_agency_id,
          examinationDate: r.examination_date,
          hardwareProfile: r.hardware_profile,
          toolChain: r.tool_chain,
          findings: r.findings,
          conclusion: r.conclusion,
          integrityVerified: r.integrity_verified,
          reportSignature: r.report_signature
        }));
      }

      store.saveState();
      this.lastSyncTime = new Date().toISOString();
      this.isConnected = true;
      this.isSyncing = false;
      this.updateStatusBadge();
      return { success: true, message: 'Loaded live data from Supabase Cloud Database!' };
    } catch (err) {
      this.isSyncing = false;
      this.updateStatusBadge();
      console.error('DEIS Supabase: Cloud fetch failed', err);
      return { success: false, message: `Fetch failed: ${err.message}` };
    }
  }

  /**
   * Async sync a single newly created case to cloud
   */
  async syncSingleCase(caseObj) {
    if (!this.isConfigured()) return;
    try {
      await this.client.from('deis_cases').upsert({
        id: caseObj.id,
        case_number: caseObj.caseNumber,
        title: caseObj.title,
        category: caseObj.category,
        lead_agency: caseObj.leadAgency,
        lead_agency_name: caseObj.leadAgencyName,
        investigating_officer: caseObj.investigatingOfficer,
        court_jurisdiction: caseObj.courtJurisdiction,
        status: caseObj.status,
        opened_date: caseObj.openedDate,
        storage_folder: caseObj.storageFolder,
        description: caseObj.description
      });
    } catch (e) {
      console.warn('DEIS Supabase: Single case sync warning', e);
    }
  }

  /**
   * Async sync a single newly registered evidence exhibit
   */
  async syncSingleEvidence(ev) {
    if (!this.isConfigured()) return;
    try {
      await this.client.from('deis_evidence').upsert({
        id: ev.id,
        case_id: ev.caseId,
        case_number: ev.caseNumber,
        case_title: ev.caseTitle,
        title: ev.title,
        category: ev.category,
        file_type: ev.fileType,
        file_size: ev.fileSize,
        file_name: ev.fileName,
        stored_file_path: ev.storedFilePath,
        seizure_date: ev.seizureDate,
        seizure_location: ev.seizureLocation,
        source_device: ev.sourceDevice,
        current_custodian: ev.currentCustodian,
        custodian_agency: ev.custodianAgency,
        status: ev.status,
        sha256: ev.sha256,
        sha512: ev.sha512,
        digital_seal: ev.digitalSeal,
        classification: ev.classification,
        tags: ev.tags || [],
        notes: ev.notes
      });
    } catch (e) {
      console.warn('DEIS Supabase: Single evidence sync warning', e);
    }
  }

  /**
   * Update header badges & indicators across DEIS UI
   */
  updateStatusBadge() {
    const badge = document.getElementById('cloud-db-badge');
    if (!badge) return;

    if (this.isSyncing) {
      badge.className = 'px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer shadow-sm';
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin"></span><span>Supabase Syncing...</span>`;
    } else if (this.isConfigured() && this.isConnected) {
      badge.className = 'px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-900/60 transition shadow-sm';
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>⚡ Supabase Cloud Connected</span>`;
    } else if (this.isConfigured() && !this.isConnected) {
      badge.className = 'px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-[10px] font-mono text-amber-300 flex items-center gap-1.5 cursor-pointer hover:bg-amber-900/60 transition shadow-sm';
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span><span>⚠️ Supabase Configured (Unverified)</span>`;
    } else {
      badge.className = 'px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition shadow-sm';
      badge.innerHTML = `<i data-lucide="database" class="w-3 h-3 text-cyan-400"></i><span>Connect Free Supabase</span>`;
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }
}

// Global Singleton Instance
window.DEISSupabase = new DEISSupabaseManager();
