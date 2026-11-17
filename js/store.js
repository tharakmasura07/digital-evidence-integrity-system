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
    officers: ['System Security Administrator (ADMIN-0001)', 'Deputy Security Administrator (ADMIN-0002)'],
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
    officers: ['Insp. Vikram Singh Rathod (CCIC-7701)', 'Sub-Insp. Priya Sharma (CCIC-7702)'],
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
    officers: ['Dr. Aris Thorne (CFSL-4402)', 'Dr. Meera Nair (CFSL-4403)'],
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
    officers: ['Adv. Elena Vance (ODA-8831)', 'Adv. Siddharth Rao (ODA-8832)'],
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
    officers: ['Hon. Samuel Wright (JUD-1004)', 'Clerk Jonathan Miller (JUD-1005)'],
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
    clearanceLevel: 'LEVEL 6 - ROOT SECURITY & ACCESS CONTROL',
    initials: 'AD',
    color: 'cyan',
    icon: 'shield-check',
    password: 'admin@0001',
    department: 'Judicial Information Security Command',
    securityToken: 'TOKEN-ROOT-0001-FIPS',
    isAdmin: true,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_admin_0002',
    name: 'Deputy Security Administrator',
    badgeId: 'ADMIN-0002',
    email: 'deputy.admin@deis.sec.gov',
    agencyId: 'admin',
    agencyName: 'DEIS Root Access & Identity Control Authority',
    jobTitle: 'Deputy Identity Governance & Audit Lead',
    clearanceLevel: 'LEVEL 6 - ROOT SECURITY & ACCESS CONTROL',
    initials: 'DA',
    color: 'cyan',
    icon: 'shield-check',
    password: 'admin@0002',
    department: 'Judicial Information Security Command',
    securityToken: 'TOKEN-ROOT-0002-FIPS',
    isAdmin: true,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_police_7701',
    name: 'Insp. Vikram Singh Rathod',
    badgeId: 'CCIC-7701',
    email: 'rathod@ccic.gov',
    agencyId: 'police',
    agencyName: 'Cyber Crime Investigation Cell (CCIC)',
    jobTitle: 'Lead Cyber Investigator & Seizing Officer',
    clearanceLevel: 'LEVEL 3 - OPERATIONAL CLEARANCE',
    initials: 'VR',
    color: 'cyan',
    icon: 'shield-alert',
    password: 'police@123',
    department: 'Cyber Crime Investigation Cell (CCIC)',
    securityToken: 'TOKEN-CCIC-7701-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_police_7702',
    name: 'Sub-Insp. Priya Sharma',
    badgeId: 'CCIC-7702',
    email: 'priya@ccic.gov',
    agencyId: 'police',
    agencyName: 'Cyber Crime Investigation Cell (CCIC)',
    jobTitle: 'Cyber Forensics Field Seizing Officer',
    clearanceLevel: 'LEVEL 3 - OPERATIONAL CLEARANCE',
    initials: 'PS',
    color: 'blue',
    icon: 'badge-check',
    password: 'police@123',
    department: 'Cyber Crime Investigation Cell (CCIC)',
    securityToken: 'TOKEN-CCIC-7702-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_forensics_4402',
    name: 'Dr. Aris Thorne',
    badgeId: 'CFSL-4402',
    email: 'thorne@cfsl.gov',
    agencyId: 'forensics',
    agencyName: 'Central Forensic Science Laboratory (CFSL)',
    jobTitle: 'Chief Digital Forensic Examiner',
    clearanceLevel: 'LEVEL 5 - SCIENTIFIC & CRYPTOGRAPHIC',
    initials: 'AT',
    color: 'emerald',
    icon: 'microscope',
    password: 'forensics@123',
    department: 'Central Forensic Science Laboratory (CFSL)',
    securityToken: 'TOKEN-CFSL-4402-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_forensics_4403',
    name: 'Dr. Meera Nair',
    badgeId: 'CFSL-4403',
    email: 'nair@cfsl.gov',
    agencyId: 'forensics',
    agencyName: 'Central Forensic Science Laboratory (CFSL)',
    jobTitle: 'Senior Forensic Analyst & Cryptographic Examiner',
    clearanceLevel: 'LEVEL 5 - SCIENTIFIC & CRYPTOGRAPHIC',
    initials: 'MN',
    color: 'teal',
    icon: 'binary',
    password: 'forensics@123',
    department: 'Central Forensic Science Laboratory (CFSL)',
    securityToken: 'TOKEN-CFSL-4403-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_prosecution_8831',
    name: 'Adv. Elena Vance',
    badgeId: 'ODA-8831',
    email: 'vance@oda.gov',
    agencyId: 'prosecution',
    agencyName: 'Office of the District Attorney & State Prosecution',
    jobTitle: 'Special Public Prosecutor',
    clearanceLevel: 'LEVEL 4 - LEGAL CUSTODY & TRIAL',
    initials: 'EV',
    color: 'amber',
    icon: 'landmark',
    password: 'prosecution@123',
    department: 'Office of the District Attorney',
    securityToken: 'TOKEN-ODA-8831-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_prosecution_8832',
    name: 'Adv. Siddharth Rao',
    badgeId: 'ODA-8832',
    email: 'rao@oda.gov',
    agencyId: 'prosecution',
    agencyName: 'Office of the District Attorney & State Prosecution',
    jobTitle: 'Assistant District Attorney & Custody Officer',
    clearanceLevel: 'LEVEL 4 - LEGAL CUSTODY & TRIAL',
    initials: 'SR',
    color: 'amber',
    icon: 'briefcase',
    password: 'prosecution@123',
    department: 'Office of the District Attorney',
    securityToken: 'TOKEN-ODA-8832-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_court_1004',
    name: 'Hon. Samuel Wright',
    badgeId: 'JUD-1004',
    email: 'wright@court.gov',
    agencyId: 'court',
    agencyName: 'Metropolitan High Judicial Registry (Courtroom 4)',
    jobTitle: 'Presiding Judge & Magistrate',
    clearanceLevel: 'LEVEL 5 - SUPREME BENCH JURISDICTION',
    initials: 'SW',
    color: 'purple',
    icon: 'scale',
    password: 'court@123',
    department: 'Metropolitan High Judicial Registry',
    securityToken: 'TOKEN-JUD-1004-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_court_1005',
    name: 'Clerk Jonathan Miller',
    badgeId: 'JUD-1005',
    email: 'miller@court.gov',
    agencyId: 'court',
    agencyName: 'Metropolitan High Judicial Registry (Courtroom 4)',
    jobTitle: 'Registry Clerk & Admissibility Officer',
    clearanceLevel: 'LEVEL 4 - JUDICIAL DOCKET & SEAL',
    initials: 'JM',
    color: 'indigo',
    icon: 'file-check',
    password: 'court@123',
    department: 'Metropolitan High Judicial Registry',
    securityToken: 'TOKEN-JUD-1005-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  }
];

const INITIAL_CASES = [
  {
    id: 'CASE-CR-2026-1001',
    caseNumber: 'CR-2026-1001',
    title: 'State v. Nexus Darknet Financial Syndicate',
    category: 'Financial Extortion & Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-01 09:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1001/',
    description: 'Investigation into multi-jurisdictional darknet cryptocurrency laundering ring routing illicit fiat conversions through nested shell exchange gateways.'
  },
  {
    id: 'CASE-CR-2026-1002',
    caseNumber: 'CR-2026-1002',
    title: 'Operation Aegis: Cloud IAM Credential Stuffing & Exfiltration',
    category: 'Cybercrime & Ransomware',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-02 11:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1002/',
    description: 'Large-scale automated credential stuffing against cloud IAM roles, leading to unauthorized S3 bucket exfiltration and extortion demands.'
  },
  {
    id: 'CASE-CR-2026-1003',
    caseNumber: 'CR-2026-1003',
    title: 'Industrial SCADA Logic Injection & Water Grid Tampering',
    category: 'Critical Infrastructure Sabotage',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-03 14:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1003/',
    description: 'Adversarial network intrusion into municipal water treatment PLC controllers injecting manipulated ladder logic to alter chemical disinfectant mixtures.'
  },
  {
    id: 'CASE-CR-2026-1004',
    caseNumber: 'CR-2026-1004',
    title: 'SWIFT Interbank MT103 Wire Fraud Syndicate',
    category: 'Banking & Wire Fraud',
    leadAgency: 'prosecution',
    leadAgencyName: 'Office of the District Attorney & State Prosecution',
    investigatingOfficer: 'Adv. Elena Vance (ODA-8831)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-04 08:45:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1004/',
    description: 'Fraudulent intercept and injection of forged SWIFT MT103 international settlement telecommunications redirecting correspondent banking balances.'
  },
  {
    id: 'CASE-CR-2026-1005',
    caseNumber: 'CR-2026-1005',
    title: 'Metro High-Speed Transit Signaling Disruption',
    category: 'Transport Cyber Terrorism',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-05 16:20:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1005/',
    description: 'Radio-frequency injection attacks directed against CBTC automated railway wireless signaling transponders causing emergency automatic braking trip-outs.'
  },
  {
    id: 'CASE-CR-2026-1006',
    caseNumber: 'CR-2026-1006',
    title: 'Synthetic Audio Deepfake CEO Impersonation Wire Transfer',
    category: 'AI Deepfake & Financial Extortion',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-06 10:10:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1006/',
    description: 'Neural acoustic synthesis model trained on executive public interviews used in live telephone social engineering to authorize urgent capital transfers.'
  },
  {
    id: 'CASE-CR-2026-1007',
    caseNumber: 'CR-2026-1007',
    title: 'Metropolitan Healthcare PACS Radiology Array Ransomware',
    category: 'Healthcare Cybercrime & Extortion',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-07 07:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1007/',
    description: 'Targeted BlackByte ransomware strain targeting hospital radiology archive storage servers, threatening destruction of life-critical diagnostic imaging arrays.'
  },
  {
    id: 'CASE-CR-2026-1008',
    caseNumber: 'CR-2026-1008',
    title: 'Autonomous Smuggling Drone Blackbox & GPS Telemetry Carving',
    category: 'Narcotics & Drone Trafficking',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-08 12:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1008/',
    description: 'Seizure of an autonomous heavy-lift hexacopter drone interdicted across regional border perimeter with carved onboard flash memory containing automated waypoint coordinates.'
  },
  {
    id: 'CASE-CR-2026-1009',
    caseNumber: 'CR-2026-1009',
    title: 'DeFi Liquidity Pool Flash-Loan Exploit & Mixer Route',
    category: 'Cryptocurrency & Smart Contract Fraud',
    leadAgency: 'prosecution',
    leadAgencyName: 'Office of the District Attorney & State Prosecution',
    investigatingOfficer: 'Adv. Siddharth Rao (ODA-8832)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-09 15:45:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1009/',
    description: 'Reentrancy and oracle price-manipulation flash loan exploit draining decentralized liquidity pools, laundered through cross-chain zero-knowledge privacy mixers.'
  },
  {
    id: 'CASE-CR-2026-1010',
    caseNumber: 'CR-2026-1010',
    title: 'Zero-Day iOS WebKit Kernel Memory Exploit Ring',
    category: 'Corporate Espionage & Exploit Trafficking',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-10 09:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1010/',
    description: 'Criminal syndicate selling chained zero-click WebKit remote code execution and kernel memory patching exploits targeting mobile devices of senior public officials.'
  },
  {
    id: 'CASE-CR-2026-1011',
    caseNumber: 'CR-2026-1011',
    title: 'State Grid Substation Synchrophasor Packet Flood Attack',
    category: 'Energy Grid Cyber Sabotage',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-11 04:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1011/',
    description: 'Distributed UDP telemetry flood targeting PMU synchrophasor protocol aggregators at state electrical transmission hub, degrading automated blackout prevention relays.'
  },
  {
    id: 'CASE-CR-2026-1012',
    caseNumber: 'CR-2026-1012',
    title: 'Steganographic Semiconductor Blueprints Industrial Exfiltration',
    category: 'Corporate Espionage & IP Theft',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-11 18:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1012/',
    description: 'Disloyal engineering staff utilizing least-significant-bit image steganography to conceal 3nm microchip fabrication masks inside corporate promotional collateral.'
  },
  {
    id: 'CASE-CR-2026-1013',
    caseNumber: 'CR-2026-1013',
    title: 'Rogue Cellular IMSI-Catcher & SMS OTP Interception Network',
    category: 'Digital Surveillance & Wiretapping',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-12 11:20:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1013/',
    description: 'Vehicle-mounted rogue base transceiver station capturing cellular IMSIs and forcing 2G GSM cipher downgrades to intercept real-time bank authentication OTP codes.'
  },
  {
    id: 'CASE-CR-2026-1014',
    caseNumber: 'CR-2026-1014',
    title: 'Counterfeit Biometric Identity Forgery & National Switch Fraud',
    category: 'Biometric Forgery & National Identity Theft',
    leadAgency: 'prosecution',
    leadAgencyName: 'Office of the District Attorney & State Prosecution',
    investigatingOfficer: 'Adv. Elena Vance (ODA-8831)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-12 14:40:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1014/',
    description: 'Syndicate utilizing silicon cast latex fingerprint moulds and digital iris packet replays to fraudulently clear biometric social security welfare disbursements.'
  },
  {
    id: 'CASE-CR-2026-1015',
    caseNumber: 'CR-2026-1015',
    title: 'Automated Offshore Tax Evasion Shell Network & Crypto Stash',
    category: 'Money Laundering & Financial Fraud',
    leadAgency: 'prosecution',
    leadAgencyName: 'Office of the District Attorney & State Prosecution',
    investigatingOfficer: 'Adv. Siddharth Rao (ODA-8832)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-13 09:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1015/',
    description: 'Cross-border corporate structure utilizing automated micro-billing APIs and synthetic invoices to channel untaxed executive capital into cold-storage hardware wallets.'
  },
  {
    id: 'CASE-CR-2026-1016',
    caseNumber: 'CR-2026-1016',
    title: 'Harbor Port Terminal Cranes Automated Logic Hijacking',
    category: 'Maritime Infrastructure Sabotage',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-13 16:10:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1016/',
    description: 'Unauthorized remote access to commercial container port automated crane control software, holding shipping cargo discharge berths hostage under threat of derailment.'
  },
  {
    id: 'CASE-CR-2026-1017',
    caseNumber: 'CR-2026-1017',
    title: 'High-Frequency Algorithmic Spoofing & Stock Market Manipulation',
    category: 'Securities Fraud & Market Manipulation',
    leadAgency: 'prosecution',
    leadAgencyName: 'Office of the District Attorney & State Prosecution',
    investigatingOfficer: 'Adv. Elena Vance (ODA-8831)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-14 08:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1017/',
    description: 'Microsecond co-located algorithmic bot swarm submitting and immediately cancelling phantom liquidity orders to trigger automated retail stop-loss cascades.'
  },
  {
    id: 'CASE-CR-2026-1018',
    caseNumber: 'CR-2026-1018',
    title: 'Darknet Weapons Procurement & Encrypted Messaging Extraction',
    category: 'Illegal Arms Trafficking',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-14 13:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1018/',
    description: 'Investigation into illegal arms ring utilizing end-to-end encrypted messaging channels and PGP-signed smart contract escrows to coordinate ballistic shipments.'
  },
  {
    id: 'CASE-CR-2026-1019',
    caseNumber: 'CR-2026-1019',
    title: 'Municipal Smart Grid Electric Meter Firmware Tamper Ring',
    category: 'Energy Grid Fraud & Meter Tampering',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-15 10:20:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1019/',
    description: 'Distribution of custom optic-head probes and patched firmware images rewriting non-volatile calibration registers in industrial electricity revenue meters.'
  },
  {
    id: 'CASE-CR-2026-1020',
    caseNumber: 'CR-2026-1020',
    title: 'Commercial Airline Flight Deck Avionics Telemetry Infiltration',
    category: 'Aviation Security & Cyber Espionage',
    leadAgency: 'admin',
    leadAgencyName: 'DEIS Root Access & Identity Control Authority',
    investigatingOfficer: 'System Security Administrator (ADMIN-0001)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-15 15:50:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1020/',
    description: 'Unauthorized wireless bridging between passenger in-flight entertainment satellite modems and commercial flight deck ARINC-429 avionics data buses.'
  }
];
const INITIAL_EVIDENCE = [
    {
      id: 'EVD-2026-1001',
      caseId: 'CASE-CR-2026-1001',
      caseNumber: 'CR-2026-1001',
      caseTitle: 'State v. Nexus Darknet Financial Syndicate',
      title: 'Bitstream Mirror of Primary Darknet Node NVMe SSD',
      category: 'Disk Image',
      fileType: 'raw-image (.dd)',
      fileSize: '512 GB',
      fileName: 'EVD-2026-1001_node_mirror.dd',
      storedFilePath: 'evidence_vault/Case_CR-2026-1001/EVD-2026-1001_node_mirror.dd',
      seizureDate: '2026-11-01 10:15:00 UTC',
      seizureLocation: 'Data Center Rack B7, Server 14, Frankfurt Node Hub',
      sourceDevice: 'Samsung PM1733 Enterprise NVMe SSD (SN: S5TBNM0T104)',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
      digitalSeal: 'SEAL-2026-1001-VALID',
      classification: 'CONFIDENTIAL-FORENSIC',
      tags: ['Darknet', 'Crypto', 'NVMe', 'Tableau-T7u'],
      notes: 'Bitstream clone executed with Tableau T7u hardware write-blocker.'
    },
    {
      id: 'EVD-2026-1002',
      caseId: 'CASE-CR-2026-1002',
      caseNumber: 'CR-2026-1002',
      caseTitle: 'Operation Aegis: Cloud IAM Credential Stuffing & Exfiltration',
      title: 'AWS CloudTrail JSON Event Logs & S3 Access Stream Archive',
      category: 'Network Telemetry',
      fileType: 'json-stream (.gz)',
      fileSize: '4.2 GB',
      fileName: 'EVD-2026-1002_cloudtrail_audit.json.gz',
      storedFilePath: 'evidence_vault/Case_CR-2026-1002/EVD-2026-1002_cloudtrail_audit.json.gz',
      seizureDate: '2026-11-02 12:40:00 UTC',
      seizureLocation: 'AWS S3 Cloud Vault us-east-1 (Account: 49021-DEIS)',
      sourceDevice: 'CloudWatch Log Stream Export Gateway Node',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: 'd2a84f3019e07894178562910485720194857201948572019485720194857201',
      sha512: '8f3a90c1b4de8834aa7712c9010fee67b9a148902a3cdef4901847192837465a1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      digitalSeal: 'SEAL-2026-1002-VALID',
      classification: 'RESTRICTED-EVIDENTIARY',
      tags: ['CloudTrail', 'AWS', 'JSON', 'Credential-Stuffing'],
      notes: 'Cryptographically signed S3 access log tarball with cryptographic MD5/SHA-256 manifest.'
    },
    {
      id: 'EVD-2026-1003',
      caseId: 'CASE-CR-2026-1003',
      caseNumber: 'CR-2026-1003',
      caseTitle: 'Industrial SCADA Logic Injection & Water Grid Tampering',
      title: 'Siemens S7-1500 PLC Firmware Hex Dump & Manipulated Ladder Logic',
      category: 'Memory Dump',
      fileType: 'firmware-bin (.hex)',
      fileSize: '64 MB',
      fileName: 'EVD-2026-1003_s7_1500_firmware.hex',
      storedFilePath: 'evidence_vault/Case_CR-2026-1003/EVD-2026-1003_s7_1500_firmware.hex',
      seizureDate: '2026-11-03 15:20:00 UTC',
      seizureLocation: 'Municipal Water Pumping Station 03, Control Cabinet A',
      sourceDevice: 'Siemens SIMATIC S7-1500 CPU 1516-3 PN/DP (SN: 6ES7516-3AN02-0AB0)',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: '5063a6809b8965e8514b535c3888509b802249105e148c5c4858e57cdc46fa8e',
      sha512: '2def4edba3ac37cf0aaacf3a3216f4bb4cfca32da1ba9a6a8223a4aaf50a993ec1ee927154dd0fe5ff5b8fccea343eddcff1ff2bb0e1ddd20524fd2d65458936',
      digitalSeal: 'SEAL-2026-1003-VALID',
      classification: 'CRITICAL-INFRASTRUCTURE',
      tags: ['SCADA', 'PLC', 'Siemens', 'Water-Grid'],
      notes: 'JTAG bus physical memory readout acquired without rebooting running PLC core.'
    },
    {
      id: 'EVD-2026-1004',
      caseId: 'CASE-CR-2026-1004',
      caseNumber: 'CR-2026-1004',
      caseTitle: 'SWIFT Interbank MT103 Wire Fraud Syndicate',
      title: 'SWIFT Financial Message Bus MT103 Intercepted Telecommunication PCAP',
      category: 'Network Telemetry',
      fileType: 'packet-capture (.pcap)',
      fileSize: '1.8 GB',
      fileName: 'EVD-2026-1004_swift_mt103_traffic.pcap',
      storedFilePath: 'evidence_vault/Case_CR-2026-1004/EVD-2026-1004_swift_mt103_traffic.pcap',
      seizureDate: '2026-11-04 09:30:00 UTC',
      seizureLocation: 'National Clearinghouse Core Settlement Switch, Room 12',
      sourceDevice: 'Cisco Catalyst 9500 Core Financial Switch (SPAN Mirror Port)',
      currentCustodian: 'ODA-LEGAL',
      custodianAgency: 'prosecution',
      status: 'IN_VAULT',
      sha256: '7cdb4176c7a247630875c6304d57b5dd13ce484c947a392176af2d1dbfc0842a',
      sha512: '257c831a3780f0f1a18f31ce4ab36d5d735b875ec127434eb53e888dc418232819df4572e7248f25546197213bf1cac04b6e44c113abb4c4b92ccb4cb1a7b973',
      digitalSeal: 'SEAL-2026-1004-VALID',
      classification: 'FINANCIAL-CONFIDENTIAL',
      tags: ['SWIFT', 'Wire-Fraud', 'PCAP', 'Banking'],
      notes: 'SPAN port raw network bitstream capture preserving TCP stream reconstruction.'
    },
    {
      id: 'EVD-2026-1005',
      caseId: 'CASE-CR-2026-1005',
      caseNumber: 'CR-2026-1005',
      caseTitle: 'Metro High-Speed Transit Signaling Disruption',
      title: 'CBTC Railway Automated Wireless Signaling Transponder NVRAM Extract',
      category: 'Memory Dump',
      fileType: 'nvram-dump (.bin)',
      fileSize: '128 MB',
      fileName: 'EVD-2026-1005_cbtc_transponder.bin',
      storedFilePath: 'evidence_vault/Case_CR-2026-1005/EVD-2026-1005_cbtc_transponder.bin',
      seizureDate: '2026-11-05 17:10:00 UTC',
      seizureLocation: 'Subway Track Section 14, Signaling Relay Junction Box 2B',
      sourceDevice: 'Alstom Urbalis CBTC Trackside Radio Unit (TRU-400)',
      currentCustodian: 'JUDICIAL-REG',
      custodianAgency: 'court',
      status: 'ADMITTED_IN_COURT',
      sha256: '45d4260f2e20b3d11ca69080ec871ffa0075687f0f6eaa3de0c3bc1cbb8370b3',
      sha512: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d',
      digitalSeal: 'SEAL-2026-1005-VALID',
      classification: 'JUDICIAL-EXHIBIT-A',
      tags: ['Railway', 'CBTC', 'NVRAM', 'Admitted-Exhibit'],
      notes: 'Admitted as prime prosecution exhibit under Judicial Admissibility Rule FRE 902(14).'
    },
    {
      id: 'EVD-2026-1006',
      caseId: 'CASE-CR-2026-1006',
      caseNumber: 'CR-2026-1006',
      caseTitle: 'Synthetic Audio Deepfake CEO Impersonation Wire Transfer',
      title: 'Neural TTS Synthesized Master Audio Recording & Vocoder Mel-Spectrogram',
      category: 'Audio Recording',
      fileType: 'broadcast-wav (.wav)',
      fileSize: '240 MB',
      fileName: 'EVD-2026-1006_deepfake_call.wav',
      storedFilePath: 'evidence_vault/Case_CR-2026-1006/EVD-2026-1006_deepfake_call.wav',
      seizureDate: '2026-11-06 11:00:00 UTC',
      seizureLocation: 'Telecom Core VoIP Session Border Controller SBC-01',
      sourceDevice: 'AudioCodes Mediant 4000 Session Border Controller',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: 'ae4cf5bff27e46abe9accb4bf36ddff2bf1f2a99d10e4851994ea84c6d09693e',
      sha512: '1f2e3d4c5b6a798899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00',
      digitalSeal: 'SEAL-2026-1006-VALID',
      classification: 'CONFIDENTIAL-ACOUSTIC',
      tags: ['Deepfake', 'Voice-Clone', 'VoIP', 'Audio'],
      notes: 'Uncompressed 48kHz 24-bit PCM audio extraction; phase discontinuity tags detected.'
    },
    {
      id: 'EVD-2026-1007',
      caseId: 'CASE-CR-2026-1007',
      caseNumber: 'CR-2026-1007',
      caseTitle: 'Metropolitan Healthcare PACS Radiology Array Ransomware',
      title: 'Hospital PACS DICOM Diagnostic Storage Array Bitstream Mirror',
      category: 'Disk Image',
      fileType: 'expert-witness (.e01)',
      fileSize: '2.8 TB',
      fileName: 'EVD-2026-1007_pacs_dicom_array.e01',
      storedFilePath: 'evidence_vault/Case_CR-2026-1007/EVD-2026-1007_pacs_dicom_array.e01',
      seizureDate: '2026-11-07 08:45:00 UTC',
      seizureLocation: 'Metropolitan Hospital Central Data Center, Rack 04',
      sourceDevice: 'Dell EMC Isilon F800 All-Flash Storage Array',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: 'a6cef4c74565fe46ad78308a3ad4c07af2b1c6ff9d57f0a66ac4650bb54a1b2c',
      sha512: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
      digitalSeal: 'SEAL-2026-1007-VALID',
      classification: 'HIPAA-RESTRICTED',
      tags: ['Healthcare', 'PACS', 'DICOM', 'Ransomware'],
      notes: 'Bitstream image acquired across 10GbE fiber optic tap with Tableau hardware.'
    },
    {
      id: 'EVD-2026-1008',
      caseId: 'CASE-CR-2026-1008',
      caseNumber: 'CR-2026-1008',
      caseTitle: 'Autonomous Smuggling Drone Blackbox & GPS Telemetry Carving',
      title: 'Pixhawk Autopilot MicroSD Blackbox & GPS Waypoint Flash Memory Dump',
      category: 'Drone Telemetry',
      fileType: 'flash-dump (.bin)',
      fileSize: '64 GB',
      fileName: 'EVD-2026-1008_pixhawk_blackbox.bin',
      storedFilePath: 'evidence_vault/Case_CR-2026-1008/EVD-2026-1008_pixhawk_blackbox.bin',
      seizureDate: '2026-11-08 13:15:00 UTC',
      seizureLocation: 'Border Patrol Outpost 19, Crash Recovery Site Grid 42-N',
      sourceDevice: 'Pixhawk 6X Autopilot MicroSD SanDisk Extreme Pro 64GB',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: '00b39c0f81d4a821938475629104857201948572019485720194857201948572',
      sha512: '556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff',
      digitalSeal: 'SEAL-2026-1008-VALID',
      classification: 'TACTICAL-EVIDENTIARY',
      tags: ['Drone', 'Pixhawk', 'GPS', 'Narcotics'],
      notes: 'NMEA GPS coordinates and autonomous waypoint mission logs extracted.'
    },
    {
      id: 'EVD-2026-1009',
      caseId: 'CASE-CR-2026-1009',
      caseNumber: 'CR-2026-1009',
      caseTitle: 'DeFi Liquidity Pool Flash-Loan Exploit & Mixer Route',
      title: 'EVM Smart Contract Bytecode Execution Trace & Tornado Cash Mixer Route Log',
      category: 'Blockchain Ledger',
      fileType: 'state-trace (.json)',
      fileSize: '850 MB',
      fileName: 'EVD-2026-1009_evm_execution_trace.json',
      storedFilePath: 'evidence_vault/Case_CR-2026-1009/EVD-2026-1009_evm_execution_trace.json',
      seizureDate: '2026-11-09 16:30:00 UTC',
      seizureLocation: 'Decentralized Protocol Full Node Cluster, Archive Node 01',
      sourceDevice: 'Erigon Full Ethereum Archive Node (NVMe RAID-0)',
      currentCustodian: 'ODA-LEGAL',
      custodianAgency: 'prosecution',
      status: 'IN_VAULT',
      sha256: '99c019284756291048572019485720194857201948572019485720194857201a',
      sha512: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      digitalSeal: 'SEAL-2026-1009-VALID',
      classification: 'FINANCIAL-FORENSIC',
      tags: ['DeFi', 'EVM', 'Flash-Loan', 'Ethereum'],
      notes: 'Opcode-level reentrancy call trace isolating recipient wallet deposit hashes.'
    },
    {
      id: 'EVD-2026-1010',
      caseId: 'CASE-CR-2026-1010',
      caseNumber: 'CR-2026-1010',
      caseTitle: 'Zero-Day iOS WebKit Kernel Memory Exploit Ring',
      title: 'WebKit Use-After-Free Shellcode Payload & Kernel Patch Hook Binary',
      category: 'Memory Dump',
      fileType: 'mach-o-binary (.bin)',
      fileSize: '32 MB',
      fileName: 'EVD-2026-1010_webkit_shellcode.bin',
      storedFilePath: 'evidence_vault/Case_CR-2026-1010/EVD-2026-1010_webkit_shellcode.bin',
      seizureDate: '2026-11-10 10:00:00 UTC',
      seizureLocation: 'Hotel Conference Room 302, Suspect Laptop Seizure',
      sourceDevice: 'MacBook Pro M3 Max 16-inch (Serial: C02GN001MD6R)',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: '33b4920049458902341786ef34a1b2c3d4e5f607182930415263748596a7b8c9',
      sha512: 'a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3e4f5a0b1c2d3',
      digitalSeal: 'SEAL-2026-1010-VALID',
      classification: 'ZERO-DAY-EXPLOIT',
      tags: ['WebKit', 'Zero-Day', 'Mach-O', 'Shellcode'],
      notes: 'Extracted from encrypted DMG container mounted at time of police entry.'
    },
    {
      id: 'EVD-2026-1011',
      caseId: 'CASE-CR-2026-1011',
      caseNumber: 'CR-2026-1011',
      caseTitle: 'State Grid Substation Synchrophasor Packet Flood Attack',
      title: 'Substation Synchrophasor IEEE C37.118 Protocol UDP Flood Packet Capture',
      category: 'Network Telemetry',
      fileType: 'packet-stream (.pcapng)',
      fileSize: '14.6 GB',
      fileName: 'EVD-2026-1011_synchrophasor_flood.pcapng',
      storedFilePath: 'evidence_vault/Case_CR-2026-1011/EVD-2026-1011_synchrophasor_flood.pcapng',
      seizureDate: '2026-11-11 05:45:00 UTC',
      seizureLocation: 'Transmission Substation North-08, SCADA Gateway Cabinet',
      sourceDevice: 'SEL-3530 Real-Time Automation Controller (RTAC)',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: '77d8928374650192837465019283746501928374650192837465019283746501',
      sha512: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      digitalSeal: 'SEAL-2026-1011-VALID',
      classification: 'ENERGY-GRID-SECURITY',
      tags: ['Synchrophasor', 'IEEE-C37.118', 'SCADA', 'Grid'],
      notes: '10-minute continuous line-rate capture during frequency oscillation event.'
    },
    {
      id: 'EVD-2026-1012',
      caseId: 'CASE-CR-2026-1012',
      caseNumber: 'CR-2026-1012',
      caseTitle: 'Steganographic Semiconductor Blueprints Industrial Exfiltration',
      title: 'Steganographic High-Res JPEG Carrier with Carved 3nm Die Blueprints',
      category: 'Corporate Espionage',
      fileType: 'gdsii-binary (.gds)',
      fileSize: '1.2 GB',
      fileName: 'EVD-2026-1012_carved_3nm_die.gds',
      storedFilePath: 'evidence_vault/Case_CR-2026-1012/EVD-2026-1012_carved_3nm_die.gds',
      seizureDate: '2026-11-11 19:15:00 UTC',
      seizureLocation: 'International Airport Customs Checkpoint Terminal 3',
      sourceDevice: 'SanDisk Ultra Dual Drive Luxe USB Type-C 256GB',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: '11a4189384756291028374650192837465019283746501928374650192837465',
      sha512: '44556677889900112233445566778899001122334455667788990011223344556677889900112233445566778899001122334455667788990011223344556677',
      digitalSeal: 'SEAL-2026-1012-VALID',
      classification: 'PROPRIETARY-IP-SECRET',
      tags: ['Steganography', 'Semiconductor', 'GDSII', 'IP-Theft'],
      notes: 'OpenStego LSB payload carved from suspect high-resolution landscape images.'
    },
    {
      id: 'EVD-2026-1013',
      caseId: 'CASE-CR-2026-1013',
      caseNumber: 'CR-2026-1013',
      caseTitle: 'Rogue Cellular IMSI-Catcher & SMS OTP Interception Network',
      title: 'Rogue Base Station IMSI Catcher Telemetry & SMS OTP Intercept Logs',
      category: 'Digital Surveillance',
      fileType: 'sdr-iq-stream (.dat)',
      fileSize: '8.4 GB',
      fileName: 'EVD-2026-1013_sdr_rf_intercept.dat',
      storedFilePath: 'evidence_vault/Case_CR-2026-1013/EVD-2026-1013_sdr_rf_intercept.dat',
      seizureDate: '2026-11-12 12:10:00 UTC',
      seizureLocation: 'Impounded Surveillance Van, License Plate MH-02-EX-4190',
      sourceDevice: 'Ettus Research USRP B210 Software Defined Radio (SDR)',
      currentCustodian: 'ODA-LEGAL',
      custodianAgency: 'prosecution',
      status: 'IN_VAULT',
      sha256: '88f1c34a90c1b4de8834aa7712c9010fee67b9a148902a3cdef4901847192837',
      sha512: 'bbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677',
      digitalSeal: 'SEAL-2026-1013-VALID',
      classification: 'TELECOM-INTERCEPT',
      tags: ['IMSI-Catcher', 'SDR', 'GSM-Downgrade', 'OTP'],
      notes: 'Raw RF I/Q baseband sample recording proving GSM A5/1 cipher forced downgrade.'
    },
    {
      id: 'EVD-2026-1014',
      caseId: 'CASE-CR-2026-1014',
      caseNumber: 'CR-2026-1014',
      caseTitle: 'Counterfeit Biometric Identity Forgery & National Switch Fraud',
      title: 'High-Resolution WSQ Biometric Fingerprint Minutiae Raw Extraction Dump',
      category: 'Biometric Identity',
      fileType: 'wsq-image (.wsq)',
      fileSize: '450 MB',
      fileName: 'EVD-2026-1014_biometric_wsq_dump.wsq',
      storedFilePath: 'evidence_vault/Case_CR-2026-1014/EVD-2026-1014_biometric_wsq_dump.wsq',
      seizureDate: '2026-11-12 15:30:00 UTC',
      seizureLocation: 'Underground Biometric Spoofing Laboratory, Industrial Zone 4',
      sourceDevice: 'SecuGen Hamster Pro 20 Optical Fingerprint Scanner Firmware',
      currentCustodian: 'JUDICIAL-REG',
      custodianAgency: 'court',
      status: 'ADMITTED_IN_COURT',
      sha256: '55b1182c4756291028374650192837465019283746501928374650192837465a',
      sha512: 'ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100',
      digitalSeal: 'SEAL-2026-1014-VALID',
      classification: 'JUDICIAL-EXHIBIT-B',
      tags: ['Biometric', 'WSQ', 'Fingerprint', 'Identity-Theft'],
      notes: 'Admitted as court exhibit; forensic comparison matches forged welfare slips.'
    },
    {
      id: 'EVD-2026-1015',
      caseId: 'CASE-CR-2026-1015',
      caseNumber: 'CR-2026-1015',
      caseTitle: 'Automated Offshore Tax Evasion Shell Network & Crypto Stash',
      title: 'Subpoenaed Encrypted Transaction Ledger Database & BIP-39 Seed Extraction',
      category: 'Financial Ledger',
      fileType: 'sqlite-database (.db)',
      fileSize: '2.1 GB',
      fileName: 'EVD-2026-1015_ledger_database.db',
      storedFilePath: 'evidence_vault/Case_CR-2026-1015/EVD-2026-1015_ledger_database.db',
      seizureDate: '2026-11-13 10:15:00 UTC',
      seizureLocation: 'Accountancy Chambers, Safe Deposit Box 102',
      sourceDevice: 'Trezor Model T Hardware Wallet + Veracrypt Encrypted SSD',
      currentCustodian: 'ODA-LEGAL',
      custodianAgency: 'prosecution',
      status: 'IN_VAULT',
      sha256: '44a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      sha512: '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      digitalSeal: 'SEAL-2026-1015-VALID',
      classification: 'FINANCIAL-CONFIDENTIAL',
      tags: ['Tax-Evasion', 'Crypto', 'SQLite', 'BIP-39'],
      notes: 'Subpoenaed financial database matching offshore bank transfer coordinates.'
    },
    {
      id: 'EVD-2026-1016',
      caseId: 'CASE-CR-2026-1016',
      caseNumber: 'CR-2026-1016',
      caseTitle: 'Harbor Port Terminal Cranes Automated Logic Hijacking',
      title: 'Allen-Bradley ControlLogix 5580 Controller Hijacked Project Binary',
      category: 'Industrial SCADA',
      fileType: 'controller-project (.acd)',
      fileSize: '48 MB',
      fileName: 'EVD-2026-1016_port_crane_logic.acd',
      storedFilePath: 'evidence_vault/Case_CR-2026-1016/EVD-2026-1016_port_crane_logic.acd',
      seizureDate: '2026-11-13 17:00:00 UTC',
      seizureLocation: 'Commercial Container Terminal Berth 04, Crane Cab 02',
      sourceDevice: 'Rockwell Automation Allen-Bradley ControlLogix 5580 (1756-L83E)',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: '22c8891d4756291028374650192837465019283746501928374650192837465a',
      sha512: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
      digitalSeal: 'SEAL-2026-1016-VALID',
      classification: 'MARITIME-INFRASTRUCTURE',
      tags: ['Port-Crane', 'PLC', 'Rockwell', 'Sabotage'],
      notes: 'Bitstream project memory extracted showing altered weight sensor thresholds.'
    },
    {
      id: 'EVD-2026-1017',
      caseId: 'CASE-CR-2026-1017',
      caseNumber: 'CR-2026-1017',
      caseTitle: 'High-Frequency Algorithmic Spoofing & Stock Market Manipulation',
      title: 'FPGA Network Interface Microsecond Timestamped Market Order Tick Feed',
      category: 'Securities Data',
      fileType: 'market-pcap (.pcap)',
      fileSize: '19.2 GB',
      fileName: 'EVD-2026-1017_hft_market_tick.pcap',
      storedFilePath: 'evidence_vault/Case_CR-2026-1017/EVD-2026-1017_hft_market_tick.pcap',
      seizureDate: '2026-11-14 09:15:00 UTC',
      seizureLocation: 'Stock Exchange Co-location Facility, Cage 18',
      sourceDevice: 'Solarflare Flareon Ultra SFN8522 Dual-Port 10GbE PCIe NIC',
      currentCustodian: 'ODA-LEGAL',
      custodianAgency: 'prosecution',
      status: 'IN_VAULT',
      sha256: '99d2401e4756291028374650192837465019283746501928374650192837465a',
      sha512: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
      digitalSeal: 'SEAL-2026-1017-VALID',
      classification: 'FINANCIAL-CONFIDENTIAL',
      tags: ['HFT', 'Securities', 'FPGA', 'Spoofing'],
      notes: 'Nanosecond hardware-timestamped packet captures capturing phantom liquidity spikes.'
    },
    {
      id: 'EVD-2026-1018',
      caseId: 'CASE-CR-2026-1018',
      caseNumber: 'CR-2026-1018',
      caseTitle: 'Darknet Weapons Procurement & Encrypted Messaging Extraction',
      title: 'Physical Extraction Dump of Hardened GrapheneOS Suspect Smartphone',
      category: 'Mobile Forensics',
      fileType: 'physical-image (.tar.gz)',
      fileSize: '128 GB',
      fileName: 'EVD-2026-1018_grapheneos_physical.tar.gz',
      storedFilePath: 'evidence_vault/Case_CR-2026-1018/EVD-2026-1018_grapheneos_physical.tar.gz',
      seizureDate: '2026-11-14 13:45:00 UTC',
      seizureLocation: 'Highway Intercept Roadblock KM-88, Vehicle Trunk',
      sourceDevice: 'Google Pixel 8 Pro (Model GC3VE, 256GB Obsidian)',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: 'd1a78436027212b3c7b4c099d680049cbd2cf9a8a472ce7c9705dd6cd516d477',
      sha512: '7e266b7be1ae2eab3959b47a9561d16ff66588e240d484b5377b4eec269fc68a7e266b7be1ae2eab3959b47a9561d16ff66588e240d484b5377b4eec269fc68a',
      digitalSeal: 'SEAL-2026-1018-VALID',
      classification: 'FIREARMS-EVIDENTIARY',
      tags: ['Mobile', 'GrapheneOS', 'Arms-Trafficking', 'Physical-Dump'],
      notes: 'Physical chip-off acquisition with Cellebrite UFED Touch 3 verified.'
    },
    {
      id: 'EVD-2026-1019',
      caseId: 'CASE-CR-2026-1019',
      caseNumber: 'CR-2026-1019',
      caseTitle: 'Municipal Smart Grid Electric Meter Firmware Tamper Ring',
      title: 'Optical Probe Hardware Readout of Tampered Meter EEPROM Calibration Table',
      category: 'Hardware Audit',
      fileType: 'eeprom-dump (.bin)',
      fileSize: '16 MB',
      fileName: 'EVD-2026-1019_meter_eeprom.bin',
      storedFilePath: 'evidence_vault/Case_CR-2026-1019/EVD-2026-1019_meter_eeprom.bin',
      seizureDate: '2026-11-15 11:10:00 UTC',
      seizureLocation: 'Suburban Commercial Plaza, Distribution Transformer Room 01',
      sourceDevice: 'Landis+Gyr E650 Industrial 3-Phase Meter (SN: LG-99210-2025)',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: '6663b3bfc74e65a01e5bd0f274e4152a858b15eaaddd21730412112085c60ad7',
      sha512: '6e2335db89ee1d853a8fc26a43b9564cc718822d44ad316cf9649573cf592c126e2335db89ee1d853a8fc26a43b9564cc718822d44ad316cf9649573cf592c12',
      digitalSeal: 'SEAL-2026-1019-VALID',
      classification: 'ENERGY-GRID-FRAUD',
      tags: ['EEPROM', 'Meter-Tamper', 'Smart-Grid', 'Optical-Head'],
      notes: 'Non-volatile memory dump revealing patched current multiplier constant.'
    },
    {
      id: 'EVD-2026-1020',
      caseId: 'CASE-CR-2026-1020',
      caseNumber: 'CR-2026-1020',
      caseTitle: 'Commercial Airline Flight Deck Avionics Telemetry Infiltration',
      title: 'Flight Deck QAR Quick Access Recorder ARINC-717 Bitstream Image',
      category: 'Aviation Avionics',
      fileType: 'arinc-stream (.raw)',
      fileSize: '32 GB',
      fileName: 'EVD-2026-1020_avionics_arinc717.raw',
      storedFilePath: 'evidence_vault/Case_CR-2026-1020/EVD-2026-1020_avionics_arinc717.raw',
      seizureDate: '2026-11-15 16:45:00 UTC',
      seizureLocation: 'International Airport Hangar 07, Aircraft Tail N-884DE',
      sourceDevice: 'Teledyne Wireless Quick Access Recorder (WQAR-900)',
      currentCustodian: 'CFSL-CYBER',
      custodianAgency: 'forensics',
      status: 'UNDER_ANALYSIS',
      sha256: 'eb206cacf8df15f3f54b396461ac40f058ac20e8c5293c927bdd8293c2f5d12e',
      sha512: '65455e8f695ee7067f6ebc31ed26028b1fd497497c3556b650804b77fe957b1865455e8f695ee7067f6ebc31ed26028b1fd497497c3556b650804b77fe957b18',
      digitalSeal: 'SEAL-2026-1020-VALID',
      classification: 'NATIONAL-SECURITY',
      tags: ['Avionics', 'ARINC-717', 'Flight-Deck', 'Aviation-Security'],
      notes: 'Bitstream clone of flight telemetry data; satellite data link bridging identified.'
    },
    {
      id: 'EVD-2026-3812',
      caseId: 'CASE-CR-2008-0001',
      caseNumber: 'CR-2008-0001',
      caseTitle: '26/11 Mumbai Terror Attack',
      title: 'CCTV(Seized Artifact)',
      category: 'Video Surveillance',
      fileType: 'video/mp4',
      fileSize: '11.64 MB',
      fileName: '',
      storedFilePath: 'evidence_vault/Case_CR-2008-0001/artifact.raw',
      seizureDate: '2026-11-17T10:26:46.219Z',
      seizureLocation: 'Room No. 418',
      sourceDevice: 'HP Victus 3050 RTX',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: '1bd3325afd4c0813da88dee881047bf69bd344fd34de8b4736c2fd35e2e38097',
      sha512: '1d437a45b94568c5d29ec385c418bb4fe5d18e5e1b9c1555d6895763bce2528b2a7ece7fbe03bc1e4c6d76de9756142757962ebfa5dbd9b76268df115b911bd0',
      digitalSeal: 'SEAL-1794911206219-VALID',
      classification: '',
      tags: ['Manual-Ingest', 'Video Surveillance'],
      notes: 'This is the cctv footage of the case'
    },
    {
      id: 'EVD-2026-5524',
      caseId: 'CASE-CR-2008-0001',
      caseNumber: 'CR-2008-0001',
      caseTitle: '26/11 Mumbai Terror Attack',
      title: 'Call Records (Seized Artifact)',
      category: 'Memory Dump',
      fileType: 'audio/mpeg',
      fileSize: '1.48 MB',
      fileName: '',
      storedFilePath: 'evidence_vault/Case_CR-2008-0001/artifact.raw',
      seizureDate: '2026-11-17T10:28:23.953Z',
      seizureLocation: 'Room No. 418',
      sourceDevice: 'HP Victus 3050 RTX',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: '0d7c2b1c17537cddfc6806d46e8b94078fcc017178ae0803d5cee7920ee6d47a',
      sha512: 'f6954281e56f677df32a45a4d0078fa330f7f13dd2e8b120f1b8d081a2d839e18add837c3424e89f3d372aa878fc4d23af192c8fe7736de34ae8b89ec9656f60',
      digitalSeal: 'SEAL-1794911303953-VALID',
      classification: '',
      tags: ['Manual-Ingest', 'Memory Dump'],
      notes: 'Call recording between Major Iqbal and the leader in the attack'
    },
    {
      id: 'EVD-2026-8514',
      caseId: 'CASE-CR-2008-0001',
      caseNumber: 'CR-2008-0001',
      caseTitle: '26/11 Mumbai Terror Attack',
      title: 'GPS records (Seized Artifact)',
      category: 'Network Telemetry',
      fileType: 'text/plain',
      fileSize: '0.00 MB',
      fileName: '',
      storedFilePath: 'evidence_vault/Case_CR-2008-0001/artifact.raw',
      seizureDate: '2026-11-17T10:30:18.380Z',
      seizureLocation: 'Room No. 418',
      sourceDevice: 'HP Victus 3050 RTX',
      currentCustodian: 'CCIC-HQ',
      custodianAgency: 'police',
      status: 'IN_VAULT',
      sha256: 'c7d6b8cb0ec852936c4774b6e9f63241d925c74e724fc844156a2f521c453e70',
      sha512: 'ebd9ec9be586c9c45f4d07e649e0257d4834bec9c77c65934478e542ec29d28605c591f3daf89a21be2083335e018c45930ce3e9e06cda5912026f43be4dd285',
      digitalSeal: 'SEAL-1794911418380-VALID',
      classification: '',
      tags: ['Manual-Ingest', 'Network Telemetry'],
      notes: 'The location of Major Iqbal which was retrived from the call'
    }
];
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
      actionDescription: 'DEIS Genesis Block initialized.',
      evidenceHash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: 'd892837465019283746501928374650192837465019283746501928374650192',
      signature: '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A',
      tampered: false
    },
    {
      blockHeight: 1,
      blockHash: '00000b2ffdbe5a60e4bd626e48e66358a2b7128a08bdc587802d5c0dc60cb37e',
      previousHash: '00000a941f82938475629102837465019283746501928374650192837465a1b2',
      timestamp: '2026-11-01 10:15:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1001',
      caseId: 'CR-2026-1001',
      agency: 'police',
      officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1001 for Case CR-2026-1001. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '4787dc3d99ef3da65181df58f3c786e377a97bc55f3825fcb362617e310bb356',
      signature: '0x28E7E73115E6305C049E90A5F6CB453F13352ED2AADD71D80C9A93B323C33604',
      tampered: false
    },
    {
      blockHeight: 2,
      blockHash: '000007f5628044a6ff947e442ff37446bac6473134d640a338a5aa95c4777293',
      previousHash: '00000b2ffdbe5a60e4bd626e48e66358a2b7128a08bdc587802d5c0dc60cb37e',
      timestamp: '2026-11-02 12:40:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1002',
      caseId: 'CR-2026-1002',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1002 for Case CR-2026-1002. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'd2a84f3019e07894178562910485720194857201948572019485720194857201',
      merkleRoot: '03d6412ed922e768cb715ce1f1fe86938ba7528195c7ba4ce09f0c825bb82057',
      signature: '0xFC6379A6A74A42C4A9D6B4145D09E9C8E32C6136D04A30FBB69AD7146FD7FD08',
      tampered: false
    },
    {
      blockHeight: 3,
      blockHash: '000002fcc48551a7753cd09f9f9aff0edb64427a035f35476f2d8daa7bc5407c',
      previousHash: '000007f5628044a6ff947e442ff37446bac6473134d640a338a5aa95c4777293',
      timestamp: '2026-11-03 15:20:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1003',
      caseId: 'CR-2026-1003',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1003 for Case CR-2026-1003. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '5063a6809b8965e8514b535c3888509b802249105e148c5c4858e57cdc46fa8e',
      merkleRoot: '875ff05487a8a94c668a4edc94f748fe0a92d39f27a83faa3d26281c758251da',
      signature: '0x0293D63E2520DAD329E3FF49104F65775676550FA3D1A2AC731BCDEA4E0874C2',
      tampered: false
    },
    {
      blockHeight: 4,
      blockHash: '000005af07785f804feca8df776041cda00f4a4dfcbfca6d908985952b496c9f',
      previousHash: '000002fcc48551a7753cd09f9f9aff0edb64427a035f35476f2d8daa7bc5407c',
      timestamp: '2026-11-04 09:30:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1004',
      caseId: 'CR-2026-1004',
      agency: 'prosecution',
      officer: 'Adv. Elena Vance (ODA-8831)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1004 for Case CR-2026-1004. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '7cdb4176c7a247630875c6304d57b5dd13ce484c947a392176af2d1dbfc0842a',
      merkleRoot: '44cc385504b58c96b0851cfbb38c94e8cc20b539a3f9a143639d313eb5bc0a49',
      signature: '0xC0A73F4846B695042FFF8DFF67E6D0650C4612AB6B179C7C0D30891D813A5362',
      tampered: false
    },
    {
      blockHeight: 5,
      blockHash: '0000077a68b4c90d0fb1bc6661ff211c5bf14d172e2c33ee83932ceadc413160',
      previousHash: '000005af07785f804feca8df776041cda00f4a4dfcbfca6d908985952b496c9f',
      timestamp: '2026-11-05 17:10:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1005',
      caseId: 'CR-2026-1005',
      agency: 'court',
      officer: 'Hon. Justice Sarah Sterling (CJMC-101)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1005 for Case CR-2026-1005. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '45d4260f2e20b3d11ca69080ec871ffa0075687f0f6eaa3de0c3bc1cbb8370b3',
      merkleRoot: '3cdd5c5032c66bed64d8d0b9fcca75d3644b44c60073a0000afde398b740cadb',
      signature: '0x5E091D3A3713973B905944ED0C5C81AA6EAF88ADA09796FE8D36164784DF6AD8',
      tampered: false
    },
    {
      blockHeight: 6,
      blockHash: '0000092d6e5d0f392fad30d595943fcad9eda4bccbf29fb621328e4e5e909469',
      previousHash: '0000077a68b4c90d0fb1bc6661ff211c5bf14d172e2c33ee83932ceadc413160',
      timestamp: '2026-11-06 11:00:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1006',
      caseId: 'CR-2026-1006',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1006 for Case CR-2026-1006. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'ae4cf5bff27e46abe9accb4bf36ddff2bf1f2a99d10e4851994ea84c6d09693e',
      merkleRoot: '418815b0feb81bba60b72d6382b007222606cdf763b68e46aa5dedad66479ef5',
      signature: '0x4094922E6C556E834C954C5E65E9EE8B773E3D2EC673A69122F3B63DE6424FDE',
      tampered: false
    },
    {
      blockHeight: 7,
      blockHash: '00000e47adca0f1baa054521f1a1e9e4a249b9559966a66e564288940e96f8ca',
      previousHash: '0000092d6e5d0f392fad30d595943fcad9eda4bccbf29fb621328e4e5e909469',
      timestamp: '2026-11-07 08:45:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1007',
      caseId: 'CR-2026-1007',
      agency: 'police',
      officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1007 for Case CR-2026-1007. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'a6cef4c74565fe46ad78308a3ad4c07af2b1c6ff9d57f0a66ac4650bb54a1b2c',
      merkleRoot: 'f7bfa58d3f7db8c581fa68410c2009543f5bf7bd00302bc3c112e681360f00b4',
      signature: '0xF988C5841B67775829004963394006CDE4277AB523F1F51206125C31199A413E',
      tampered: false
    },
    {
      blockHeight: 8,
      blockHash: '0000039d0f1a7f4d8b4769aab7cf035b76df3798c3d5dd220ed8ed0a4d4783b3',
      previousHash: '00000e47adca0f1baa054521f1a1e9e4a249b9559966a66e564288940e96f8ca',
      timestamp: '2026-11-08 13:15:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1008',
      caseId: 'CR-2026-1008',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1008 for Case CR-2026-1008. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '00b39c0f81d4a821938475629104857201948572019485720194857201948572',
      merkleRoot: 'd4a872123da457791785d39b0a7430ec6caa234a9b33fa95b6b393c2e6cfc029',
      signature: '0xF5E9D998A46E9C1CD4001C1633BDB4AB94DFA80C481230D9F7E27EE0FCF27705',
      tampered: false
    },
    {
      blockHeight: 9,
      blockHash: '000002946da3478822e73ba0cd78544233d95c79f8f144cb8ed30eb33dbf0d2b',
      previousHash: '0000039d0f1a7f4d8b4769aab7cf035b76df3798c3d5dd220ed8ed0a4d4783b3',
      timestamp: '2026-11-09 16:30:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1009',
      caseId: 'CR-2026-1009',
      agency: 'prosecution',
      officer: 'Adv. Elena Vance (ODA-8831)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1009 for Case CR-2026-1009. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '99c019284756291048572019485720194857201948572019485720194857201a',
      merkleRoot: '56c6c158e986d7ccfa7825843c7151a8bb8f0777adbd2407fcffc582e1537c99',
      signature: '0x3135C5B835682BC4D393460DE6C035C4BA54ACA23761C46FD3B391EB4A18AF18',
      tampered: false
    },
    {
      blockHeight: 10,
      blockHash: '000003bbcdbfbe3390c76066574c1aff6ffb3b0a0baa1a7d0184d3296d76bced',
      previousHash: '000002946da3478822e73ba0cd78544233d95c79f8f144cb8ed30eb33dbf0d2b',
      timestamp: '2026-11-10 10:00:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1010',
      caseId: 'CR-2026-1010',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1010 for Case CR-2026-1010. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '33b4920049458902341786ef34a1b2c3d4e5f607182930415263748596a7b8c9',
      merkleRoot: 'bd3f293ce00bfc3fca17fb6b215dd6c2cc535be942b82df9fb4dcccb12ce5ee3',
      signature: '0x5993DDBF082F3E4E4B057EBB2C700452653CAC3E528F65C99850EEF4E7CCDDC0',
      tampered: false
    },
    {
      blockHeight: 11,
      blockHash: '00000206ae6ea5b54ede405e4bbe24e1cb6360878f9d6525c4e32659faa815f4',
      previousHash: '000003bbcdbfbe3390c76066574c1aff6ffb3b0a0baa1a7d0184d3296d76bced',
      timestamp: '2026-11-11 05:45:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1011',
      caseId: 'CR-2026-1011',
      agency: 'police',
      officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1011 for Case CR-2026-1011. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '77d8928374650192837465019283746501928374650192837465019283746501',
      merkleRoot: '9d204826d597dbda13f87f663a693d7582ad11fface1bcbcb214f08dd5ff7a87',
      signature: '0xB664E6C5709B63E6B17961F947FE5E4B8C34946C9764BED1A7D7CD9E3A49FCF7',
      tampered: false
    },
    {
      blockHeight: 12,
      blockHash: '0000021008c2e75dd7b1b46fa0d1933546d3337d2c5a6406c0890fe060a46b23',
      previousHash: '00000206ae6ea5b54ede405e4bbe24e1cb6360878f9d6525c4e32659faa815f4',
      timestamp: '2026-11-11 19:15:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1012',
      caseId: 'CR-2026-1012',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1012 for Case CR-2026-1012. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '11a4189384756291028374650192837465019283746501928374650192837465',
      merkleRoot: 'ccd8b8056a0ec9a0d8841c4945d63e3928987d6369a85be739e2483cc1bda2ce',
      signature: '0x466AEA804C608B37BBC2F2BD6BDFCACBDFBC6085BDF017EE20558846870B5E86',
      tampered: false
    },
    {
      blockHeight: 13,
      blockHash: '0000045e885d6746d103ad72a9be7c5425fd1861fb879359db052376648f564a',
      previousHash: '0000021008c2e75dd7b1b46fa0d1933546d3337d2c5a6406c0890fe060a46b23',
      timestamp: '2026-11-12 12:10:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1013',
      caseId: 'CR-2026-1013',
      agency: 'prosecution',
      officer: 'Adv. Elena Vance (ODA-8831)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1013 for Case CR-2026-1013. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '88f1c34a90c1b4de8834aa7712c9010fee67b9a148902a3cdef4901847192837',
      merkleRoot: 'bd1a18a629d5b75e8fe0ed643559792bf555b97354a1ca0cb788588bae724248',
      signature: '0x14BA2A69AE90E80290B3324269F83377C88DD1E1598956B7511FB451472A0D4F',
      tampered: false
    },
    {
      blockHeight: 14,
      blockHash: '00000cb652c77f8da1de3c45cfdacb6a5598a1ddbb089b32aae8f23789799d83',
      previousHash: '0000045e885d6746d103ad72a9be7c5425fd1861fb879359db052376648f564a',
      timestamp: '2026-11-12 15:30:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1014',
      caseId: 'CR-2026-1014',
      agency: 'court',
      officer: 'Hon. Justice Sarah Sterling (CJMC-101)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1014 for Case CR-2026-1014. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '55b1182c4756291028374650192837465019283746501928374650192837465a',
      merkleRoot: '171e63b733c00ce772eead70b7e8f54153f55dbe7add71bbebfdba36c1e8d291',
      signature: '0xCEDEE3444824C18B18EAB0C546BF7AD4DF4A1D8DFD26453798A3E430F70037A3',
      tampered: false
    },
    {
      blockHeight: 15,
      blockHash: '00000579bb697ee7f5e99662ac1c133a9330367838c6803656732c12cb7eadc4',
      previousHash: '00000cb652c77f8da1de3c45cfdacb6a5598a1ddbb089b32aae8f23789799d83',
      timestamp: '2026-11-13 10:15:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1015',
      caseId: 'CR-2026-1015',
      agency: 'prosecution',
      officer: 'Adv. Elena Vance (ODA-8831)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1015 for Case CR-2026-1015. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '44a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      merkleRoot: '75936951e31243fec3ccfe8ce24c78681802cdea6de0b626e9ddfc943e0eb38f',
      signature: '0x87DF22A85239DA74198AD1858E55B9E93DD4BCFDC34D947BDDA2954E4977EB01',
      tampered: false
    },
    {
      blockHeight: 16,
      blockHash: '00000c70504a3b5d50ed13c2b137aab3bbe38ec26482c67f90d39501caaa4145',
      previousHash: '00000579bb697ee7f5e99662ac1c133a9330367838c6803656732c12cb7eadc4',
      timestamp: '2026-11-13 17:00:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1016',
      caseId: 'CR-2026-1016',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1016 for Case CR-2026-1016. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '22c8891d4756291028374650192837465019283746501928374650192837465a',
      merkleRoot: 'e3ab0fcdb9a967fd2708e516cf9f45e6b76fa31ae190441a8cb8263e4472bf86',
      signature: '0x817E40F444284CD4D6800753CE9FC2FE7E22117D91696976AC536BB3922163A4',
      tampered: false
    },
    {
      blockHeight: 17,
      blockHash: '0000077f82677bf6a54a50ed31ad290cbd15430d1cacb67fc39d7220415caddc',
      previousHash: '00000c70504a3b5d50ed13c2b137aab3bbe38ec26482c67f90d39501caaa4145',
      timestamp: '2026-11-14 09:15:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1017',
      caseId: 'CR-2026-1017',
      agency: 'prosecution',
      officer: 'Adv. Elena Vance (ODA-8831)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1017 for Case CR-2026-1017. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '99d2401e4756291028374650192837465019283746501928374650192837465a',
      merkleRoot: '8332b9bc56027a2e5cf5ca697d98003c70ed4b63677a855777835fc70aacfe9e',
      signature: '0xEA6BA31E239CD6264E5FA3C0BA6AA1EAE98C541F8F10DC179EC6E391002433C0',
      tampered: false
    },
    {
      blockHeight: 18,
      blockHash: '00000b5e7c0cf2c27c5b866de5d7eed575f21631ad2d5329efa2605d5a2cc25b',
      previousHash: '0000077f82677bf6a54a50ed31ad290cbd15430d1cacb67fc39d7220415caddc',
      timestamp: '2026-11-14 13:45:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1018',
      caseId: 'CR-2026-1018',
      agency: 'police',
      officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1018 for Case CR-2026-1018. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'd1a78436027212b3c7b4c099d680049cbd2cf9a8a472ce7c9705dd6cd516d477',
      merkleRoot: '39d5a774af152f99760e4938010a5b6acff2c21695947d6c48271aa77915666d',
      signature: '0xF5982AEBBA2352CB41DFF451A823EC4F6CA41B621280629CDC8DAF8EE50E0446',
      tampered: false
    },
    {
      blockHeight: 19,
      blockHash: '0000062e12c9567f359cc9a90d4470f3f7489afab9a3ed8dc0e54d8d6cd9698e',
      previousHash: '00000b5e7c0cf2c27c5b866de5d7eed575f21631ad2d5329efa2605d5a2cc25b',
      timestamp: '2026-11-15 11:10:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1019',
      caseId: 'CR-2026-1019',
      agency: 'police',
      officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1019 for Case CR-2026-1019. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: '6663b3bfc74e65a01e5bd0f274e4152a858b15eaaddd21730412112085c60ad7',
      merkleRoot: '95ebbfd541d0586125d4dcf053a9764f1dee9a9fe985e740e52765fb388e24bb',
      signature: '0x03E8428B74CCCD804510F342DDD0A25892D57B6FC835FA3A60D6D74B5E550FC8',
      tampered: false
    },
    {
      blockHeight: 20,
      blockHash: '00000c3ff1f6fdb98e668b719f3e340f6cbd71fa8d2dcd2a67044eec43ef8543',
      previousHash: '0000062e12c9567f359cc9a90d4470f3f7489afab9a3ed8dc0e54d8d6cd9698e',
      timestamp: '2026-11-15 16:45:00 UTC',
      eventType: 'GENESIS_SEIZURE',
      evidenceId: 'EVD-2026-1020',
      caseId: 'CR-2026-1020',
      agency: 'forensics',
      officer: 'Dr. Aris Thorne (CFSL-4402)',
      actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1020 for Case CR-2026-1020. Standard FIPS 180-4 SHA-256 seal anchored.',
      evidenceHash: 'eb206cacf8df15f3f54b396461ac40f058ac20e8c5293c927bdd8293c2f5d12e',
      merkleRoot: '7851504916ef01dc82a528f0ff8976b28f4c03ad45d70636167ac28a0d4e1abb',
      signature: '0x29D0ACB4466297EBFA3F65FB65C2DAD55D4A89F7B9367D8B761A282692B4CAE4',
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
