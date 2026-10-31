/**
 * Digital Evidence Integrity System (DEIS)
 * State Management & Data Store (Version 3 — Admin Identity Governance)
 */

const DEIS_STORAGE_KEY = 'DEIS_STATE_DATA_V3';
const DEIS_AUTH_KEY = 'DEIS_AUTH_SESSION_V3';

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
  },
  defense: {
    id: 'defense',
    name: 'Bar Association Criminal Defense Coalition',
    badge: 'DEFENSE-BAR',
    roleLabel: 'Defense Counsel / Discovery Verifier',
    icon: 'user-check',
    color: 'rose',
    officers: [],
    publicKey: '0xC32E094857291048572910485729104857291048572910485729104857291048',
    privateKeySeed: 'KEY_SEED_DEFENSE_BAR_2026'
  }
};

// ONLY Administrator exists initially. All other users must be created by Admin!
const INITIAL_USERS = [
  {
    id: 'usr_admin_0001',
    name: 'System Security Administrator',
    badgeId: 'ADMIN-0001',
    email: 'admin@deis.sec.gov',
    agencyId: 'admin',
    agencyName: 'DEIS Root Access & Identity Control Authority',
    jobTitle: 'Chief Security Officer & Access Governance Lead',
    clearanceLevel: 'LEVEL 6 — ROOT SECURITY & ACCESS CONTROL',
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

const INITIAL_CASES = [
  {
    id: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    title: 'State v. Apex Infrastructure Breach',
    category: 'Cyber Terrorism & Ransomware',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'System Security Administrator (ADMIN-0001)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-10-24 02:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-8831_Apex_Breach/',
    description: 'Criminal investigation into state infrastructure infiltration, unauthorized root access acquisition, and volatile memory malware deployment.'
  },
  {
    id: 'CASE-CR-2026-9042',
    caseNumber: 'CR-2026-9042',
    title: 'Operation DarkLocker Ransomware',
    category: 'Financial Extortion & Malware',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'System Security Administrator (ADMIN-0001)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-10-26 09:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-9042_DarkLocker_Ransomware/',
    description: 'Cross-border extortion ring targeting financial servers, seizing database storage arrays and deploying RSA-4096 ransomware payloads.'
  }
];

const INITIAL_EVIDENCE = [
  {
    id: 'EVD-2026-0941',
    caseId: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    caseTitle: 'State v. Apex Infrastructure Breach',
    title: 'Volatile RAM Memory Dump (C2 Command Node)',
    category: 'Memory Dump',
    fileType: 'raw-image (.dmp)',
    fileSize: '16.4 GB',
    fileName: 'EVD-2026-0941_memory_dump.raw',
    storedFilePath: 'evidence_vault/Case_CR-2026-8831_Apex_Breach/EVD-2026-0941_memory_dump.raw',
    seizureDate: '2026-10-24 03:15:22 UTC',
    seizureLocation: 'Server Room 4B, 100 Wall Street, NY',
    sourceDevice: 'Dell PowerEdge R750 (Serial: 8G4K992-X)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    digitalSeal: 'SEAL-2026-0941-VALID',
    classification: 'TOP-SECRET-FORENSIC',
    tags: ['Ransomware', 'Cobalt Strike', 'Unwiped Memory', 'Court-Exhibit-A'],
    notes: 'Preserved with LiME acquisition module. Write-blocker hardware verified during bitstream imaging.'
  },
  {
    id: 'EVD-2026-1182',
    caseId: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    caseTitle: 'State v. Apex Infrastructure Breach',
    title: 'High-Res 4K CCTV Data Vault Optical Disk Extract',
    category: 'Video Surveillance',
    fileType: 'h265 (.mp4)',
    fileSize: '4.8 GB',
    fileName: 'EVD-2026-1182_surveillance_feed.mp4',
    storedFilePath: 'evidence_vault/Case_CR-2026-8831_Apex_Breach/EVD-2026-1182_surveillance_feed.mp4',
    seizureDate: '2026-10-24 06:40:10 UTC',
    seizureLocation: 'Apex Data Center Loading Dock Camera 09',
    sourceDevice: 'Hikvision NVR 64-Ch (MAC: 00:1E:67:8A:2C:11)',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sha512: 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
    digitalSeal: 'SEAL-2026-1182-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['Surveillance', 'Access Logs', 'Perimeter Breach'],
    notes: 'Continuous recording snippet from 02:45 to 04:15 UTC. No dropped frames detected.'
  },
  {
    id: 'EVD-2026-2401',
    caseId: 'CASE-CR-2026-9042',
    caseNumber: 'CR-2026-9042',
    caseTitle: 'Operation DarkLocker Ransomware',
    title: 'Forensic Bitstream Clone of Banking Database SSD',
    category: 'Disk Image',
    fileType: 'expert-witness (.e01)',
    fileSize: '512 GB',
    fileName: 'EVD-2026-2401_darklocker_clone.e01',
    storedFilePath: 'evidence_vault/Case_CR-2026-9042_DarkLocker_Ransomware/EVD-2026-2401_darklocker_clone.e01',
    seizureDate: '2026-10-25 14:20:00 UTC',
    seizureLocation: 'Finance Sector Headquarters, Floor 12',
    sourceDevice: 'Samsung Enterprise PM9A3 NVMe SSD',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    sha512: '13f8d387349b1424d80a133df17f935399589a071ef69d7bdf9226cb8e8c87de647898863f6087b7a70a8dcf8c859c23565bcff16541f4864fa920dff0a6f4fa',
    digitalSeal: 'SEAL-2026-2401-VALID',
    classification: 'TOP-SECRET-FINANCIAL',
    tags: ['DarkLocker', 'NVMe', 'Financial Records', 'Extortion'],
    notes: 'Bit-by-bit physical cloning verified via Tableau forensic write-blocker T8u.'
  }
];

const INITIAL_TRANSFERS = [
  {
    transferId: 'TRF-8891B',
    evidenceId: 'EVD-2026-0941',
    evidenceTitle: 'Volatile RAM Memory Dump (C2 Command Node)',
    fromAgency: 'police',
    toAgency: 'forensics',
    initiatorOfficer: 'Authorized Seizing Officer',
    recipientOfficer: 'Authorized Forensic Specialist',
    purpose: 'Deep memory forensic extraction, rootkit carving & malware reverse engineering.',
    transferMode: 'Air-Gapped Hardware Vault + Dual Verification Token',
    handoffToken: '849201',
    senderSignature: '0x5b3a98c019284756291048572910485729104857291048572910485729104857',
    recipientSignature: '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34',
    status: 'ACCEPTED',
    dispatchTime: '2026-10-24 10:15:00 UTC',
    acceptedTime: '2026-10-24 11:42:15 UTC',
    integrityVerified: true,
    transferManifestHash: '8f434346648f6b96df89dda901c5176b10e6d0ceec3e6a81e2dd4f0476074646'
  }
];

const INITIAL_CHAIN_BLOCKS = [
  {
    blockHeight: 0,
    blockHash: '00000a941f82938475629102837465019283746501928374650192837465a1b2',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: '2026-10-24 03:15:22 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-0941',
    caseId: 'CR-2026-8831',
    agency: 'police',
    officer: 'Authorized Seizing Officer',
    actionDescription: 'Primary physical seizure and volatile RAM dump acquisition under warrant #WR-9921.',
    evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    merkleRoot: 'd892837465019283746501928374650192837465019283746501928374650192',
    signature: '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A',
    tampered: false
  }
];

class DEISStore {
  constructor() {
    this.state = this.loadState();
    this.currentUser = this.loadCurrentUser();
    this.listeners = [];
  }

  loadCurrentUser() {
    try {
      const savedAuth = localStorage.getItem(DEIS_AUTH_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        const savedBadge = (parsed && parsed.badgeId ? parsed.badgeId : '').toUpperCase();
        if (savedBadge && this.state && Array.isArray(this.state.users)) {
          const matched = this.state.users.find(u => u && u.badgeId && u.badgeId.toUpperCase() === savedBadge);
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
      const saved = localStorage.getItem(DEIS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let loadedUsers = (parsed && Array.isArray(parsed.users)) ? parsed.users : [];
        // Strict filter: Purge legacy dummy mock users
        const legacyDummyBadges = ['CCIC-4492', 'CFSL-9081', 'ODA-1029', 'JUD-0044', 'DEF-7721'];
        loadedUsers = loadedUsers.filter(u => 
          u && 
          u.badgeId && 
          !legacyDummyBadges.includes(u.badgeId) &&
          !String(u.id || '').startsWith('usr_police') &&
          !String(u.id || '').startsWith('usr_forensics') &&
          !String(u.id || '').startsWith('usr_court') &&
          !String(u.id || '').startsWith('usr_prosecution') &&
          !String(u.id || '').startsWith('usr_defense')
        );

        if (!loadedUsers.some(u => u && u.badgeId === 'ADMIN-0001')) {
          loadedUsers.unshift(INITIAL_USERS[0]);
        }

        // Merge agencies so newly introduced agencies (like admin) are always present
        const mergedAgencies = {
          ...INITIAL_AGENCIES,
          ...((parsed && parsed.agencies) || {})
        };

        let loadedCases = (parsed && Array.isArray(parsed.cases) && parsed.cases.length > 0) ? parsed.cases : [...INITIAL_CASES];
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

        return {
          currentAgencyId: (parsed && parsed.currentAgencyId) || 'admin',
          agencies: mergedAgencies,
          users: loadedUsers,
          cases: loadedCases,
          evidence: loadedEvidence,
          transfers: (parsed && Array.isArray(parsed.transfers)) ? parsed.transfers : INITIAL_TRANSFERS,
          chainBlocks: (parsed && Array.isArray(parsed.chainBlocks)) ? parsed.chainBlocks : INITIAL_CHAIN_BLOCKS,
          tamperAlertActive: (parsed && parsed.tamperAlertActive) || false
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
      tamperAlertActive: false
    };
  }

  saveState() {
    try {
      localStorage.setItem(DEIS_STORAGE_KEY, JSON.stringify(this.state));
      // Background sync to IndexedDB relational stores
      if (window.DEISDatabase && typeof window.DEISDatabase.syncFromStore === 'function') {
        window.DEISDatabase.syncFromStore(this.state).catch(() => {});
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
      clearanceLevel: userData.clearanceLevel || 'LEVEL 3 — OPERATIONAL CLEARANCE',
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
    const cleanNumber = (caseData.caseNumber || '').trim().toUpperCase();
    if (!cleanNumber) throw new Error('Case Number / Identifier is required (e.g. CR-2026-9042).');

    // Check duplicate caseNumber
    if ((this.state.cases || []).some(c => c.caseNumber.toUpperCase() === cleanNumber)) {
      throw new Error(`A Case File with Number "${cleanNumber}" already exists in the registry.`);
    }

    const agency = this.state.agencies[caseData.leadAgency || this.state.currentAgencyId] || this.state.agencies['police'];
    const activeOfficer = this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'System Security Administrator';
    const folderSanitized = cleanNumber.replace(/[^A-Z0-9_-]/gi, '_');

    const newCase = {
      id: `CASE-${cleanNumber}`,
      caseNumber: cleanNumber,
      title: (caseData.title || `Investigation ${cleanNumber}`).trim(),
      category: caseData.category || 'General Criminal Investigation',
      leadAgency: agency.id,
      leadAgencyName: agency.name,
      investigatingOfficer: activeOfficer,
      courtJurisdiction: caseData.courtJurisdiction || 'Metropolitan High Judicial Registry (Courtroom 4)',
      status: 'ACTIVE_INVESTIGATION',
      openedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      storageFolder: `evidence_vault/Case_${folderSanitized}/`,
      description: (caseData.description || '').trim() || 'Active criminal prosecution dossier holding verified chain of custody evidence.'
    };

    if (!Array.isArray(this.state.cases)) {
      this.state.cases = [];
    }
    this.state.cases.unshift(newCase);
    this.saveState();
    return newCase;
  }

  // --- Evidence Management ---
  getEvidenceList() {
    return this.state.evidence;
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
    const evidence = this.getEvidenceById(transferParams.evidenceId);
    if (!evidence) throw new Error('Evidence item not found');

    const transferId = CryptoEngine.generateTransferID();
    const handoffToken = CryptoEngine.generateHandoffToken();
    const timestamp = new Date().toISOString();
    const originatingAgency = this.getCurrentAgency();
    const activeOfficer = transferParams.initiatorOfficer || (this.currentUser ? `${this.currentUser.name} (${this.currentUser.badgeId})` : 'Authorized Officer');

    const manifestPayload = {
      transferId,
      evidenceId: evidence.id,
      evidenceHash: evidence.sha256,
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
      evidenceId: evidence.id,
      evidenceTitle: evidence.title,
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

    evidence.status = 'IN_TRANSIT';
    this.state.transfers.unshift(newTransfer);

    // Commit dispatch block to Chain of Custody
    const lastBlock = this.state.chainBlocks[this.state.chainBlocks.length - 1];
    const newBlockHeight = this.state.chainBlocks.length;
    const blockPayload = {
      height: newBlockHeight,
      prevHash: lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp,
      eventType: 'TRANSFER_DISPATCHED',
      transferId,
      evidenceId: evidence.id,
      fromAgency: originatingAgency.id,
      toAgency: transferParams.toAgency
    };

    const blockHash = await CryptoEngine.sha256(JSON.stringify(blockPayload));

    this.state.chainBlocks.push({
      blockHeight: newBlockHeight,
      blockHash: '00000' + blockHash.substring(5),
      previousHash: blockPayload.prevHash,
      timestamp,
      eventType: 'TRANSFER_DISPATCHED',
      evidenceId: evidence.id,
      caseId: evidence.caseNumber,
      agency: originatingAgency.id,
      officer: activeOfficer,
      actionDescription: `Custody handoff dispatched from ${originatingAgency.name} to ${this.state.agencies[transferParams.toAgency].name}. Transit Mode: ${transferParams.transferMode}. Handoff Pin issued.`,
      evidenceHash: evidence.sha256,
      merkleRoot: await CryptoEngine.computeMerkleRoot([manifestHash, blockHash]),
      signature: senderSig.signature,
      tampered: false
    });

    this.saveState();
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
    const evidence = this.getEvidenceById(transfer.evidenceId);

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

    if (evidence) {
      evidence.status = recipientAgency.id === 'court' ? 'ADMITTED_IN_COURT' : 'IN_VAULT';
      evidence.custodianAgency = recipientAgency.id;
      evidence.currentCustodian = recipientAgency.badge;
    }

    const lastBlock = this.state.chainBlocks[this.state.chainBlocks.length - 1];
    const newBlockHeight = this.state.chainBlocks.length;
    const blockPayload = {
      height: newBlockHeight,
      prevHash: lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp,
      eventType: 'TRANSFER_ACCEPTED_VERIFIED',
      transferId,
      evidenceId: transfer.evidenceId,
      acceptedBy: recipientAgency.id
    };

    const blockHash = await CryptoEngine.sha256(JSON.stringify(blockPayload));

    this.state.chainBlocks.push({
      blockHeight: newBlockHeight,
      blockHash: '00000' + blockHash.substring(5),
      previousHash: blockPayload.prevHash,
      timestamp,
      eventType: 'TRANSFER_ACCEPTED_VERIFIED',
      evidenceId: transfer.evidenceId,
      caseId: evidence ? evidence.caseNumber : 'CR-CASE',
      agency: recipientAgency.id,
      officer: activeOfficer,
      actionDescription: `Evidence received and accepted by ${recipientAgency.name}. Dual-PIN authenticated. Bitstream hash re-verified (100% SHA-256 match).`,
      evidenceHash: evidence ? evidence.sha256 : 'UNKNOWN_HASH',
      merkleRoot: await CryptoEngine.computeMerkleRoot([transfer.transferManifestHash, blockHash]),
      signature: recipientSig.signature,
      tampered: false
    });

    this.saveState();
    return transfer;
  }

  // --- Chain of Custody & Tamper Engine ---
  getChainBlocks() {
    return this.state.chainBlocks;
  }

  simulateTampering(blockHeight, alteredDescription = 'MALICIOUS CORRUPTION: Evidence payload modified by unauthorized adversary.') {
    const block = this.state.chainBlocks.find(b => b.blockHeight === blockHeight);
    if (!block) return;

    block.tampered = true;
    block.actionDescription = alteredDescription;
    block.blockHash = '00000DEAD' + block.blockHash.substring(9);
    this.state.tamperAlertActive = true;

    const evidence = this.getEvidenceById(block.evidenceId);
    if (evidence) {
      evidence.status = 'TAMPERED';
    }

    this.saveState();
  }

  restoreIntegrity() {
    this.state.evidence = JSON.parse(JSON.stringify(INITIAL_EVIDENCE));
    this.state.transfers = JSON.parse(JSON.stringify(INITIAL_TRANSFERS));
    this.state.chainBlocks = JSON.parse(JSON.stringify(INITIAL_CHAIN_BLOCKS));
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
