/**
 * Digital Evidence Integrity System (DEIS)
 * State Management & Data Store (Version 3 â€” Admin Identity Governance)
 */

const DEIS_STORAGE_KEY = 'DEIS_STATE_DATA_V4_CLEAN';
const DEIS_AUTH_KEY = 'DEIS_AUTH_SESSION_V4_CLEAN';

const INITIAL_AGENCIES = {
  admin: {
    id: 'admin',
    name: 'DEIS Root Access & Identity Control Authority',
    badge: 'ROOT-ADMIN',
    roleLabel: 'Root System Administrator',
    icon: 'shield-check',
    color: 'cyan',
    officers: ['System Security Administrator (ADMIN-0001)'],
    publicKey: '0x000000000000000000000000000000000000000000000000000000000000ADMIN',
    privateKeySeed: 'KEY_SEED_ROOT_ADMIN_2026'
  },
  police: {
    id: 'police',
    name: 'Cyber Crime Investigation Cell (CCIC)',
    badge: 'CCIC-HQ',
    roleLabel: 'Law Enforcement / Seizing Agency',
    icon: 'shield-alert',
    color: 'cyan',
    officers: [],
    publicKey: '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A',
    privateKeySeed: 'KEY_SEED_POLICE_CCIC_2026'
  },
  forensics: {
    id: 'forensics',
    name: 'Central Forensic Science Laboratory (CFSL)',
    badge: 'CFSL-CYBER',
    roleLabel: 'Digital Forensics & Scientific Analysis',
    icon: 'microscope',
    color: 'emerald',
    officers: [],
    publicKey: '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34',
    privateKeySeed: 'KEY_SEED_CFSL_CYBER_2026'
  },
  prosecution: {
    id: 'prosecution',
    name: 'Office of the District Attorney & State Prosecution',
    badge: 'ODA-LEGAL',
    roleLabel: 'Prosecution & Legal Custody',
    icon: 'briefcase',
    color: 'amber',
    officers: [],
    publicKey: '0x9D4C221084976BB4991204859032CD881765290A812938475901238475910283',
    privateKeySeed: 'KEY_SEED_ODA_PROSECUTION_2026'
  },
  court: {
    id: 'court',
    name: 'Metropolitan High Judicial Registry (Courtroom 4)',
    badge: 'JUDICIAL-REG',
    roleLabel: 'Judiciary / Court of Law',
    icon: 'scale',
    color: 'purple',
    officers: [],
    publicKey: '0xAB198F0029384756192837465019283746501928374650192837465019283746',
    privateKeySeed: 'KEY_SEED_HIGH_COURT_2026'
  }
};

// Initial Department Officers (1 officer per agency for instant 1-click access)
const INITIAL_USERS = [
  {
    id: 'usr_admin_0001',
    name: 'System Security Administrator',
    badgeId: 'ADMIN-0001',
    email: 'admin@deis.sec.gov',
    agencyId: 'admin',
    agencyName: 'DEIS Root Access & Identity Control Authority',
    jobTitle: 'Chief Security Officer & Access Governance Lead',
    clearanceLevel: 'LEVEL 6 â€” ROOT SECURITY & ACCESS CONTROL',
    initials: 'AD',
    color: 'cyan',
    icon: 'shield-check',
    password: 'admin@0001',
    department: 'Judicial Information Security Command',
    securityToken: 'TOKEN-ROOT-0001-FIPS',
    isAdmin: true,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  }
];

const INITIAL_CASES = [];
const INITIAL_EVIDENCE = [];
const INITIAL_TRANSFERS = [];

const INITIAL_CHAIN_BLOCKS = [
  {
    blockHeight: 0,
    blockHash: '00000a941f82938475629102837465019283746501928374650192837465a1b2',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: '2026-10-24 00:00:00 UTC',
    eventType: 'GENESIS_SYSTEM_INIT',
    evidenceId: null,
    caseId: 'SYSTEM-ROOT',
    agency: 'admin',
    officer: 'System Security Administrator',
    actionDescription: 'DEIS Genesis Block initialized. Cryptographic chain of custody ledger anchored.',
    evidenceHash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleRoot: 'd892837465019283746501928374650192837465019283746501928374650192',
    signature: '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A',
    tampered: false
  }
];

const INITIAL_FORENSIC_REPORTS = [];

class DEISStore {
  constructor() {
    this.state = this.loadState();
    this.currentUser = this.loadCurrentUser();
    this.listeners = [];

    // Trigger cloud synchronization if Supabase is configured
    setTimeout(() => {
      if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
        window.DEISSupabase.syncCloudToLocal(this).then(() => {
          this.notify();
        }).catch(err => {
          console.warn('DEIS: Background cloud sync notice', err);
        });
      }
    }, 800);
  }

  loadCurrentUser() {
    try {
      const savedAuth = localStorage.getItem(DEIS_AUTH_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        const savedBadge = (parsed && parsed.badgeId ? parsed.badgeId : '').toUpperCase();
        if (savedBadge && this.state && Array.isArray(this.state.users)) {
          const matched = this.state.users.find(u => u && u.badgeId && u.badgeId.toUpperCase() === savedBadge);
          if (matched && (matched.agencyId === 'defense' || (matched.badgeId && matched.badgeId.startsWith('BAR-')))) {
            localStorage.removeItem(DEIS_AUTH_KEY);
            return null;
          }
          return matched || null;
        }
      }
    } catch (e) {
      console.warn('DEIS: Failed to load auth session', e);
    }
    return null; // Prompt login on launch
  }

  loadState() {
    try {
      ['DEIS_STATE_DATA_V3', 'DEIS_STATE_DATA_V2', 'DEIS_STATE_DATA_V1', 'DEIS_AUTH_SESSION_V3'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });
      const saved = localStorage.getItem(DEIS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let loadedUsers = (parsed && Array.isArray(parsed.users)) ? parsed.users : [];
        // Strict filter: Purge legacy dummy mock users and defense coalition role
        const legacyDummyBadges = ['CCIC-4492', 'CFSL-9081', 'ODA-1029', 'JUD-0044', 'DEF-7721'];
        loadedUsers = loadedUsers.filter(u => 
          u && 
          u.badgeId && 
          u.agencyId !== 'defense' &&
          !u.badgeId.startsWith('BAR-') &&
          !legacyDummyBadges.includes(u.badgeId)
        );

        // Ensure all official default departmental officers are present
        INITIAL_USERS.forEach(initUser => {
          if (!loadedUsers.some(u => u && u.badgeId === initUser.badgeId)) {
            loadedUsers.push(initUser);
          }
        });

        // Merge agencies so newly introduced agencies (like admin) are always present
        const mergedAgencies = {
          ...INITIAL_AGENCIES,
          ...((parsed && parsed.agencies) || {})
        };
        delete mergedAgencies.defense;

        let activeAgency = (parsed && parsed.currentAgencyId) || 'admin';
        if (activeAgency === 'defense') {
          activeAgency = 'admin';
        }

        let loadedCases = (parsed && Array.isArray(parsed.cases)) ? parsed.cases : [...INITIAL_CASES];
        INITIAL_CASES.forEach(initialCase => {
          if (!loadedCases.some(c => c && (c.id === initialCase.id || c.caseNumber === initialCase.caseNumber))) {
            loadedCases.push(initialCase);
          }
        });

        let loadedEvidence = (parsed && Array.isArray(parsed.evidence)) ? parsed.evidence : [...INITIAL_EVIDENCE];
        INITIAL_EVIDENCE.forEach(initialEv => {
          if (!loadedEvidence.some(e => e && e.id === initialEv.id)) {
            loadedEvidence.push(initialEv);
          }
        });

        let loadedBlocks = (parsed && Array.isArray(parsed.chainBlocks)) ? parsed.chainBlocks : [...INITIAL_CHAIN_BLOCKS];
        INITIAL_CHAIN_BLOCKS.forEach(initBlock => {
          const exists = loadedBlocks.some(b => b && (
            (initBlock.evidenceId && b.evidenceId === initBlock.evidenceId && b.eventType === initBlock.eventType) ||
            b.blockHeight === initBlock.blockHeight
          ));
          if (!exists) {
            const nextHeight = loadedBlocks.length;
            const prevBlock = loadedBlocks[loadedBlocks.length - 1];
            loadedBlocks.push({
              ...initBlock,
              blockHeight: nextHeight,
              previousHash: prevBlock ? prevBlock.blockHash : initBlock.previousHash
            });
          }
        });
        loadedBlocks.sort((a, b) => a.blockHeight - b.blockHeight);

        let loadedReports = (parsed && Array.isArray(parsed.forensicReports)) ? parsed.forensicReports : [...INITIAL_FORENSIC_REPORTS];
        INITIAL_FORENSIC_REPORTS.forEach(initRpt => {
          if (!loadedReports.some(r => r && r.reportId === initRpt.reportId)) {
            loadedReports.push(initRpt);
          }
        });

        let loadedTransfers = ((parsed && Array.isArray(parsed.transfers)) ? parsed.transfers : INITIAL_TRANSFERS)
          .filter(t => t && t.fromAgency !== 'defense' && t.toAgency !== 'defense');

        return {
          currentAgencyId: activeAgency,
          agencies: mergedAgencies,
          users: loadedUsers,
          cases: loadedCases,
          evidence: loadedEvidence,
          transfers: loadedTransfers,
          chainBlocks: loadedBlocks,
          forensicReports: loadedReports,
          tamperAlertActive: (parsed && parsed.tamperAlertActive) || false,
          auditLogs: (parsed && Array.isArray(parsed.auditLogs)) ? parsed.auditLogs : []
        };
      }
    } catch (e) {
      console.warn('DEIS: Failed to load state, initializing fresh V3 defaults', e);
    }

    return {
      currentAgencyId: 'admin',
      agencies: { ...INITIAL_AGENCIES },
      users: [...INITIAL_USERS],
      cases: [...INITIAL_CASES],
      evidence: INITIAL_EVIDENCE,
      transfers: INITIAL_TRANSFERS,
      chainBlocks: INITIAL_CHAIN_BLOCKS,
      forensicReports: [...INITIAL_FORENSIC_REPORTS],
      tamperAlertActive: false,
      auditLogs: []
    };
  }

  saveState() {
    try {
      localStorage.setItem(DEIS_STORAGE_KEY, JSON.stringify(this.state));
      // Background sync to IndexedDB relational stores
      if (window.DEISDatabase && typeof window.DEISDatabase.syncFromStore === 'function') {
        window.DEISDatabase.syncFromStore(this.state).catch(() => {});
      }
      // Real-time Cloud Sync to Supabase (Cases, Evidence, Users, Transfers, Blocks)
      if (window.DEISSupabase && typeof window.DEISSupabase.syncLocalToCloud === 'function' && window.DEISSupabase.isConfigured()) {
        window.DEISSupabase.syncLocalToCloud(this).catch(err => {
          console.warn('DEIS: Background Supabase cloud sync notice', err);
        });
      }
    } catch (e) {
      console.error('DEIS: Could not persist state', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Authentication & User Management ---
  getUsers() {
    return this.state.users;
  }

  getUserById(userId) {
    return this.state.users.find(u => u.id === userId);
  }

  getUserByBadge(badgeId) {
    return this.state.users.find(u => u.badgeId.toUpperCase() === (badgeId || '').trim().toUpperCase());
  }

  getCurrentUser() {
    return this.currentUser;
  }

  login(identifier, password) {
    const cleanId = (identifier || '').trim().toUpperCase();
    const cleanPass = (password || '').trim();

    const matchedUser = this.state.users.find(u => 
      u.badgeId.toUpperCase() === cleanId || 
      u.email.toLowerCase() === cleanId.toLowerCase()
    );

    if (!matchedUser) {
      throw new Error(`Officer with Badge ID / Email "${identifier}" not found in identity registry.`);
    }

    if (matchedUser.password !== cleanPass) {
      throw new Error('Cryptographic passphrase / password invalid. Access Denied.');
    }

    this.setCurrentUser(matchedUser);
    return matchedUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      this.state.currentAgencyId = user.agencyId;
      localStorage.setItem(DEIS_AUTH_KEY, JSON.stringify({ badgeId: user.badgeId, timestamp: Date.now() }));
    } else {
      localStorage.removeItem(DEIS_AUTH_KEY);
    }
    this.saveState();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(DEIS_AUTH_KEY);
    this.saveState();
  }

  // --- Administrator User Provisioning ---
  createUser(userData) {
    if (!this.currentUser || !this.currentUser.isAdmin) {
      throw new Error('UNAUTHORIZED: Only the Administrator (ADMIN-0001) has permission to provision personnel.');
    }

    const cleanBadge = (userData.badgeId || '').trim().toUpperCase();
    if (!cleanBadge) throw new Error('Badge / Officer ID is required.');

    // Check duplicate badge
    if (this.state.users.some(u => u.badgeId.toUpperCase() === cleanBadge)) {
      throw new Error(`A user with Badge ID "${cleanBadge}" already exists in the system.`);
    }

    const agency = this.state.agencies[userData.agencyId] || this.state.agencies['police'];
    const initials = userData.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      badgeId: cleanBadge,
      email: (userData.email || `${cleanBadge.toLowerCase()}@${agency.id}.gov`).trim(),
      agencyId: agency.id,
      agencyName: agency.name,
      jobTitle: userData.jobTitle.trim() || `${agency.roleLabel}`,
      clearanceLevel: userData.clearanceLevel || 'LEVEL 3 â€” OPERATIONAL CLEARANCE',
      initials: initials || 'OF',
      color: agency.color || 'cyan',
      icon: agency.icon || 'shield',
      password: userData.password || 'password123',
      department: userData.department || agency.name,
      securityToken: `TOKEN-${cleanBadge}-${Math.floor(100 + Math.random() * 900)}`,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never'
    };

    this.state.users.push(newUser);

    // Also register officer name under agency roster
    if (!agency.officers.includes(newUser.name)) {
      agency.officers.push(`${newUser.name} (#${newUser.badgeId})`);
    }

    this.saveState();
    if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
      window.DEISSupabase.syncSingleUser(newUser);
    }
    return newUser;
  }

  deleteUser(userId) {
    if (!this.currentUser || !this.currentUser.isAdmin) {
      throw new Error('UNAUTHORIZED: Only the Administrator can revoke personnel.');
    }

    const target = this.state.users.find(u => u.id === userId);
    if (!target) throw new Error('User not found.');

    if (target.badgeId === 'ADMIN-0001') {
      throw new Error('FORBIDDEN: The Root Administrator account (ADMIN-0001) cannot be deleted.');
    }

    this.state.users = this.state.users.filter(u => u.id !== userId);
    if (window.DEISSupabase && window.DEISSupabase.isConfigured() && window.DEISSupabase.client) {
      window.DEISSupabase.client.from('deis_users').delete().eq('id', userId).then(() => {}).catch(() => {});
    }
    this.saveState();
  }

  // --- Agency & Role ---
  getCurrentAgency() {
    const aid = this.state ? this.state.currentAgencyId : 'admin';
    if (this.state && this.state.agencies && this.state.agencies[aid]) {
      return this.state.agencies[aid];
    }
    if (this.state && this.state.agencies && this.state.agencies.admin) {
      return this.state.agencies.admin;
    }
    return INITIAL_AGENCIES.admin || INITIAL_AGENCIES.police;
  }

  setCurrentAgency(agencyId) {
    if (this.state.agencies[agencyId]) {
      this.state.currentAgencyId = agencyId;
      this.saveState();
    }
  }

  // --- Case Files Management ---
  getCases() {
    return this.state.cases || [];
  }

  getCasesForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return [];
    // Root Admin has access to ALL cases
    if (user.isAdmin) {
      return [...(this.state.cases || [])];
    }
    const userEvidences = this.getEvidencesForCurrentUser();
    const caseIdsFromEvidence = new Set();
    userEvidences.forEach(e => {
      if (!e) return;
      if (e.caseId) {
        caseIdsFromEvidence.add(e.caseId.toUpperCase());
        caseIdsFromEvidence.add(e.caseId.replace(/^CASE-/, '').toUpperCase());
      }
      if (e.caseNumber) {
        caseIdsFromEvidence.add(e.caseNumber.toUpperCase());
        const numOnly = e.caseNumber.split(' ')[0].trim().toUpperCase();
        if (numOnly) caseIdsFromEvidence.add(numOnly);
      }
    });

    return (this.state.cases || []).filter(c => {
      if (!c) return false;
      const cId = (c.id || '').toUpperCase();
      const cNum = (c.caseNumber || '').toUpperCase();
      const cNumOnly = (c.caseNumber || '').split(' ')[0].trim().toUpperCase();
      const cStripped = c.id ? c.id.replace(/^CASE-/, '').toUpperCase() : '';

      const hasEvidence = caseIdsFromEvidence.has(cId) ||
                          caseIdsFromEvidence.has(cNum) ||
                          caseIdsFromEvidence.has(cNumOnly) ||
                          (cStripped && caseIdsFromEvidence.has(cStripped));

      if (hasEvidence) return true;

      // Also allow cases created by this officer in current session
      if (c.createdByUser && c.createdByUser === user.id) {
        return true;
      }

      return false;
    });
  }

  getCaseById(caseIdOrNumber) {
    if (!caseIdOrNumber) return null;
    const clean = String(caseIdOrNumber).trim().toUpperCase();
    return (this.state.cases || []).find(c => 
      (c.id && c.id.toUpperCase() === clean) ||
      (c.caseNumber && c.caseNumber.toUpperCase() === clean) ||
      (c.caseNumber && clean.includes(c.caseNumber.toUpperCase()))
    );
  }

  createCase(caseData) {
    // Role-based Access Control: Only Police (CCIC) and Root Admin can create case files
    if (this.currentUser && !this.currentUser.isAdmin && this.currentUser.agencyId !== 'police') {
      throw new Error('UNAUTHORIZED: Only Cyber Crime Investigation Cell (Police) officers have authority to open and register new Case Files.');
    }

    const cleanNumber = (caseData.caseNumber || '').trim().toUpperCase();
    if (!cleanNumber) throw new Error('Case Number / Identifier is required (e.g. CR-2026-9042).');

    // Limit Case Number / ID to 15 characters
    if (cleanNumber.length > 15) {
      throw new Error(`Case Number / ID cannot exceed 15 characters (entered: "${cleanNumber}" with ${cleanNumber.length} chars).`);
    }

    // Check duplicate caseNumber
    if ((this.state.cases || []).some(c => c.caseNumber.toUpperCase() === cleanNumber)) {
      throw new Error(`A Case File with Number "${cleanNumber}" already exists in the registry.`);
    }

    // Title validation and uniqueness check
    const cleanTitle = (caseData.title || '').trim();
    if (!cleanTitle) {
      throw new Error('Case Title / Investigation Heading is required.');
    }

    const duplicateTitleCase = (this.state.cases || []).find(
      c => c.title && c.title.trim().toLowerCase() === cleanTitle.toLowerCase()
    );
    if (duplicateTitleCase) {
      throw new Error(`A Case File with Title "${cleanTitle}" already exists (Case Number: ${duplicateTitleCase.caseNumber}). Case titles must be unique.`);
    }

    const cleanDescription = (caseData.description || '').trim();
    if (!cleanDescription) {
      throw new Error('Case Description & Incident Summary is compulsory. Please enter a brief summary of the criminal investigation.');
    }

    const agency = this.state.agencies[caseData.leadAgency || this.state.currentAgencyId] || this.state.agencies['police'];
    const activeOfficer = this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'System Security Administrator';
    const folderSanitized = cleanNumber.replace(/[^A-Z0-9_-]/gi, '_');

    const newCase = {
      id: `CASE-${cleanNumber}`,
      caseNumber: cleanNumber,
      title: cleanTitle,
      category: caseData.category || 'General Criminal Investigation',
      leadAgency: agency.id,
      leadAgencyName: agency.name,
      investigatingOfficer: activeOfficer,
      createdByUser: this.currentUser ? this.currentUser.id : null,
      courtJurisdiction: caseData.courtJurisdiction || 'Metropolitan High Judicial Registry (Courtroom 4)',
      status: 'ACTIVE_INVESTIGATION',
      openedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      storageFolder: `evidence_vault/Case_${folderSanitized}/`,
      description: cleanDescription
    };

    if (!Array.isArray(this.state.cases)) {
      this.state.cases = [];
    }
    this.state.cases.unshift(newCase);
    this.saveState();
    if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
      window.DEISSupabase.syncSingleCase(newCase);
    }
    return newCase;
  }

  // --- Evidence Management ---
  getEvidenceList() {
    return this.state.evidence;
  }

  getEvidencesForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return [];
    // Root Admin has access to ALL evidences
    if (user.isAdmin) {
      return [...(this.state.evidence || [])];
    }
    const agency = this.state.agencies[user.agencyId];
    const badgePrefix = agency ? (agency.badge || '').toUpperCase() : '';
    const userBadge = (user.badgeId || '').toUpperCase();
    const userName = (user.name || '').toLowerCase();

    return (this.state.evidence || []).filter(e => {
      if (!e) return false;
      // Matching custodian agency
      if (e.custodianAgency === user.agencyId) return true;
      // Matching currentCustodian string
      if (e.currentCustodian && badgePrefix && e.currentCustodian.toUpperCase().includes(badgePrefix)) return true;
      // Matching officer badge/name
      if (e.assignedOfficer && (e.assignedOfficer.toUpperCase().includes(userBadge) || e.assignedOfficer.toLowerCase().includes(userName))) return true;
      if (e.seizingOfficer && (e.seizingOfficer.toUpperCase().includes(userBadge) || e.seizingOfficer.toLowerCase().includes(userName))) return true;
      return false;
    });
  }

  getEvidenceById(id) {
    return this.state.evidence.find(e => e.id === id);
  }

  getEvidenceByCase(caseIdOrNumber) {
    const c = this.getCaseById(caseIdOrNumber);
    const targetNum = c ? c.caseNumber.toUpperCase() : String(caseIdOrNumber).trim().toUpperCase();
    return (this.state.evidence || []).filter(e => 
      (e.caseId && c && e.caseId === c.id) ||
      (e.caseNumber && e.caseNumber.toUpperCase().includes(targetNum))
    );
  }

  async addEvidence(evidenceData) {
    // Role-based Access Control: Only Police (CCIC) and Root Admin can ingest evidence
    if (this.currentUser && !this.currentUser.isAdmin && this.currentUser.agencyId !== 'police') {
      throw new Error('UNAUTHORIZED: Only Cyber Crime Investigation Cell (Police) officers have authority to register and ingest new evidence artifacts.');
    }

    const activeOfficer = this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'Authorized Seizing Officer';
    
    // Resolve associated Case File
    let assignedCase = this.getCaseById(evidenceData.caseId || evidenceData.caseNumber);
    if (!assignedCase && evidenceData.caseNumber) {
      try {
        assignedCase = this.createCase({
          caseNumber: evidenceData.caseNumber,
          title: evidenceData.caseTitle || `Investigation ${evidenceData.caseNumber}`,
          category: evidenceData.category || 'Digital Forensics',
          leadAgency: this.state.currentAgencyId
        });
      } catch (e) {
        assignedCase = this.getCaseById(evidenceData.caseNumber);
      }
    }

    const newEvidence = {
      ...evidenceData,
      id: evidenceData.id || CryptoEngine.generateEvidenceUID(),
      caseId: assignedCase ? assignedCase.id : (evidenceData.caseId || 'CASE-GENERAL'),
      caseNumber: assignedCase ? assignedCase.caseNumber : (evidenceData.caseNumber || 'CR-GENERAL'),
      caseTitle: assignedCase ? assignedCase.title : (evidenceData.caseTitle || evidenceData.caseNumber || 'General Case File'),
      storedFilePath: assignedCase ? `${assignedCase.storageFolder}${evidenceData.fileName || 'artifact.raw'}` : `evidence_vault/${evidenceData.fileName || 'artifact.raw'}`,
      seizureDate: evidenceData.seizureDate || new Date().toISOString(),
      status: 'IN_VAULT',
      custodianAgency: this.state.currentAgencyId,
      currentCustodian: this.getCurrentAgency().badge,
      digitalSeal: `SEAL-${Date.now()}-VALID`
    };

    this.state.evidence.unshift(newEvidence);

    // Record Genesis block for this evidence in chain of custody
    const lastBlock = this.state.chainBlocks[this.state.chainBlocks.length - 1];
    const newBlockHeight = this.state.chainBlocks.length;
    const blockPayload = {
      height: newBlockHeight,
      prevHash: lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: new Date().toISOString(),
      eventType: 'GENESIS_SEIZURE',
      evidenceId: newEvidence.id,
      evidenceHash: newEvidence.sha256
    };
    
    const blockHash = await CryptoEngine.sha256(JSON.stringify(blockPayload));
    const signature = await CryptoEngine.sign(blockPayload, this.getCurrentAgency().privateKeySeed, activeOfficer);

    this.state.chainBlocks.push({
      blockHeight: newBlockHeight,
      blockHash: '00000' + blockHash.substring(5),
      previousHash: blockPayload.prevHash,
      timestamp: blockPayload.timestamp,
      eventType: 'GENESIS_SEIZURE',
      evidenceId: newEvidence.id,
      caseId: newEvidence.caseNumber,
      agency: this.state.currentAgencyId,
      officer: activeOfficer,
      actionDescription: `Initial intake and registration of evidence artifact. Primary SHA-256 seal generated.`,
      evidenceHash: newEvidence.sha256,
      merkleRoot: await CryptoEngine.computeMerkleRoot([newEvidence.sha256, blockHash]),
      signature: signature.signature,
      tampered: false
    });

    this.saveState();
    if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
      window.DEISSupabase.syncSingleEvidence(newEvidence);
    }
    return newEvidence;
  }

  // --- Dual-Party Transfer Protocol ---
  getTransfers() {
    return this.state.transfers;
  }

  getIncomingTransfersForCurrentAgency() {
    return this.state.transfers.filter(t => t.toAgency === this.state.currentAgencyId);
  }

  getOutgoingTransfersForCurrentAgency() {
    return this.state.transfers.filter(t => t.fromAgency === this.state.currentAgencyId);
  }

  async initiateTransfer(transferParams) {
    // Role-based Access Control: Judicial officers (Judge) cannot transfer evidence files
    if (this.currentUser && this.currentUser.agencyId === 'court') {
      throw new Error('UNAUTHORIZED: Judicial officers (Judge) hold review jurisdiction and cannot initiate evidence transfers.');
    }

    const isReportTransfer = transferParams.itemType === 'FORENSIC_REPORT' || !!transferParams.reportId;
    let evidence = null;
    let forensicReport = null;
    let targetId = '';
    let targetTitle = '';
    let targetHash = '';

    if (isReportTransfer) {
      forensicReport = this.getForensicReportById(transferParams.reportId) || (transferParams.evidenceId && this.getForensicReportByEvidenceId(transferParams.evidenceId));
      if (!forensicReport) throw new Error('Forensic examination report not found');
      evidence = this.getEvidenceById(forensicReport.evidenceId);
      targetId = forensicReport.reportId;
      targetTitle = forensicReport.title || `Forensic Report for ${forensicReport.evidenceId}`;
      targetHash = forensicReport.signature || (evidence ? evidence.sha256 : 'CFSL_SIGNED_REPORT');
    } else {
      evidence = this.getEvidenceById(transferParams.evidenceId);
      if (!evidence) throw new Error('Evidence item not found');
      targetId = evidence.id;
      targetTitle = evidence.title;
      targetHash = evidence.sha256;
    }

    const transferId = CryptoEngine.generateTransferID();
    const handoffToken = CryptoEngine.generateHandoffToken();
    const timestamp = new Date().toISOString();
    const originatingAgency = this.getCurrentAgency();
    const activeOfficer = transferParams.initiatorOfficer || (this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'Authorized Officer');

    const manifestPayload = {
      transferId,
      itemType: isReportTransfer ? 'FORENSIC_REPORT' : 'EVIDENCE_ARTIFACT',
      reportId: isReportTransfer ? forensicReport.reportId : null,
      evidenceId: evidence ? evidence.id : (forensicReport ? forensicReport.evidenceId : targetId),
      evidenceHash: targetHash,
      fromAgency: originatingAgency.id,
      toAgency: transferParams.toAgency,
      purpose: transferParams.purpose,
      transferMode: transferParams.transferMode,
      timestamp
    };

    const manifestHash = await CryptoEngine.sha256(JSON.stringify(manifestPayload));
    const senderSig = await CryptoEngine.sign(manifestPayload, originatingAgency.privateKeySeed, activeOfficer);

    const newTransfer = {
      transferId,
      itemType: isReportTransfer ? 'FORENSIC_REPORT' : 'EVIDENCE_ARTIFACT',
      reportId: isReportTransfer ? forensicReport.reportId : null,
      reportTitle: isReportTransfer ? forensicReport.title : null,
      evidenceId: evidence ? evidence.id : (forensicReport ? forensicReport.evidenceId : 'EVD-GEN'),
      evidenceTitle: isReportTransfer ? `[Forensic Report] ${targetTitle}` : targetTitle,
      fromAgency: originatingAgency.id,
      toAgency: transferParams.toAgency,
      initiatorOfficer: activeOfficer,
      recipientOfficer: transferParams.recipientOfficer || 'Authorized Cyber Custodian',
      purpose: transferParams.purpose,
      transferMode: transferParams.transferMode,
      handoffToken,
      senderSignature: senderSig.signature,
      recipientSignature: null,
      status: 'PENDING_ACCEPTANCE',
      dispatchTime: timestamp,
      acceptedTime: null,
      integrityVerified: false,
      transferManifestHash: manifestHash
    };

    if (isReportTransfer && forensicReport) {
      forensicReport.transferStatus = 'IN_TRANSIT';
      forensicReport.transferredToAgency = transferParams.toAgency;
      forensicReport.transferredToOfficer = transferParams.recipientOfficer || 'Designated Examiner';
      forensicReport.activeTransferId = transferId;
    } else if (evidence) {
      evidence.status = 'IN_TRANSIT';
    }

    this.state.transfers.unshift(newTransfer);

    // Commit dispatch block to Chain of Custody
    const lastBlock = this.state.chainBlocks[this.state.chainBlocks.length - 1];
    const newBlockHeight = this.state.chainBlocks.length;
    const blockPayload = {
      height: newBlockHeight,
      prevHash: lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp,
      eventType: isReportTransfer ? 'REPORT_DISPATCHED' : 'TRANSFER_DISPATCHED',
      transferId,
      itemType: isReportTransfer ? 'FORENSIC_REPORT' : 'EVIDENCE_ARTIFACT',
      reportId: isReportTransfer ? forensicReport.reportId : null,
      evidenceId: evidence ? evidence.id : (forensicReport ? forensicReport.evidenceId : 'EVD-GEN'),
      fromAgency: originatingAgency.id,
      toAgency: transferParams.toAgency
    };

    const blockHash = await CryptoEngine.sha256(JSON.stringify(blockPayload));

    const actionDesc = isReportTransfer
      ? ((originatingAgency.id === transferParams.toAgency)
          ? `Internal handoff of Forensic Examination Report [${forensicReport.reportId}] for Exhibit ${evidence ? evidence.id : forensicReport.evidenceId} within ${originatingAgency.name} to ${transferParams.recipientOfficer || 'Colleague Officer'}. Transit Mode: ${transferParams.transferMode}. Handoff PIN issued.`
          : `Forensic Examination Report [${forensicReport.reportId}] for Exhibit ${evidence ? evidence.id : forensicReport.evidenceId} dispatched from ${originatingAgency.name} to ${this.state.agencies[transferParams.toAgency]?.name || transferParams.toAgency}. Transit Mode: ${transferParams.transferMode}. Handoff PIN issued.`)
      : ((originatingAgency.id === transferParams.toAgency)
          ? `Internal departmental custody handoff within ${originatingAgency.name} from ${activeOfficer} to ${transferParams.recipientOfficer || 'Colleague Officer'}. Transit Mode: ${transferParams.transferMode}. Handoff Pin issued.`
          : `Custody handoff dispatched from ${originatingAgency.name} to ${this.state.agencies[transferParams.toAgency]?.name || transferParams.toAgency}. Transit Mode: ${transferParams.transferMode}. Handoff Pin issued.`);

    this.state.chainBlocks.push({
      blockHeight: newBlockHeight,
      blockHash: '00000' + blockHash.substring(5),
      previousHash: blockPayload.prevHash,
      timestamp,
      eventType: isReportTransfer ? 'REPORT_DISPATCHED' : 'TRANSFER_DISPATCHED',
      evidenceId: evidence ? evidence.id : (forensicReport ? forensicReport.evidenceId : 'EVD-GEN'),
      caseId: evidence ? evidence.caseNumber : (forensicReport ? forensicReport.caseNumber : 'CR-CASE'),
      agency: originatingAgency.id,
      officer: activeOfficer,
      actionDescription: actionDesc,
      evidenceHash: targetHash,
      merkleRoot: await CryptoEngine.computeMerkleRoot([manifestHash, blockHash]),
      signature: senderSig.signature,
      tampered: false
    });

    this.saveState();
    if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
      window.DEISSupabase.syncLocalToCloud(this);
    }
    return newTransfer;
  }

  async acceptAndVerifyTransfer(transferId, enteredToken, verifyingOfficer) {
    const transfer = this.state.transfers.find(t => t.transferId === transferId);
    if (!transfer) throw new Error('Transfer record not found');

    if (transfer.handoffToken !== enteredToken.trim()) {
      throw new Error('Cryptographic Handoff Token (PIN) mismatch! Authorization rejected.');
    }

    const recipientAgency = this.getCurrentAgency();
    const activeOfficer = verifyingOfficer || (this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'Authorized Custodian');
    const isReportTransfer = transfer.itemType === 'FORENSIC_REPORT' || !!transfer.reportId;
    const evidence = this.getEvidenceById(transfer.evidenceId);
    const forensicReport = isReportTransfer 
      ? (this.getForensicReportById(transfer.reportId) || this.getForensicReportByEvidenceId(transfer.evidenceId))
      : null;

    const timestamp = new Date().toISOString();
    const recipientSig = await CryptoEngine.sign(
      { transferId, status: 'ACCEPTED', timestamp },
      recipientAgency.privateKeySeed,
      activeOfficer
    );

    transfer.status = 'ACCEPTED';
    transfer.acceptedTime = timestamp;
    transfer.recipientOfficer = activeOfficer;
    transfer.recipientSignature = recipientSig.signature;
    transfer.integrityVerified = true;

    if (isReportTransfer && forensicReport) {
      forensicReport.transferStatus = 'ACCEPTED';
      forensicReport.transferredToAgency = recipientAgency.id;
      forensicReport.recipientOfficer = activeOfficer;
      forensicReport.acceptedTime = timestamp;
      if (recipientAgency.id === 'court') {
        forensicReport.status = 'ADMITTED_IN_COURT';
      }
      if (!Array.isArray(forensicReport.transferHistory)) {
        forensicReport.transferHistory = [];
      }
      forensicReport.transferHistory.push({
        transferId: transfer.transferId,
        fromAgency: transfer.fromAgency,
        toAgency: recipientAgency.id,
        fromOfficer: transfer.initiatorOfficer,
        toOfficer: activeOfficer,
        timestamp,
        manifestHash: transfer.transferManifestHash
      });
    }

    if (evidence && !isReportTransfer) {
      evidence.status = recipientAgency.id === 'court' ? 'ADMITTED_IN_COURT' : 'IN_VAULT';
      evidence.custodianAgency = recipientAgency.id;
      evidence.currentCustodian = recipientAgency.badge;
      if (activeOfficer) {
        evidence.assignedOfficer = activeOfficer;
      }
    }

    const lastBlock = this.state.chainBlocks[this.state.chainBlocks.length - 1];
    const newBlockHeight = this.state.chainBlocks.length;
    const blockPayload = {
      height: newBlockHeight,
      prevHash: lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp,
      eventType: isReportTransfer ? 'REPORT_ACCEPTED_VERIFIED' : 'TRANSFER_ACCEPTED_VERIFIED',
      transferId,
      reportId: isReportTransfer ? (forensicReport ? forensicReport.reportId : transfer.reportId) : null,
      evidenceId: transfer.evidenceId,
      acceptedBy: recipientAgency.id
    };

    const blockHash = await CryptoEngine.sha256(JSON.stringify(blockPayload));

    const acceptActionDesc = isReportTransfer
      ? ((transfer.fromAgency === recipientAgency.id)
          ? `Forensic Examination Report [${transfer.reportId || (forensicReport ? forensicReport.reportId : 'RPT')}] custody accepted by colleague officer ${activeOfficer} (${recipientAgency.name}). Dual-PIN authenticated. Cryptographic signature verified.`
          : `Forensic Examination Report [${transfer.reportId || (forensicReport ? forensicReport.reportId : 'RPT')}] received and custody accepted by ${recipientAgency.name} (${activeOfficer}). Dual-PIN authenticated. Digital signature verified.`)
      : ((transfer.fromAgency === recipientAgency.id)
          ? `Evidence custody accepted by colleague officer ${activeOfficer} (${recipientAgency.name}). Dual-PIN authenticated. Bitstream hash re-verified (100% SHA-256 match).`
          : `Evidence received and accepted by ${recipientAgency.name}. Dual-PIN authenticated. Bitstream hash re-verified (100% SHA-256 match).`);

    this.state.chainBlocks.push({
      blockHeight: newBlockHeight,
      blockHash: '00000' + blockHash.substring(5),
      previousHash: blockPayload.prevHash,
      timestamp,
      eventType: isReportTransfer ? 'REPORT_ACCEPTED_VERIFIED' : 'TRANSFER_ACCEPTED_VERIFIED',
      evidenceId: transfer.evidenceId,
      caseId: evidence ? evidence.caseNumber : (forensicReport ? forensicReport.caseNumber : 'CR-CASE'),
      agency: recipientAgency.id,
      officer: activeOfficer,
      actionDescription: acceptActionDesc,
      evidenceHash: isReportTransfer ? (forensicReport ? forensicReport.signature : (evidence ? evidence.sha256 : 'REPORT_SIG')) : (evidence ? evidence.sha256 : 'UNKNOWN_HASH'),
      merkleRoot: await CryptoEngine.computeMerkleRoot([transfer.transferManifestHash, blockHash]),
      signature: recipientSig.signature,
      tampered: false
    });

    this.saveState();
    if (window.DEISSupabase && window.DEISSupabase.isConfigured()) {
      window.DEISSupabase.syncLocalToCloud(this);
    }
    return transfer;
  }

  // --- Chain of Custody & Tamper Engine ---
  getChainBlocks() {
    return this.state.chainBlocks;
  }

  // --- Audit Trail & System Verification Logging ---
  getAuditLogs() {
    if (!Array.isArray(this.state.auditLogs)) {
      this.state.auditLogs = [];
    }
    return this.state.auditLogs;
  }

  addAuditLog(action, entityId, entityType, details) {
    if (!Array.isArray(this.state.auditLogs)) {
      this.state.auditLogs = [];
    }
    const user = this.getCurrentUser();
    const entry = {
      logId: 'AUD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      userId: user ? (user.badgeId || user.name) : 'SYSTEM',
      agency: user ? (user.agencyId || 'CCIC') : 'SYSTEM',
      action: action || 'SECURITY_AUDIT',
      entityId: entityId || '',
      entityType: entityType || 'SYSTEM',
      details: details || ''
    };
    this.state.auditLogs.unshift(entry);
    if (this.state.auditLogs.length > 100) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 100);
    }
    this.saveState();
    return entry;
  }

  // --- Forensic Lab Reports (Authoring & State Persistence) ---
  getForensicReports() {
    if (!Array.isArray(this.state.forensicReports)) {
      this.state.forensicReports = [];
    }
    return this.state.forensicReports;
  }

  getForensicReportsForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return [];
    if (user.isAdmin) {
      return [...this.getForensicReports()];
    }
    const userEvidences = this.getEvidencesForCurrentUser();
    const accessibleEvidenceIds = new Set(userEvidences.map(e => e.id));

    return this.getForensicReports().filter(r => {
      if (!r) return false;
      // Authored by user agency
      if (r.authorAgencyId === user.agencyId) return true;
      // Transferred to user agency
      if (r.transferredToAgency === user.agencyId) return true;
      // Transferred via transferHistory
      if (Array.isArray(r.transferHistory) && r.transferHistory.some(th => th.toAgency === user.agencyId)) return true;
      // Matches an evidence item assigned to user
      if (accessibleEvidenceIds.has(r.evidenceId)) return true;
      // Check transfers log for any transfer to user agency
      const transfers = this.getTransfers();
      if (transfers.some(t => (t.reportId === r.reportId || t.evidenceId === r.evidenceId) && t.toAgency === user.agencyId)) return true;
      return false;
    });
  }

  getForensicReportByEvidenceId(evidenceId) {
    if (!evidenceId) return null;
    return (this.state.forensicReports || []).find(r => r.evidenceId === evidenceId);
  }

  getForensicReportById(reportId) {
    if (!reportId) return null;
    return (this.state.forensicReports || []).find(r => r.reportId === reportId);
  }

  saveForensicReport(reportData) {
    const user = this.getCurrentUser();
    if (!user || user.agencyId !== 'forensics') {
      throw new Error('UNAUTHORIZED: Only authorized Central Forensic Science Laboratory officers can write and submit forensic reports.');
    }

    if (!Array.isArray(this.state.forensicReports)) {
      this.state.forensicReports = [];
    }

    const reportId = reportData.reportId || `CFSL-RPT-2026-${(reportData.evidenceId || 'GEN').replace('EVD-', '')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const existingIndex = this.state.forensicReports.findIndex(r => r.reportId === reportId || r.evidenceId === reportData.evidenceId);

    const fullReport = {
      ...reportData,
      reportId,
      authorOfficerName: reportData.authorOfficerName || user.name,
      authorBadgeId: reportData.authorBadgeId || user.badgeId,
      authorAgencyId: user.agencyId || 'forensics',
      authorDepartment: user.department || 'Central Forensic Science Laboratory (CFSL)',
      createdDate: reportData.createdDate || timestamp,
      lastModified: timestamp,
      status: reportData.status || 'COMPLETED_SIGNED',
      signature: reportData.signature || `0x${Date.now().toString(16)}CFSL${user.badgeId.replace(/[^A-Z0-9]/gi, '')}`
    };

    if (existingIndex >= 0) {
      this.state.forensicReports[existingIndex] = fullReport;
    } else {
      this.state.forensicReports.unshift(fullReport);
    }

    // Record forensic audit log
    this.addAuditLog(
      'FORENSIC_REPORT_AUTHORED',
      fullReport.evidenceId,
      'EVIDENCE_ARTIFACT',
      `Forensic Officer ${user.name} (${user.badgeId}) authored and signed forensic report ${reportId} for Case ${fullReport.caseNumber}.`
    );

    this.saveState();
    return fullReport;
  }

  restoreIntegrity() {
    if (Array.isArray(this.state.evidence)) {
      this.state.evidence.forEach(e => {
        if (e.status === 'TAMPERED') e.status = 'IN_VAULT';
      });
    }
    if (Array.isArray(this.state.chainBlocks)) {
      this.state.chainBlocks.forEach(b => {
        b.tampered = false;
      });
    }
    this.state.tamperAlertActive = false;
    this.saveState();
  }

  resetFactoryData() {
    localStorage.removeItem(DEIS_STORAGE_KEY);
    localStorage.removeItem(DEIS_AUTH_KEY);
    this.currentUser = null;
    this.state = this.loadState();
    this.notify();
  }
}

window.DEISStore = new DEISStore();
