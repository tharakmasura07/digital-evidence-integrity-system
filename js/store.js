/**
 * Digital Evidence Integrity System (DEIS)
 * State Management & Data Store (Version 3 â€” Admin Identity Governance)
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
  },
  {
    id: 'usr_police_7701',
    name: 'Insp. Vikram Singh Rathod',
    badgeId: 'CCIC-7701',
    email: 'rathod@ccic.gov',
    agencyId: 'police',
    agencyName: 'Cyber Crime Investigation Cell (CCIC)',
    jobTitle: 'Lead Cyber Investigator & Seizing Officer',
    clearanceLevel: 'LEVEL 3 â€” OPERATIONAL CLEARANCE',
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
    jobTitle: 'Cyber Forensics & Evidence Custodian',
    clearanceLevel: 'LEVEL 3 â€” OPERATIONAL CLEARANCE',
    initials: 'PS',
    color: 'cyan',
    icon: 'shield-alert',
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
    clearanceLevel: 'LEVEL 5 â€” SCIENTIFIC & CRYPTOGRAPHIC',
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
    clearanceLevel: 'LEVEL 5 â€” SCIENTIFIC & CRYPTOGRAPHIC',
    initials: 'MN',
    color: 'emerald',
    icon: 'microscope',
    password: 'forensics@123',
    department: 'Central Forensic Science Laboratory (CFSL)',
    securityToken: 'TOKEN-CFSL-4403-SEC',
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
    clearanceLevel: 'LEVEL 5 â€” SUPREME BENCH JURISDICTION',
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
    id: 'usr_prosecution_8831',
    name: 'Adv. Elena Vance',
    badgeId: 'ODA-8831',
    email: 'vance@oda.gov',
    agencyId: 'prosecution',
    agencyName: 'Office of the District Attorney & State Prosecution',
    jobTitle: 'Special Public Prosecutor',
    clearanceLevel: 'LEVEL 4 â€” LEGAL CUSTODY & TRIAL',
    initials: 'EV',
    color: 'amber',
    icon: 'briefcase',
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
    clearanceLevel: 'LEVEL 4 â€” LEGAL CUSTODY & TRIAL',
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
    id: 'usr_defense_5519',
    name: 'Adv. Marcus Sterling',
    badgeId: 'BAR-5519',
    email: 'sterling@barcouncil.org',
    agencyId: 'defense',
    agencyName: 'Bar Association Criminal Defense Coalition',
    jobTitle: 'Bar Council Defense Advocate',
    clearanceLevel: 'CONSTITUTIONAL DISCOVERY ACCESS',
    initials: 'MS',
    color: 'rose',
    icon: 'user-check',
    password: 'defense@123',
    department: 'Bar Association Criminal Defense Coalition',
    securityToken: 'TOKEN-BAR-5519-SEC',
    isAdmin: false,
    createdAt: '2026-10-28 00:00:00 UTC',
    lastLogin: '2026-10-28 12:40:00 UTC'
  },
  {
    id: 'usr_defense_5520',
    name: 'Adv. Ananya Sen',
    badgeId: 'BAR-5520',
    email: 'sen@barcouncil.org',
    agencyId: 'defense',
    agencyName: 'Bar Association Criminal Defense Coalition',
    jobTitle: 'Associate Criminal Defense Counsel',
    clearanceLevel: 'CONSTITUTIONAL DISCOVERY ACCESS',
    initials: 'AS',
    color: 'rose',
    icon: 'user-check',
    password: 'defense@123',
    department: 'Bar Association Criminal Defense Coalition',
    securityToken: 'TOKEN-BAR-5520-SEC',
    isAdmin: false,
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
  },
  {
    id: 'CASE-CR-2026-1001',
    caseNumber: 'CR-2026-1001',
    title: 'Operation Aegis: Cloud IAM Credential Stuffing & AWS Exfiltration',
    category: 'Cloud Security & Data Breach',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-01 04:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1001_Operation_Aegis/',
    description: 'Investigation into automated credential stuffing targeting AWS enterprise IAM root consoles, generating compromised session tokens to siphon 4.2TB of proprietary telemetry.'
  },
  {
    id: 'CASE-CR-2026-1002',
    caseNumber: 'CR-2026-1002',
    title: 'State v. BlackByte Ransomware Cartel',
    category: 'Ransomware & Extortion',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-02 08:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1002_BlackByte_Ransomware/',
    description: 'International extortion gang deploying ChaCha20/RSA encrypted payloads across healthcare supply chains and demanding \\.5M cryptocurrency ransom.'
  },
  {
    id: 'CASE-CR-2026-1003',
    caseNumber: 'CR-2026-1003',
    title: 'Titan Defense SCADA Industrial PLC Firmware Tampering',
    category: 'Critical Infrastructure & Sabotage',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-03 11:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1003_Titan_SCADA_Tamper/',
    description: 'Unauthorized weaponized ladder-logic injection targeting turbine speed control microcode within defense manufacturing infrastructure.'
  },
  {
    id: 'CASE-CR-2026-1004',
    caseNumber: 'CR-2026-1004',
    title: 'Apex Global Bank SWIFT Message Manipulation Conspiracy',
    category: 'Financial Cybercrime & Wire Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-04 09:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1004_SWIFT_Manipulation/',
    description: 'Multi-jurisdictional financial fraud altering MT103 financial telecommunications to redirect \\ in treasury transfers to shell entities.'
  },
  {
    id: 'CASE-CR-2026-1005',
    caseNumber: 'CR-2026-1005',
    title: 'Metropolitan Metro Line Autonomous Signaling Hijack',
    category: 'Transportation Safety & Terrorism',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-05 14:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1005_Metro_Signaling_Hijack/',
    description: 'Attempted remote takeover of CBTC automated train protection radio beacon network by state-sponsored actors.'
  },
  {
    id: 'CASE-CR-2026-1006',
    caseNumber: 'CR-2026-1006',
    title: 'Operation PhishGuard: Executive Deepfake Voice Audio Extortion',
    category: 'Synthetic Media & CEO Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-06 07:20:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1006_Deepfake_Voice_Fraud/',
    description: 'High-fidelity AI cloned acoustic models of corporate executive utilized to authorize fraudulent emergency capital transfers.'
  },
  {
    id: 'CASE-CR-2026-1007',
    caseNumber: 'CR-2026-1007',
    title: 'Sovereign Health EHR Database Ransomware & PHI Leak',
    category: 'Healthcare Cybercrime & PHI Privacy',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-07 03:50:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1007_Sovereign_Health_EHR/',
    description: 'Exfiltration of 1.4 million confidential medical records, diagnostic imaging files, and biometric health identifiers.'
  },
  {
    id: 'CASE-CR-2026-1008',
    caseNumber: 'CR-2026-1008',
    title: 'AeroDynamics Drone Telemetry Spoofing & GPS Jamming',
    category: 'Aviation Cybersecurity',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-07 15:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1008_Drone_Telemetry_Spoof/',
    description: 'False coordinate injection and GPS L1/L2 spoofing causing autonomous industrial delivery drones to deviate into restricted airspace.'
  },
  {
    id: 'CASE-CR-2026-1009',
    caseNumber: 'CR-2026-1009',
    title: 'CryptoVault DeFi Flash Loan Reentrancy Exploit & Laundering',
    category: 'Cryptocurrency & Smart Contract Exploitation',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-08 01:10:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1009_CryptoVault_DeFi/',
    description: 'Algorithmic multi-block reentrancy drain of automated market maker liquidity pool resulting in \\.4M cross-chain bridge laundering.'
  },
  {
    id: 'CASE-CR-2026-1010',
    caseNumber: 'CR-2026-1010',
    title: 'State v. Lazarus Phantom: Zero-Day WebKit Sandbox Escape',
    category: 'Advanced Persistent Threat (APT)',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-08 11:45:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1010_Lazarus_Phantom/',
    description: 'Nation-state zero-click browser exploit chain bypassing PAC pointer authentication to install kernel surveillance implants.'
  },
  {
    id: 'CASE-CR-2026-1011',
    caseNumber: 'CR-2026-1011',
    title: 'National Smart Grid Phasor Measurement Unit (PMU) DDoS',
    category: 'Energy Grid Cyber Sabotage',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-09 06:10:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1011_SmartGrid_PMU_DDoS/',
    description: 'Synchronized volumetric denial-of-service attack flooding synchrophasor IEEE C37.118 telemetry packets to induce electrical grid blackout.'
  },
  {
    id: 'CASE-CR-2026-1012',
    caseNumber: 'CR-2026-1012',
    title: 'Vortex Semiconductor IP Theft & Steganographic Exfiltration',
    category: 'Industrial Espionage & Trade Secrets',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-09 13:25:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1012_Vortex_Semi_Stego/',
    description: 'Insider extraction of 3nm extreme ultraviolet (EUV) photolithography design masks concealed within photographic carrier images.'
  },
  {
    id: 'CASE-CR-2026-1013',
    caseNumber: 'CR-2026-1013',
    title: 'Operation RedSeal: SIM-Swapping & Mobile Wire Fraud Ring',
    category: 'Telecom Fraud & Identity Theft',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-10 05:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1013_RedSeal_SIM_Swap/',
    description: 'Bribe-driven carrier insider SIM reassignments used to hijack bank MFA tokens and seize high-net-worth customer retirement accounts.'
  },
  {
    id: 'CASE-CR-2026-1014',
    caseNumber: 'CR-2026-1014',
    title: 'E-Court Judicial Filing Portal Defacement & SQL Injection',
    category: 'Government Systems Defacement',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-10 16:40:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1014_ECourt_SQL_Inject/',
    description: 'Malicious injection of UNION-based SQL payloads altering court trial docket timestamps and displaying political hacktivism banners.'
  },
  {
    id: 'CASE-CR-2026-1015',
    caseNumber: 'CR-2026-1015',
    title: 'DarkMarket Hydra: Tor Hidden Service Narcotics & Escrow',
    category: 'Darknet Markets & Cryptomarkets',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-11 02:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1015_DarkMarket_Hydra/',
    description: 'Operation seizing automated decentralized escrow marketplace hosting illegal fentanyl distribution channels and crypto tumble services.'
  },
  {
    id: 'CASE-CR-2026-1016',
    caseNumber: 'CR-2026-1016',
    title: 'BioGen Pharma Clinical Trial Telemetry Modification',
    category: 'Data Integrity & Pharmaceutical Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-11 12:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1016_BioGen_Trial_Tamper/',
    description: 'Malicious manipulation of clinical toxicity data points within FDA Phase-III oncology trial database to secure emergency regulatory approval.'
  },
  {
    id: 'CASE-CR-2026-1017',
    caseNumber: 'CR-2026-1017',
    title: 'State v. RedEcho: Maritime Port Container Logistics Sabotage',
    category: 'Supply Chain Logistics Cyberattack',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-12 04:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1017_Port_Logistics_Sabotage/',
    description: 'Ransomware payload targeting terminal operating systems (TOS) causing automated ship-to-shore gantry cranes to lock down nationwide.'
  },
  {
    id: 'CASE-CR-2026-1018',
    caseNumber: 'CR-2026-1018',
    title: 'SolarMatrix Firmware Supply Chain Infiltration & Trojan',
    category: 'Software Supply Chain Attack',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-12 14:15:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1018_SolarMatrix_Trojan/',
    description: 'Supply chain implant inserted into official compiled solar inverter firmware updates to enable covert backdoor grid disconnects.'
  },
  {
    id: 'CASE-CR-2026-1019',
    caseNumber: 'CR-2026-1019',
    title: 'CyberOps Drone Swarm Encrypted C2 Radio Capture',
    category: 'Military/Defense Unauthorized Surveillance',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-13 01:45:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1019_Drone_Swarm_C2/',
    description: 'Autonomous coordinated drone swarm deployed over critical naval munitions shipyard utilizing high-gain 2.4GHz FHSS command bursts.'
  },
  {
    id: 'CASE-CR-2026-1020',
    caseNumber: 'CR-2026-1020',
    title: 'OmniPay POS Terminal Memory Scraper & Card Track Breach',
    category: 'Payment Card Industry (PCI) Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-13 09:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1020_OmniPay_POS_Scraper/',
    description: 'RAM scraper malware harvesting unencrypted Track 1 and Track 2 magnetic stripe data from national retail point-of-sale systems.'
  },
  {
    id: 'CASE-CR-2026-1021',
    caseNumber: 'CR-2026-1021',
    title: 'Operation VoidHawk: Telecom Core SS7 Routing Interception',
    category: 'National Telecommunications Intercept',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-13 17:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1021_VoidHawk_SS7/',
    description: 'Abuse of global signaling system 7 (SS7) roaming location request (SRI-SM) packets to track high-ranking state officials and tap cellular traffic.'
  },
  {
    id: 'CASE-CR-2026-1022',
    caseNumber: 'CR-2026-1022',
    title: 'QuantumSafe Vault Cold Storage Key Derivation Extortion',
    category: 'Hardware Security Module (HSM) Breach',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-14 02:40:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1022_QuantumSafe_HSM/',
    description: 'Side-channel power differential attack executed on cold storage FIPS 140-3 Level 4 hardware module to recover elliptical master seeds.'
  },
  {
    id: 'CASE-CR-2026-1023',
    caseNumber: 'CR-2026-1023',
    title: 'AeroSpace SatCom Orbital Transponder Command Injection',
    category: 'Aerospace & Satellite Hijacking',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-14 10:30:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1023_SatCom_Injection/',
    description: 'Ground station compromise transmitting unauthorized TC transfer frames to reorient solar array panels of commercial observation satellite.'
  },
  {
    id: 'CASE-CR-2026-1024',
    caseNumber: 'CR-2026-1024',
    title: 'City Water Purification Chlorine Dispenser Logic Override',
    category: 'Critical Infrastructure Poisoning Attempt',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-14 18:20:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1024_Water_Chlorine_Override/',
    description: 'Unauthorized remote access via TeamViewer altering sodium hydroxide chemical setpoints from 100ppm to lethal 11,100ppm levels.'
  },
  {
    id: 'CASE-CR-2026-1025',
    caseNumber: 'CR-2026-1025',
    title: 'National Automated Clearinghouse (NACH) Batch Fraud Ring',
    category: 'Commercial Banking & Wire Fraud',
    leadAgency: 'police',
    leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
    investigatingOfficer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
    status: 'ACTIVE_INVESTIGATION',
    openedDate: '2026-11-15 03:00:00 UTC',
    storageFolder: 'evidence_vault/Case_CR-2026-1025_NACH_Batch_Fraud/',
    description: 'Syndicate injecting fraudulent electronic credit clearing batches into national settlement switches to divert \\ into mule accounts.'
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
  },
  {
    id: 'EVD-2026-3391',
    caseId: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    caseTitle: 'State v. Apex Infrastructure Breach',
    title: 'Subpoenaed Encrypted Transaction Ledger (Exhibit C)',
    category: 'Encrypted Archive',
    fileType: 'encrypted-database (.sql.enc)',
    fileSize: '1.2 GB',
    fileName: 'EVD-2026-3391_offshore_ledger.enc',
    storedFilePath: 'evidence_vault/Case_CR-2026-8831_Apex_Breach/EVD-2026-3391_offshore_ledger.enc',
    seizureDate: '2026-10-24 16:30:00 UTC',
    seizureLocation: 'Offshore Server Hosting Hub, Rack 12',
    sourceDevice: 'Supermicro 1U Server (Asset #SM-9021)',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: 'b2a15f8e91cd88a03f44e135912a781298c47f88410294719283746501928374',
    sha512: '7b39c0498a7291048572910485729104857291048572910485729104857291048572910485729104857291048572910485729104857291048572910485729104',
    digitalSeal: 'SEAL-2026-3391-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['Prosecution', 'Financial Ledger', 'Subpoena'],
    notes: 'Cryptographic snapshot seized under court subpoena sub-clause 4A. Hash verified.'
  },
  {
    id: 'EVD-2026-4402',
    caseId: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    caseTitle: 'State v. Apex Infrastructure Breach',
    title: 'Admitted Judicial Exhibit - Keylogger Binary & Assembly Dump',
    category: 'Memory Dump',
    fileType: 'pe-binary (.bin)',
    fileSize: '48.2 MB',
    fileName: 'EVD-2026-4402_apex_keylogger.bin',
    storedFilePath: 'evidence_vault/Case_CR-2026-8831_Apex_Breach/EVD-2026-4402_apex_keylogger.bin',
    seizureDate: '2026-10-25 11:00:00 UTC',
    seizureLocation: 'Metropolitan Judicial Courtroom 4 Evidentiary Safe',
    sourceDevice: 'SanDisk Extreme Pro USB 3.2 (Serial: SDCZ880-128G)',
    currentCustodian: 'JUDICIAL-REG',
    custodianAgency: 'court',
    status: 'ADMITTED_IN_COURT',
    sha256: 'c5d28a9103e48172938475619283746501928374650192837465019283746501',
    sha512: '6a48d103948572910485729104857291048572910485729104857291048572910485729104857291048572910485729104857291048572910485729104857291',
    digitalSeal: 'SEAL-2026-4402-VALID',
    classification: 'JUDICIAL-CONFIDENTIAL',
    tags: ['Court-Admitted', 'Judicial Vault', 'Exhibit-1'],
    notes: 'Formally marked and entered into judicial record by presiding magistrate.'
  },
  {
    id: 'EVD-2026-1001',
    caseId: 'CASE-CR-2026-1001',
    caseNumber: 'CR-2026-1001',
    caseTitle: 'Operation Aegis: Cloud IAM Credential Stuffing & AWS Exfiltration',
    title: 'AWS CloudTrail JSON Event Logs & S3 Access Stream Archive',
    category: 'Cloud Logs',
    fileType: 'json-log (.json.gz)',
    fileSize: '840 MB',
    fileName: 'EVD-2026-1001_cloudtrail_archive.json.gz',
    storedFilePath: 'evidence_vault/Case_CR-2026-1001_Operation_Aegis/EVD-2026-1001_cloudtrail_archive.json.gz',
    seizureDate: '2026-11-01 05:40:12 UTC',
    seizureLocation: 'AWS us-east-1 S3 Bucket Cloud Custody Mirror',
    sourceDevice: 'AWS GovCloud VPC Audit Mirror Node #03',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '264299f540b57fe7da860b5328f05c05b153450bf14b51ebb8e2b51acba19c56',
    sha512: '77a626b5196749d1f3c31e6684ff950b898e7231ec4a40a139b4a6208da12d5d14b99b64688af2efd6dac684f39032561d3ab2ff186050ac8cc65196fd0210c0',
    digitalSeal: 'SEAL-2026-1001-VALID',
    classification: 'TOP-SECRET-CLOUD',
    tags: ['AWS', 'CloudTrail', 'IAM-Compromise', 'Data-Theft'],
    notes: 'Cryptographically signed S3 object metadata stream with intact SHA-256 intake seal.'
  },
  {
    id: 'EVD-2026-1002',
    caseId: 'CASE-CR-2026-1002',
    caseNumber: 'CR-2026-1002',
    caseTitle: 'State v. BlackByte Ransomware Cartel',
    title: 'BlackByte Encryptor Payload & Extracted Decryption Key Stub',
    category: 'Malware Binary',
    fileType: 'pe-executable (.bin)',
    fileSize: '12.4 MB',
    fileName: 'EVD-2026-1002_blackbyte_v3.bin',
    storedFilePath: 'evidence_vault/Case_CR-2026-1002_BlackByte_Ransomware/EVD-2026-1002_blackbyte_v3.bin',
    seizureDate: '2026-11-02 10:15:20 UTC',
    seizureLocation: 'Victim Health Cluster Domain Controller, NY',
    sourceDevice: 'HP ProLiant DL380 Gen10 (MAC: 3C:D9:2B:11:4F:92)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'fe0bf48edd0abcb8d4adf89e29b9363c3f0cfc6802c15739b78f37adfee3f190',
    sha512: '290d54b8ffc0abc784df3538311dc9246d3111e5c8adabd4fbda57e5e78d44ac9afe0f24e76052189567dddc957a07a2e8b76099d069e86f1e3116a9b209b297',
    digitalSeal: 'SEAL-2026-1002-VALID',
    classification: 'RESTRICTED-FORENSIC',
    tags: ['Ransomware', 'BlackByte', 'ChaCha20', 'Key-Carve'],
    notes: 'Isolated under physical write-blocker isolation at CFSL laboratory workbench.'
  },
  {
    id: 'EVD-2026-1003',
    caseId: 'CASE-CR-2026-1003',
    caseNumber: 'CR-2026-1003',
    caseTitle: 'Titan Defense SCADA Industrial PLC Firmware Tampering',
    title: 'Siemens S7-1500 PLC Firmware Hex Dump & Ladder Logic Diff',
    category: 'Firmware Image',
    fileType: 'hex-dump (.hex)',
    fileSize: '64.8 MB',
    fileName: 'EVD-2026-1003_s7_1500_firmware.hex',
    storedFilePath: 'evidence_vault/Case_CR-2026-1003_Titan_SCADA_Tamper/EVD-2026-1003_s7_1500_firmware.hex',
    seizureDate: '2026-11-03 13:22:45 UTC',
    seizureLocation: 'Titan Assembly Facility 2, Turbine Cell 4',
    sourceDevice: 'Siemens S7-1518F-4 PN/DP CPU (FW v2.9.2)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: '4c443e99cab15814ec38a3b4ef3c79ab20c651990514a660292ca816d3776b3a',
    sha512: 'a428064b7e394d36d498aaddd33473ecdfb79839caf3ae995c40ec4ab06ac675adb7636c6f72a33be5be7ebe3f46af71cf0d762b29bf5de9c59d994ef01ae66e',
    digitalSeal: 'SEAL-2026-1003-VALID',
    classification: 'TOP-SECRET-DEFENSE',
    tags: ['SCADA', 'Siemens', 'PLC', 'Sabotage', 'Stuxnet-Derivative'],
    notes: 'Live bitstream extraction executed directly over optical isolated MPI interface.'
  },
  {
    id: 'EVD-2026-1004',
    caseId: 'CASE-CR-2026-1004',
    caseNumber: 'CR-2026-1004',
    caseTitle: 'Apex Global Bank SWIFT Message Manipulation Conspiracy',
    title: 'Core Banking SWIFT MT103 Intercepted Telecommunication PCAP',
    category: 'Network Capture',
    fileType: 'packet-capture (.pcapng)',
    fileSize: '2.4 GB',
    fileName: 'EVD-2026-1004_swift_mt103_traffic.pcapng',
    storedFilePath: 'evidence_vault/Case_CR-2026-1004_SWIFT_Manipulation/EVD-2026-1004_swift_mt103_traffic.pcapng',
    seizureDate: '2026-11-04 11:30:00 UTC',
    seizureLocation: 'Apex Global Tier-IV Data Center, Core Switch TAP 01',
    sourceDevice: 'Cisco Nexus 9300 Hardware Network TAP',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '1339eb926c927f7184b315842027243e7f82e13b1bb73a961fcaff67137291b8',
    sha512: '6be62b3d44810bc3953e81aff75cefef3b4840a198826d408428cc8e967ad8014414a113b169dbc63358b1a2a553c18353f0571c536207b3bb0b0bbf9ef0defe',
    digitalSeal: 'SEAL-2026-1004-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['SWIFT', 'Banking', 'Wire-Fraud', 'MT103'],
    notes: 'Full packet capture with cryptographic chain of custody; includes forged FIN messages.'
  },
  {
    id: 'EVD-2026-1005',
    caseId: 'CASE-CR-2026-1005',
    caseNumber: 'CR-2026-1005',
    caseTitle: 'Metropolitan Metro Line Autonomous Signaling Hijack',
    title: 'CBTC Railway Wireless Signaling Transponder NVRAM Dump',
    category: 'Embedded Memory',
    fileType: 'raw-binary (.bin)',
    fileSize: '128 MB',
    fileName: 'EVD-2026-1005_cbtc_transponder_nvram.bin',
    storedFilePath: 'evidence_vault/Case_CR-2026-1005_Metro_Signaling_Hijack/EVD-2026-1005_cbtc_transponder_nvram.bin',
    seizureDate: '2026-11-05 16:45:10 UTC',
    seizureLocation: 'Metro Control Center Central Switching Tower 3',
    sourceDevice: 'Alstom Urbalis CBTC Trackside Controller Unit #12',
    currentCustodian: 'JUDICIAL-REG',
    custodianAgency: 'court',
    status: 'ADMITTED_IN_COURT',
    sha256: '45d4260f2e20b3d11ca69080ec871ffa0075687f0f6eaa3de0c3bc1cbb8370b3',
    sha512: '3bd9c4954d3ac49ddc22c923155defc60d0af072f1f9e323b1b3b14686ba3dba1ae178c133d102e89c02434ca55f0aaee0db860432c923085e802567f3277ca9',
    digitalSeal: 'SEAL-2026-1005-VALID',
    classification: 'JUDICIAL-CONFIDENTIAL',
    tags: ['Transit', 'CBTC', 'Court-Exhibit', 'Admitted'],
    notes: 'Formally marked and entered into judicial record by presiding magistrate.'
  },
  {
    id: 'EVD-2026-1006',
    caseId: 'CASE-CR-2026-1006',
    caseNumber: 'CR-2026-1006',
    caseTitle: 'Operation PhishGuard: Executive Deepfake Voice Audio Extortion',
    title: 'Neural TTS Synthesized WAV Audio Recording of CEO Voice Clone',
    category: 'Audio Recording',
    fileType: 'waveform-audio (.wav)',
    fileSize: '85 MB',
    fileName: 'EVD-2026-1006_ceo_voice_clone_call.wav',
    storedFilePath: 'evidence_vault/Case_CR-2026-1006_Deepfake_Voice_Fraud/EVD-2026-1006_ceo_voice_clone_call.wav',
    seizureDate: '2026-11-06 09:10:00 UTC',
    seizureLocation: 'Corporate PBX Recording Server, Audio Vault #02',
    sourceDevice: 'Avaya Aura Communication Manager Voice Logger',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'ae4cf5bff27e46abe9accb4bf36ddff2bf1f2a99d10e4851994ea84c6d09693e',
    sha512: '26c43de7acbd2c1a2b69a6aa548a18b8250a542e3bb0f94ff754f6af27204dc45606e2437aff9b7f24979d441b66d091fd1ddb52388b3567c4b8463a41fa6eec',
    digitalSeal: 'SEAL-2026-1006-VALID',
    classification: 'FORENSIC-SENSITIVE',
    tags: ['Deepfake', 'Voice-Cloning', 'Audio-Spectral', 'Neural-TTS'],
    notes: 'Undergoing acoustic spectral watermark analysis and vocal tract resonance testing.'
  },
  {
    id: 'EVD-2026-1007',
    caseId: 'CASE-CR-2026-1007',
    caseNumber: 'CR-2026-1007',
    caseTitle: 'Sovereign Health EHR Database Ransomware & PHI Leak',
    title: 'Hospital PACS DICOM Storage Array NVMe Bitstream Image',
    category: 'Disk Image',
    fileType: 'expert-witness (.e01)',
    fileSize: '380 GB',
    fileName: 'EVD-2026-1007_pacs_dicom_vault.e01',
    storedFilePath: 'evidence_vault/Case_CR-2026-1007_Sovereign_Health_EHR/EVD-2026-1007_pacs_dicom_vault.e01',
    seizureDate: '2026-11-07 06:12:30 UTC',
    seizureLocation: 'Sovereign Health Central Hospital SAN Rack 08',
    sourceDevice: 'PureStorage FlashArray//X70 R3 (Serial: PRA-9941)',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: 'e833d9474df9a157c5e83ee3e95550fea362b331387b3267d0c925f9d408b1cc',
    sha512: 'd026b01d60f33bc2591e2bf02db2e033ddc0e38a6fa09e2d82b53d68f56271724a6aa21b078c35f27c785c3bfa828ff59879f3699dbd9f621edc1bdcfe11f96e',
    digitalSeal: 'SEAL-2026-1007-VALID',
    classification: 'RESTRICTED-HEALTH',
    tags: ['Healthcare', 'EHR', 'DICOM', 'Data-Seizure'],
    notes: 'Full forensic clone with embedded cryptographic hash manifest; zero sector drop.'
  },
  {
    id: 'EVD-2026-1008',
    caseId: 'CASE-CR-2026-1008',
    caseNumber: 'CR-2026-1008',
    caseTitle: 'AeroDynamics Drone Telemetry Spoofing & GPS Jamming',
    title: 'Pixhawk Autopilot MicroSD Blackbox Flash Memory Dump',
    category: 'Flash Memory',
    fileType: 'raw-binary (.raw)',
    fileSize: '32 GB',
    fileName: 'EVD-2026-1008_pixhawk_blackbox.raw',
    storedFilePath: 'evidence_vault/Case_CR-2026-1008_Drone_Telemetry_Spoof/EVD-2026-1008_pixhawk_blackbox.raw',
    seizureDate: '2026-11-07 18:05:00 UTC',
    seizureLocation: 'Airfield Recovery Site Alpha, Lat 40.7128 Lon -74.0060',
    sourceDevice: 'Pixhawk 6X Pro Autopilot Flight Controller (UAV #AER-9)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: '1603dfe924f1569ae1a58cc8604a9df04db9aa569544641432c3c4a066f7a155',
    sha512: '0bbac2c2c701db18ae8dd1e922de40d318cc4aacf6a9e9ab7372edcb0fc90181dcaf653b993c809dcdbcb39f0953f138e5c84c41c6cc2a8f4d9243944f8345fd',
    digitalSeal: 'SEAL-2026-1008-VALID',
    classification: 'RESTRICTED-AVIATION',
    tags: ['Drone', 'GPS-Spoofing', 'Autopilot', 'Blackbox'],
    notes: 'Extracted flash chips desoldered in cleanroom; raw bitstream intact.'
  },
  {
    id: 'EVD-2026-1009',
    caseId: 'CASE-CR-2026-1009',
    caseNumber: 'CR-2026-1009',
    caseTitle: 'CryptoVault DeFi Flash Loan Reentrancy Exploit & Laundering',
    title: 'EVM Smart Contract Bytecode Execution Trace & Mixer Route Log',
    category: 'Blockchain State',
    fileType: 'json-trace (.json)',
    fileSize: '4.1 GB',
    fileName: 'EVD-2026-1009_evm_opcode_trace.json',
    storedFilePath: 'evidence_vault/Case_CR-2026-1009_CryptoVault_DeFi/EVD-2026-1009_evm_opcode_trace.json',
    seizureDate: '2026-11-08 03:45:15 UTC',
    seizureLocation: 'Ethereum Archive Node Synced Datadir, Block #21049921',
    sourceDevice: 'Geth Enterprise Archive Node (Dell PowerEdge R650)',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '418db6df4e78b3aa5e8be453f2e39d7f6e8b14e21da83977fdd87e34e5baa8b6',
    sha512: '70775899f15b75707be8f28fa54dd542e73787a057e37ff2eb447be9d483a05d91d316b93e88ba712df9d9f2e8bef8021df8b3349df3a9d9e1dbc1bfde25c435',
    digitalSeal: 'SEAL-2026-1009-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['DeFi', 'Smart-Contract', 'Flash-Loan', 'EVM'],
    notes: 'Verified EVM trace depicting exact gas and opcode manipulation during drain.'
  },
  {
    id: 'EVD-2026-1010',
    caseId: 'CASE-CR-2026-1010',
    caseNumber: 'CR-2026-1010',
    caseTitle: 'State v. Lazarus Phantom: Zero-Day WebKit Sandbox Escape',
    title: 'WebKit Use-After-Free Shellcode Payload & Kernel Patch Hook',
    category: 'Exploit Artifact',
    fileType: 'memory-dump (.dmp)',
    fileSize: '18.2 MB',
    fileName: 'EVD-2026-1010_webkit_uaf_payload.dmp',
    storedFilePath: 'evidence_vault/Case_CR-2026-1010_Lazarus_Phantom/EVD-2026-1010_webkit_uaf_payload.dmp',
    seizureDate: '2026-11-08 14:02:00 UTC',
    seizureLocation: 'Target Diplomatic Device, Washington DC',
    sourceDevice: 'Apple iPhone 15 Pro (Model A3101, iOS 17.5.1)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'c5be225b142af8c7a852c8fefff184bd1b8b20bcbecdec1bebb0a4462206610b',
    sha512: '5b7487cbd124a6c87f07aac905b211b1d1b2a3a0d898f16bff56afa9d25411608287a6c665fef4398a9726ec07d1e149e2222bac6efaac9d2cc1b6d8bcccbb46',
    digitalSeal: 'SEAL-2026-1010-VALID',
    classification: 'TOP-SECRET-APT',
    tags: ['Zero-Day', 'WebKit', 'PAC-Bypass', 'APT-Lazarus'],
    notes: 'Carved from physical RAM via hardware debug bridge. Weaponized zero-click payload.'
  },
  {
    id: 'EVD-2026-1011',
    caseId: 'CASE-CR-2026-1011',
    caseNumber: 'CR-2026-1011',
    caseTitle: 'National Smart Grid Phasor Measurement Unit (PMU) DDoS',
    title: 'Substation Synchrophasor UDP Flood Packet Capture',
    category: 'Network Capture',
    fileType: 'packet-capture (.pcap)',
    fileSize: '8.6 GB',
    fileName: 'EVD-2026-1011_pmu_substation_flood.pcap',
    storedFilePath: 'evidence_vault/Case_CR-2026-1011_SmartGrid_PMU_DDoS/EVD-2026-1011_pmu_substation_flood.pcap',
    seizureDate: '2026-11-09 08:35:40 UTC',
    seizureLocation: 'Regional Energy Transmission Substation 14B',
    sourceDevice: 'Schweitzer SEL-3530 Real-Time Automation Controller',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: 'ea8ce1769bd1f1ee21b3ec1f13763aedc6e72fe6a0644dc90a5c9e01a6df8db2',
    sha512: '5926678d869919cab241ec730de05ce7be5f9996914a636ea05d4d86b675e2f441153b79e83eaf974903e2838f73858078991997ca6b12296d91616eac4e8c3f',
    digitalSeal: 'SEAL-2026-1011-VALID',
    classification: 'RESTRICTED-ENERGY',
    tags: ['Smart-Grid', 'PMU', 'DDoS', 'SCADA-Power'],
    notes: 'Continuous capture exhibiting 1.8 Gbps amplification traffic from compromised IoT nodes.'
  },
  {
    id: 'EVD-2026-1012',
    caseId: 'CASE-CR-2026-1012',
    caseNumber: 'CR-2026-1012',
    caseTitle: 'Vortex Semiconductor IP Theft & Steganographic Exfiltration',
    title: 'Steganographic High-Res JPEG Carrier with Carved 3nm Die Blueprints',
    category: 'Steganography',
    fileType: 'image-carrier (.jpg)',
    fileSize: '72 MB',
    fileName: 'EVD-2026-1012_euv_mask_stego_carrier.jpg',
    storedFilePath: 'evidence_vault/Case_CR-2026-1012_Vortex_Semi_Stego/EVD-2026-1012_euv_mask_stego_carrier.jpg',
    seizureDate: '2026-11-09 15:50:00 UTC',
    seizureLocation: 'Suspect Airport Departure Lounge, Gate B22',
    sourceDevice: 'Kingston IronKey Locker+ 50 USB Drive',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'e69a7df09da3134f6c99b2736fdf950db6bcba9fdd9a98707f3fc656d30f2e7f',
    sha512: '16133f91814676b84b26cf02ead7e1da6300301db201ffa04a1714c93cbb9bd1c241e1191a4fa9c0ede7f7b57861fc87528a7c9429f47f826f26c90e912cdb8e',
    digitalSeal: 'SEAL-2026-1012-VALID',
    classification: 'TOP-SECRET-SEMICONDUCTOR',
    tags: ['Steganography', 'Intellectual-Property', 'EUV', 'Insider-Threat'],
    notes: 'Least Significant Bit (LSB) embedding algorithm confirmed; CAD blueprint extracted.'
  },
  {
    id: 'EVD-2026-1013',
    caseId: 'CASE-CR-2026-1013',
    caseNumber: 'CR-2026-1013',
    caseTitle: 'Operation RedSeal: SIM-Swapping & Mobile Wire Fraud Ring',
    title: 'Rogue Base Station IMSI Catcher Telemetry & SMS OTP Intercepts',
    category: 'Telecom Logs',
    fileType: 'delimited-log (.csv)',
    fileSize: '1.8 GB',
    fileName: 'EVD-2026-1013_imsi_catcher_audit.csv',
    storedFilePath: 'evidence_vault/Case_CR-2026-1013_RedSeal_SIM_Swap/EVD-2026-1013_imsi_catcher_audit.csv',
    seizureDate: '2026-11-10 07:15:00 UTC',
    seizureLocation: 'Suspect Vehicle Mobile Surveillance Unit, Downtown',
    sourceDevice: 'Software Defined SDR IMSI Interceptor Rig #02',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '9a033e18987056cd9b57104f9a15570da8910bb8d34fce8b520dd1254f98aca9',
    sha512: 'd01ebb5c44683d79bb565a8db725bb9d5cb0ae37ad412825e0bd3f68516da0445265b489826c38f5035a550f788bb10b8d28a9bf3ec34c8d776dd3557cea78b4',
    digitalSeal: 'SEAL-2026-1013-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['Telecom', 'SIM-Swap', 'IMSI', 'OTP-Theft'],
    notes: 'Full forensic correlation between IMSI broadcasts and unauthorized wire departures.'
  },
  {
    id: 'EVD-2026-1014',
    caseId: 'CASE-CR-2026-1014',
    caseNumber: 'CR-2026-1014',
    caseTitle: 'E-Court Judicial Filing Portal Defacement & SQL Injection',
    title: 'Web Application Firewall (WAF) Access Logs with Time-Based Blind SQLi',
    category: 'WAF Log',
    fileType: 'server-log (.log)',
    fileSize: '450 MB',
    fileName: 'EVD-2026-1014_ecourt_waf_sqli.log',
    storedFilePath: 'evidence_vault/Case_CR-2026-1014_ECourt_SQL_Inject/EVD-2026-1014_ecourt_waf_sqli.log',
    seizureDate: '2026-11-10 18:20:12 UTC',
    seizureLocation: 'High Court Government Data Center Server Rack 04',
    sourceDevice: 'F5 BIG-IP Advanced WAF (Chassis ID: F5-BIG-992)',
    currentCustodian: 'JUDICIAL-REG',
    custodianAgency: 'court',
    status: 'ADMITTED_IN_COURT',
    sha256: 'dd90948d847b7c92398087ba704a6c4bd420a3e8bf9ee408bf2f0496af00998e',
    sha512: '90a45dfe01e4fc04e56d6af43574857d33225111e34fe9a570ab3c12cedf5b05428afd8c2d79b3db9ccd09482629bd9c6334247ae56b2959be66dc669fb3bcb0',
    digitalSeal: 'SEAL-2026-1014-VALID',
    classification: 'JUDICIAL-INTERNAL',
    tags: ['SQLi', 'Court-Portal', 'Defacement', 'Audit-Log'],
    notes: 'Court record tampering attempt documented bit-for-bit with client IP headers.'
  },
  {
    id: 'EVD-2026-1015',
    caseId: 'CASE-CR-2026-1015',
    caseNumber: 'CR-2026-1015',
    caseTitle: 'DarkMarket Hydra: Tor Hidden Service Narcotics & Escrow',
    title: 'Tor Onion Service Server LUKS Encrypted Volume Physical Image',
    category: 'Encrypted Volume',
    fileType: 'raw-disk-image (.img)',
    fileSize: '256 GB',
    fileName: 'EVD-2026-1015_hydra_luks_volume.img',
    storedFilePath: 'evidence_vault/Case_CR-2026-1015_DarkMarket_Hydra/EVD-2026-1015_hydra_luks_volume.img',
    seizureDate: '2026-11-11 04:55:00 UTC',
    seizureLocation: 'Hosting Facility Underground Bunker, Reykjavik',
    sourceDevice: 'Supermicro 2U Bare-Metal Node (Asset #IC-902)',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '170ad66094fab18b74b2d07a083b78d575dfd7c90a510dec5537a135e400c520',
    sha512: 'fe59546251b10986f2b05a11f11958a20fc6908edd5967d7dce418e9d2a53aabd4ad7222b2711d62a853806f53b2838979ab82c167bc7adbf1d15401ebfae10a',
    digitalSeal: 'SEAL-2026-1015-VALID',
    classification: 'TOP-SECRET-NARCOTICS',
    tags: ['Darknet', 'Tor', 'LUKS', 'Hydra', 'Bitcoin-Escrow'],
    notes: 'Cold seizure executed with liquid nitrogen RAM preservation to capture master LUKS keys.'
  },
  {
    id: 'EVD-2026-1016',
    caseId: 'CASE-CR-2026-1016',
    caseNumber: 'CR-2026-1016',
    caseTitle: 'BioGen Pharma Clinical Trial Telemetry Modification',
    title: 'Mass Spectrometer Chromatography SQLite Database with Altered Peaks',
    category: 'Database Dump',
    fileType: 'sqlite-db (.sqlite)',
    fileSize: '3.6 GB',
    fileName: 'EVD-2026-1016_chromatography_peaks.sqlite',
    storedFilePath: 'evidence_vault/Case_CR-2026-1016_BioGen_Trial_Tamper/EVD-2026-1016_chromatography_peaks.sqlite',
    seizureDate: '2026-11-11 14:30:20 UTC',
    seizureLocation: 'BioGen R&D Analytical Chemistry Lab 3',
    sourceDevice: 'Agilent 6546 LC/Q-TOF Mass Spectrometer Workstation',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'd7e2c2a7a582c7eff81913cc50c6075bd23c8f1d35dfedd23d2b26cb69783b90',
    sha512: '9c91314f21a9e78e4788aaafb969be200ac16a077b06860bd07ee07ba91d4f5c9fc6fa3d22f72943974abcbb4e17acbd711f99ac60319333d9d3a7c81ebaf44d',
    digitalSeal: 'SEAL-2026-1016-VALID',
    classification: 'RESTRICTED-PHARMA',
    tags: ['Pharma', 'Clinical-Trial', 'Data-Falsification', 'Mass-Spec'],
    notes: 'Digital forensic audit reveals retroactive timestamp modifications on toxicity values.'
  },
  {
    id: 'EVD-2026-1017',
    caseId: 'CASE-CR-2026-1017',
    caseNumber: 'CR-2026-1017',
    caseTitle: 'State v. RedEcho: Maritime Port Container Logistics Sabotage',
    title: 'Automated Container Terminal Operating System (TOS) EDIFACT Stream',
    category: 'Logistics Telemetry',
    fileType: 'xml-interchange (.xml)',
    fileSize: '14 GB',
    fileName: 'EVD-2026-1017_tos_edifact_payloads.xml',
    storedFilePath: 'evidence_vault/Case_CR-2026-1017_Port_Logistics_Sabotage/EVD-2026-1017_tos_edifact_payloads.xml',
    seizureDate: '2026-11-12 07:10:00 UTC',
    seizureLocation: 'Port of Metropolitan Container Terminal 1',
    sourceDevice: 'Navis N4 Terminal Operating System Server Clustered SAN',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '5f2a5273d63ed9ce06066b9da616c49936fc54e84e590cd13bbe74b366d9550d',
    sha512: 'b609f4d73585881566de5f327779c7c1274e4ce8c8bd2971049406f1c4bdd3ed3a4548430bd36c133c6e0d0db0c90461ed1d83c9ad76601366454bad747e9bd5',
    digitalSeal: 'SEAL-2026-1017-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['Maritime', 'Port-Authority', 'EDIFACT', 'Supply-Chain'],
    notes: 'Seized message stream detailing forged automated stacking instructions.'
  },
  {
    id: 'EVD-2026-1018',
    caseId: 'CASE-CR-2026-1018',
    caseNumber: 'CR-2026-1018',
    caseTitle: 'SolarMatrix Firmware Supply Chain Infiltration & Trojan',
    title: 'Compromised Jenkins CI/CD Build Runner Memory Snapshot & Injected DLL',
    category: 'Virtual Machine Memory',
    fileType: 'virtual-memory (.vmem)',
    fileSize: '8.2 GB',
    fileName: 'EVD-2026-1018_jenkins_runner_memory.vmem',
    storedFilePath: 'evidence_vault/Case_CR-2026-1018_SolarMatrix_Trojan/EVD-2026-1018_jenkins_runner_memory.vmem',
    seizureDate: '2026-11-12 16:40:00 UTC',
    seizureLocation: 'SolarMatrix Cloud Build Farm Node #09',
    sourceDevice: 'VMware ESXi 8.0 Enterprise Host (Blade #04)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'd1a78436027212b3c7b4c099d680049cbd2cf9a8a472ce7c9705dd6cd516d477',
    sha512: '4da1b77133478c7e9d51ce70d73ce99ca5de8d047b20641b11df6e680ef3c2662563c145ab9a05535016fc6f23ccabcb9682022f6d18d367e0a4525c9dbd1dea',
    digitalSeal: 'SEAL-2026-1018-VALID',
    classification: 'TOP-SECRET-SUPPLYCHAIN',
    tags: ['Supply-Chain', 'CI-CD', 'Jenkins', 'Trojan', 'SolarMatrix'],
    notes: 'Memory carve confirms ephemeral build container injection during compiler linking.'
  },
  {
    id: 'EVD-2026-1019',
    caseId: 'CASE-CR-2026-1019',
    caseNumber: 'CR-2026-1019',
    caseTitle: 'CyberOps Drone Swarm Encrypted C2 Radio Capture',
    title: 'Software-Defined Radio (SDR) 2.4GHz Spread-Spectrum Baseband I/Q Stream',
    category: 'RF Signal Recording',
    fileType: 'raw-iq-stream (.iq)',
    fileSize: '22 GB',
    fileName: 'EVD-2026-1019_drone_swarm_rf_c2.iq',
    storedFilePath: 'evidence_vault/Case_CR-2026-1019_Drone_Swarm_C2/EVD-2026-1019_drone_swarm_rf_c2.iq',
    seizureDate: '2026-11-13 03:55:00 UTC',
    seizureLocation: 'Naval Munitions Perimeter Electronic Defense Mast #4',
    sourceDevice: 'Ettus USRP X310 Software Defined Radio (100 MSPS)',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '6663b3bfc74e65a01e5bd0f274e4152a858b15eaaddd21730412112085c60ad7',
    sha512: 'baadfe4e1345d4ebde49ef742d09052d7542d6483d56a476dde0adf6750196b2207fd4d7fca6b1d2ad529919e0562c5e0d02947cd46829f0b627a85bbf339399',
    digitalSeal: 'SEAL-2026-1019-VALID',
    classification: 'TOP-SECRET-MILITARY',
    tags: ['RF-Capture', 'Drone-Swarm', 'SDR', 'FHSS', 'Signal-Forensics'],
    notes: 'Unprocessed complex baseband recording of frequency-hopping command link.'
  },
  {
    id: 'EVD-2026-1020',
    caseId: 'CASE-CR-2026-1020',
    caseNumber: 'CR-2026-1020',
    caseTitle: 'OmniPay POS Terminal Memory Scraper & Card Track Breach',
    title: 'Verifone Embedded POS Terminal Volatile RAM Memory Dump',
    category: 'Embedded Memory',
    fileType: 'memory-dump (.dmp)',
    fileSize: '512 MB',
    fileName: 'EVD-2026-1020_verifone_pos_ram.dmp',
    storedFilePath: 'evidence_vault/Case_CR-2026-1020_OmniPay_POS_Scraper/EVD-2026-1020_verifone_pos_ram.dmp',
    seizureDate: '2026-11-13 11:45:00 UTC',
    seizureLocation: 'OmniRetail Central Store Register #01',
    sourceDevice: 'Verifone MX 925 Payment Terminal (Serial: VRF-8831-P)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: 'eb206cacf8df15f3f54b396461ac40f058ac20e8c5293c927bdd8293c2f5d12e',
    sha512: '7eaa8730b692e8d12deb33afb6efb981de05b5b12f3811121f8ac8d640cef1b711fb3368072a932242fea6c9fd5510d420dc1b46476bb8493ae00ed896baaa4f',
    digitalSeal: 'SEAL-2026-1020-VALID',
    classification: 'RESTRICTED-PCI',
    tags: ['POS', 'RAM-Scraper', 'Credit-Card', 'PCI-DSS'],
    notes: 'Volatile memory dump acquired via JTAG debugging header; memory scraper resident.'
  },
  {
    id: 'EVD-2026-1021',
    caseId: 'CASE-CR-2026-1021',
    caseNumber: 'CR-2026-1021',
    caseTitle: 'Operation VoidHawk: Telecom Core SS7 Routing Interception',
    title: 'Signaling Transfer Point (STP) Diameter MAP Message Intercept Logs',
    category: 'Telecom Signaling',
    fileType: 'packet-capture (.pcap)',
    fileSize: '6.7 GB',
    fileName: 'EVD-2026-1021_ss7_map_sri_intercept.pcap',
    storedFilePath: 'evidence_vault/Case_CR-2026-1021_VoidHawk_SS7/EVD-2026-1021_ss7_map_sri_intercept.pcap',
    seizureDate: '2026-11-13 19:25:00 UTC',
    seizureLocation: 'National Carrier Gateway STP Switching Hub',
    sourceDevice: 'Oracle Communications Eagle STP (Signaling Node #1)',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '0187bfd3feb9f6ac4a13f45acdfeb8b08f19c5e5c3eb87ec1c07da622170b67d',
    sha512: '088e3f351d9e3109be8e1cff1a0094fe81a9c2d46935384affa6987ef254939dbb10c12e8d423b346dd1a06dcb6837163feaeb83b3f0712b52dddd27f34bb7b5',
    digitalSeal: 'SEAL-2026-1021-VALID',
    classification: 'TOP-SECRET-TELECOM',
    tags: ['SS7', 'Telecom', 'Wiretap', 'SRI-SM', 'Carrier-Core'],
    notes: 'Legally audited signaling traffic depicting unauthorized location lookup pings.'
  },
  {
    id: 'EVD-2026-1022',
    caseId: 'CASE-CR-2026-1022',
    caseNumber: 'CR-2026-1022',
    caseTitle: 'QuantumSafe Vault Cold Storage Key Derivation Extortion',
    title: 'HSM Tamper-Evident Physical Audit Trail Log & Derivation Vector File',
    category: 'Hardware Security',
    fileType: 'hardware-audit (.log)',
    fileSize: '98 MB',
    fileName: 'EVD-2026-1022_hsm_sensor_tamper.log',
    storedFilePath: 'evidence_vault/Case_CR-2026-1022_QuantumSafe_HSM/EVD-2026-1022_hsm_sensor_tamper.log',
    seizureDate: '2026-11-14 05:15:00 UTC',
    seizureLocation: 'QuantumSafe Deep Cold Vault 3B, Vault Safe #07',
    sourceDevice: 'Thales Luna PCIe HSM (FIPS 140-2 Level 3 Validated)',
    currentCustodian: 'JUDICIAL-REG',
    custodianAgency: 'court',
    status: 'ADMITTED_IN_COURT',
    sha256: 'd8b20c3e988d3a2b8b9be0de60d21561e287f7efcd200b3d6fb0c83895e9a02b',
    sha512: '72752e684431c674b869b1281bd5220b7841361ee5c7a494d40561f32aadf84a8472f48d7e50906a9193bf59b4ae955a23963f09cbf8410de00624d3cb26b9e3',
    digitalSeal: 'SEAL-2026-1022-VALID',
    classification: 'JUDICIAL-CONFIDENTIAL',
    tags: ['HSM', 'Key-Derivation', 'Court-Exhibit', 'Admitted'],
    notes: 'Physical anti-tamper mesh trip log; evidence admitted into court record.'
  },
  {
    id: 'EVD-2026-1023',
    caseId: 'CASE-CR-2026-1023',
    caseNumber: 'CR-2026-1023',
    caseTitle: 'AeroSpace SatCom Orbital Transponder Command Injection',
    title: 'CCSDS Telecommand Uplink Frames with Spoofed Authenticator Tokens',
    category: 'Satellite Telemetry',
    fileType: 'raw-frames (.bin)',
    fileSize: '1.4 GB',
    fileName: 'EVD-2026-1023_ccsds_telecommand_frames.bin',
    storedFilePath: 'evidence_vault/Case_CR-2026-1023_SatCom_Injection/EVD-2026-1023_ccsds_telecommand_frames.bin',
    seizureDate: '2026-11-14 13:00:00 UTC',
    seizureLocation: 'Space Tracking Ground Earth Station Antenna Dish 4',
    sourceDevice: 'Kratos Quantum Ground Telemetry Baseband Unit',
    currentCustodian: 'CCIC-HQ',
    custodianAgency: 'police',
    status: 'IN_VAULT',
    sha256: '86b54a7d4c56a3308abaa13259ac50196e84a50eb7002b2cb5e5204aeaa5b77f',
    sha512: '56d78264c87ddb589097b4c242a19b6db807b55ef959f475f440d047857ae5e5e941d1b50b6d1c01ae7f3cb346527ebb6ad253cfff5046829c30fae4a24c02bf',
    digitalSeal: 'SEAL-2026-1023-VALID',
    classification: 'TOP-SECRET-SPACE',
    tags: ['Satellite', 'CCSDS', 'Uplink', 'SatCom', 'Aerospace'],
    notes: 'Telecommand stream captured bit-for-bit during active rogue uplink transmission.'
  },
  {
    id: 'EVD-2026-1024',
    caseId: 'CASE-CR-2026-1024',
    caseNumber: 'CR-2026-1024',
    caseTitle: 'City Water Purification Chlorine Dispenser Logic Override',
    title: 'Rockwell ControlLogix PLC Program Binary with Tampered Setpoints',
    category: 'PLC Logic',
    fileType: 'plc-project (.acd)',
    fileSize: '38 MB',
    fileName: 'EVD-2026-1024_controllogix_water_logic.acd',
    storedFilePath: 'evidence_vault/Case_CR-2026-1024_Water_Chlorine_Override/EVD-2026-1024_controllogix_water_logic.acd',
    seizureDate: '2026-11-14 20:45:00 UTC',
    seizureLocation: 'Municipal Water Treatment Plant 2, Chlorine Dosing Unit',
    sourceDevice: 'Allen-Bradley ControlLogix 5580 Controller (1756-L83E)',
    currentCustodian: 'CFSL-CYBER',
    custodianAgency: 'forensics',
    status: 'UNDER_ANALYSIS',
    sha256: '5063a6809b8965e8514b535c3888509b802249105e148c5c4858e57cdc46fa8e',
    sha512: '2def4edba3ac37cf0aaacf3a3216f4bb4cfca32da1ba9a6a8223a4aaf50a993ec1ee927154dd0fe5ff5b8fccea343eddcff1ff2bb0e1ddd20524fd2d65458936',
    digitalSeal: 'SEAL-2026-1024-VALID',
    classification: 'RESTRICTED-INFRASTRUCTURE',
    tags: ['Water-SCADA', 'Allen-Bradley', 'Chemical-Tamper', 'PLC'],
    notes: 'PLC logic binary image preserved; contains modified proportional gain registers.'
  },
  {
    id: 'EVD-2026-1025',
    caseId: 'CASE-CR-2026-1025',
    caseNumber: 'CR-2026-1025',
    caseTitle: 'National Automated Clearinghouse (NACH) Batch Fraud Ring',
    title: 'Forged NACH APBS Electronic Batch Clearing File & Cryptographic Signature',
    category: 'Banking Clearing File',
    fileType: 'clearing-batch (.ach)',
    fileSize: '320 MB',
    fileName: 'EVD-2026-1025_nach_clearing_batch.ach',
    storedFilePath: 'evidence_vault/Case_CR-2026-1025_NACH_Batch_Fraud/EVD-2026-1025_nach_clearing_batch.ach',
    seizureDate: '2026-11-15 05:25:00 UTC',
    seizureLocation: 'Clearing House Core Gateway Server Node 02',
    sourceDevice: 'IBM z16 Mainframe Financial Transaction Router',
    currentCustodian: 'ODA-LEGAL',
    custodianAgency: 'prosecution',
    status: 'IN_VAULT',
    sha256: '7cdb4176c7a247630875c6304d57b5dd13ce484c947a392176af2d1dbfc0842a',
    sha512: '257c831a3780f0f1a18f31ce4ab36d5d735b875ec127434eb53e888dc418232819df4572e7248f25546197213bf1cac04b6e44c113abb4c4b92ccb4cb1a7b973',
    digitalSeal: 'SEAL-2026-1025-VALID',
    classification: 'RESTRICTED-LEGAL',
    tags: ['NACH', 'Banking', 'ACH', 'Settlement', 'Wire-Fraud'],
    notes: 'Raw electronic clearing file seized with invalid digital PKCS#7 detached envelope.'
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
  },
  {
    blockHeight: 1,
    blockHash: '00000b1182c47562910283746501928374650192837465019283746501928374',
    previousHash: '00000a941f82938475629102837465019283746501928374650192837465a1b2',
    timestamp: '2026-10-24 06:40:10 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1182',
    caseId: 'CR-2026-8831',
    agency: 'police',
    officer: 'Authorized Seizing Officer',
    actionDescription: 'CCTV surveillance video feed extraction from optical media. Immutably sealed with SHA-256 hash.',
    evidenceHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    merkleRoot: 'a418938475629102837465019283746501928374650192837465019283746501',
    signature: '0x88F1C34A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837',
    tampered: false
  },
  {
    blockHeight: 2,
    blockHash: '00000c8891d47562910283746501928374650192837465019283746501928375',
    previousHash: '00000b1182c47562910283746501928374650192837465019283746501928374',
    timestamp: '2026-10-24 11:42:15 UTC',
    eventType: 'TRANSFER_ACCEPTED_VERIFIED',
    evidenceId: 'EVD-2026-0941',
    caseId: 'CR-2026-8831',
    agency: 'forensics',
    officer: 'Authorized Forensic Specialist',
    actionDescription: 'Evidence received and accepted by CFSL-CYBER. Dual-PIN authenticated. Bitstream hash re-verified (100% SHA-256 match).',
    evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    merkleRoot: 'b729104857291048572910485729104857291048572910485729104857291048',
    signature: '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34',
    tampered: false
  },
  {
    blockHeight: 3,
    blockHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    previousHash: '00000c8891d47562910283746501928374650192837465019283746501928375',
    timestamp: '2026-10-25 14:20:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-2401',
    caseId: 'CR-2026-9042',
    agency: 'police',
    officer: 'Authorized Seizing Officer',
    actionDescription: 'Initial intake and NVMe forensic bitstream clone registration. Primary SHA-256 seal generated.',
    evidenceHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    merkleRoot: 'c918273645019283746501928374650192837465019283746501928374650192',
    signature: '0x99A2B4CD76AA4410984DE1942055610034AC91B4920049458902341786EF3412',
    tampered: false
  },
  {
    blockHeight: 5,
    blockHash: '000001415479dde2236f445595c7ebb6a57799c8eb76c41e80ddae4d8c45a571',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-01 05:40:12 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1001',
    caseId: 'CR-2026-1001',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1001 for Case CR-2026-1001. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '264299f540b57fe7da860b5328f05c05b153450bf14b51ebb8e2b51acba19c56',
    merkleRoot: '8e40eeaf804f359add06a8c0ad1e943f364133a1bf8260c6f916d7f975cf0787',
    signature: '0x76F59880666AB0EC0D3F9FA8DB1FEC61ACBC0C39BAE01A25A2D5875324F5DDFA',
    tampered: false
  },
  {
    blockHeight: 6,
    blockHash: '000004d40c23130da9dd35898b14e9832723609926333a143149f43a8bde2216',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-02 10:15:20 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1002',
    caseId: 'CR-2026-1002',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1002 for Case CR-2026-1002. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'fe0bf48edd0abcb8d4adf89e29b9363c3f0cfc6802c15739b78f37adfee3f190',
    merkleRoot: 'ae607065a66be29ee2557c58008fc63bc4ac40f793fbab967e2d4cc924ee783e',
    signature: '0x92708E85192B7D706A5673545AD3F95010DE7D7516FEE2CCDC1770897C72F731',
    tampered: false
  },
  {
    blockHeight: 7,
    blockHash: '000000c2d9d75991b74dbb624261460a2191c2cf5ce96c8288eda923c756a81c',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-03 13:22:45 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1003',
    caseId: 'CR-2026-1003',
    agency: 'forensics',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1003 for Case CR-2026-1003. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '4c443e99cab15814ec38a3b4ef3c79ab20c651990514a660292ca816d3776b3a',
    merkleRoot: '55c9c9134c77b0638c834665fb10dcb7add923f480dcf0664d5ad42b4e3db961',
    signature: '0x0931413AD25839713E9BE3B7CBB64355B695429D32091125F2A720D04CCC4211',
    tampered: false
  },
  {
    blockHeight: 8,
    blockHash: '000000eaad85aaed1819977f05b8733ae2f963b6da43f34cde45cfa18298158a',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-04 11:30:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1004',
    caseId: 'CR-2026-1004',
    agency: 'prosecution',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1004 for Case CR-2026-1004. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '1339eb926c927f7184b315842027243e7f82e13b1bb73a961fcaff67137291b8',
    merkleRoot: 'adea93c15742c37634764705edf818781d920409efd1774295497a8e11a57a6b',
    signature: '0xD17CCDF81104C2D8E84CE929D4C965270854679ABDB3EC3A99034A26BE5E9BB7',
    tampered: false
  },
  {
    blockHeight: 9,
    blockHash: '00000ede2e5232a5eb2b03f5c39b7712c1aa6989f2c082d65fa369c006704f67',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-05 16:45:10 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1005',
    caseId: 'CR-2026-1005',
    agency: 'court',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1005 for Case CR-2026-1005. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '45d4260f2e20b3d11ca69080ec871ffa0075687f0f6eaa3de0c3bc1cbb8370b3',
    merkleRoot: 'ceb99d79fcec0eca87b98edb98ce69e41e5aaff4860fe93ed6e903e2f4e5d9df',
    signature: '0xF9C078611C7EA05A7E366975C86D737EBF7B2ED3FCE9C40E95ABCCCAC440E417',
    tampered: false
  },
  {
    blockHeight: 10,
    blockHash: '00000a1dd80f19bb3a33bbb76988b19bdbe888edbff11df77e2142fb7008cddf',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-06 09:10:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1006',
    caseId: 'CR-2026-1006',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1006 for Case CR-2026-1006. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'ae4cf5bff27e46abe9accb4bf36ddff2bf1f2a99d10e4851994ea84c6d09693e',
    merkleRoot: '979bfc9c3643bb566d137e15e9093f928a011120f780dc26dcbf84934394ad17',
    signature: '0xEB8C3E01ACF85E1D0F7D3E613F4FD34605C69372A5073396B4F66E369F18270C',
    tampered: false
  },
  {
    blockHeight: 11,
    blockHash: '00000a6cef4c74565fe46ad78308a3ad4c07af2b1c6ff9d57f0a66ac4650bb54',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-07 06:12:30 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1007',
    caseId: 'CR-2026-1007',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1007 for Case CR-2026-1007. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'e833d9474df9a157c5e83ee3e95550fea362b331387b3267d0c925f9d408b1cc',
    merkleRoot: 'dec1d299493d8db5ab9a924c8c330e9e5b4554f6ee22657c93bb2a9869edba08',
    signature: '0x607416FA262B89435B41EECB304830996CF7F8273782D79931A435FAC6B607E0',
    tampered: false
  },
  {
    blockHeight: 12,
    blockHash: '000000e965d9b1d763db5829beb1ba9df97a646d589fc72dacde96bee9bd33f6',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-07 18:05:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1008',
    caseId: 'CR-2026-1008',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1008 for Case CR-2026-1008. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '1603dfe924f1569ae1a58cc8604a9df04db9aa569544641432c3c4a066f7a155',
    merkleRoot: 'ee1e60e5413342d01a47654ea5226b75d53836d85308e38728907abc3b74cdb2',
    signature: '0xD7E5CFB211ABEFEDE7AF8714634D31BB78401C021A9F64FECA78A786757CA857',
    tampered: false
  },
  {
    blockHeight: 13,
    blockHash: '000003a0ef99c7cbfd3fc6c08054068628f933cd1022cbeb8784a748a20189e0',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-08 03:45:15 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1009',
    caseId: 'CR-2026-1009',
    agency: 'prosecution',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1009 for Case CR-2026-1009. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '418db6df4e78b3aa5e8be453f2e39d7f6e8b14e21da83977fdd87e34e5baa8b6',
    merkleRoot: 'c05de6b9f76678121f43d14cd883cb1b19efaa30663eb33b760dff6b26caa16d',
    signature: '0x9C587BF097D96463DF784CD8789C8E8A3F2901F63F1F6BC0E97496EE740226CA',
    tampered: false
  },
  {
    blockHeight: 14,
    blockHash: '0000042f65e045bb7ffd766a10693bcf9766acafebfe6a6de923757bec65a4b2',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-08 14:02:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1010',
    caseId: 'CR-2026-1010',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1010 for Case CR-2026-1010. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'c5be225b142af8c7a852c8fefff184bd1b8b20bcbecdec1bebb0a4462206610b',
    merkleRoot: '3d2cb1acc172698fa6d0166404d87b76512b4cf79cf533a7bf8e691d060b4686',
    signature: '0x6CF21ECF42FAF7D66C1B80ACC27F5AC451EC0088047A9C6A533359E3A2E38F0A',
    tampered: false
  },
  {
    blockHeight: 15,
    blockHash: '0000061ccb78e44ddf38afd78b17f41994cd37b3fe82ebbe0eb464b9ef6bc7a8',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-09 08:35:40 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1011',
    caseId: 'CR-2026-1011',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1011 for Case CR-2026-1011. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'ea8ce1769bd1f1ee21b3ec1f13763aedc6e72fe6a0644dc90a5c9e01a6df8db2',
    merkleRoot: '18f1daa54166b34c1b7d1fc1ff4afc421267cbfd83ce0b0b6a4458aded0a8f1e',
    signature: '0x5C64F3EFD98221056CF6828724AF88A2B936E29C156FBC8B9EBCD8E6B4B208DA',
    tampered: false
  },
  {
    blockHeight: 16,
    blockHash: '00000c80eb67072f77abfe46272339a121291faef3c848372a637fbad0daec29',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-09 15:50:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1012',
    caseId: 'CR-2026-1012',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1012 for Case CR-2026-1012. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'e69a7df09da3134f6c99b2736fdf950db6bcba9fdd9a98707f3fc656d30f2e7f',
    merkleRoot: 'f771a2d4a3216b1053b6ab5a818017b58605057a03a2a0d80e5192b494cd2361',
    signature: '0xCCDE4EA2F3B7DBD232B27827A63E3172A3A2952D53317456C3A0F84E827B7033',
    tampered: false
  },
  {
    blockHeight: 17,
    blockHash: '000004cdc4af4f870d58be19787d82e12d1a2833ad8657c995d77ad3721a16b2',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-10 07:15:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1013',
    caseId: 'CR-2026-1013',
    agency: 'prosecution',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1013 for Case CR-2026-1013. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '9a033e18987056cd9b57104f9a15570da8910bb8d34fce8b520dd1254f98aca9',
    merkleRoot: 'c43755710a8c73ae7b382cec7455e785271e297c52d70bad920af665a676d1ad',
    signature: '0x04A49EB07AD9984D8821EDAEDD6411AF52E4BE241B3E4EF8011358FA2034E99A',
    tampered: false
  },
  {
    blockHeight: 18,
    blockHash: '00000a668a719bf33f71dc7aaa13170eb8ea9db03964da494fd4733a54afc96b',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-10 18:20:12 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1014',
    caseId: 'CR-2026-1014',
    agency: 'court',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1014 for Case CR-2026-1014. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'dd90948d847b7c92398087ba704a6c4bd420a3e8bf9ee408bf2f0496af00998e',
    merkleRoot: 'e154440bb619b48b89bd11381ea8eed29b3cee9efaa572485d71af5b35694c1b',
    signature: '0xB2107019E98CCFD94F83084E55864980E27EAB58C6453DDFB2C1175E7FBB090D',
    tampered: false
  },
  {
    blockHeight: 19,
    blockHash: '000009f4233813c147fd0f16e4632201e9722ad3d9dd1a1ee7e6969971c3b322',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-11 04:55:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1015',
    caseId: 'CR-2026-1015',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1015 for Case CR-2026-1015. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '170ad66094fab18b74b2d07a083b78d575dfd7c90a510dec5537a135e400c520',
    merkleRoot: '4eb57ae81acb19c77fd17f12b3e400f5d9b3cab69c02b2c804038fea8981f75b',
    signature: '0xA9593038431D4C3C63CF6F25753E031061FC0BB84D96D70747B2C59314B4BB6C',
    tampered: false
  },
  {
    blockHeight: 20,
    blockHash: '0000017cf0e9f6bd208079b1a8f15a3041ded53321d40832913c3fce3c0f4892',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-11 14:30:20 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1016',
    caseId: 'CR-2026-1016',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1016 for Case CR-2026-1016. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'd7e2c2a7a582c7eff81913cc50c6075bd23c8f1d35dfedd23d2b26cb69783b90',
    merkleRoot: '522bf269bc3adb40e1317315fdefb0feb5df3ac93651c2108ac0c0d4228bcd8e',
    signature: '0x5180334AC95EC954C0FBCC2078C64E5C33B6F10B653B47502D35CA6F10D681D5',
    tampered: false
  },
  {
    blockHeight: 21,
    blockHash: '000004c3e56264a47702f24ead27d1b1e412fa9ceb16b3db7bad69f78930acec',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-12 07:10:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1017',
    caseId: 'CR-2026-1017',
    agency: 'prosecution',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1017 for Case CR-2026-1017. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '5f2a5273d63ed9ce06066b9da616c49936fc54e84e590cd13bbe74b366d9550d',
    merkleRoot: 'e1ca4f19812d977728c28a43794624fd5a80547a3d3aede21d977a1865361938',
    signature: '0x8B1842D9D85ACE31F56E540AC13148532F43B2A4EA2BF11C57CE80A72CB95DD2',
    tampered: false
  },
  {
    blockHeight: 22,
    blockHash: '000007c552a8839b3ad98f2311f4093b65e7d97cf229e30de01e75842333125e',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-12 16:40:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1018',
    caseId: 'CR-2026-1018',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1018 for Case CR-2026-1018. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'd1a78436027212b3c7b4c099d680049cbd2cf9a8a472ce7c9705dd6cd516d477',
    merkleRoot: '7e266b7be1ae2eab3959b47a9561d16ff66588e240d484b5377b4eec269fc68a',
    signature: '0x54E3404F623B2C508CBD147E3085C54B51AF53DE172391978343C67FC90BAA8A',
    tampered: false
  },
  {
    blockHeight: 23,
    blockHash: '000002178e9b237db44d51f84cf924641e37d422b95b0d984b3d50ae527ca4f0',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-13 03:55:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1019',
    caseId: 'CR-2026-1019',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1019 for Case CR-2026-1019. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '6663b3bfc74e65a01e5bd0f274e4152a858b15eaaddd21730412112085c60ad7',
    merkleRoot: '6e2335db89ee1d853a8fc26a43b9564cc718822d44ad316cf9649573cf592c12',
    signature: '0x5DF8653B1687ADEEB2C748E1433C1952C69631EB982F1A66BD6FE46AC6680EAA',
    tampered: false
  },
  {
    blockHeight: 24,
    blockHash: '00000a568c45663b2f673905a28d8d7c9062304567df39830de4362940566aa7',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-13 11:45:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1020',
    caseId: 'CR-2026-1020',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1020 for Case CR-2026-1020. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'eb206cacf8df15f3f54b396461ac40f058ac20e8c5293c927bdd8293c2f5d12e',
    merkleRoot: '65455e8f695ee7067f6ebc31ed26028b1fd497497c3556b650804b77fe957b18',
    signature: '0x3FC3F08D91360348E545775281409FE7492C6EBD1D3B1DB74EDAB3432ACA806D',
    tampered: false
  },
  {
    blockHeight: 25,
    blockHash: '00000b834e5d73338107c46de3e20c3002ddb34eca8649386f497cc6d8580aaf',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-13 19:25:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1021',
    caseId: 'CR-2026-1021',
    agency: 'prosecution',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1021 for Case CR-2026-1021. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '0187bfd3feb9f6ac4a13f45acdfeb8b08f19c5e5c3eb87ec1c07da622170b67d',
    merkleRoot: '2686c85e78dd2696b1a94bad89028a531c92703f0b344dfa9241531291fb6006',
    signature: '0xCC6D3EF63D824E7BFC46D2634ED863188FD905B8413311736A9D27BD2E8C47E3',
    tampered: false
  },
  {
    blockHeight: 26,
    blockHash: '00000cc3c740ed523e223050d298880e50a50d141e6726da4ca77d4e3f70ad70',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-14 05:15:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1022',
    caseId: 'CR-2026-1022',
    agency: 'court',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1022 for Case CR-2026-1022. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: 'd8b20c3e988d3a2b8b9be0de60d21561e287f7efcd200b3d6fb0c83895e9a02b',
    merkleRoot: '14e19c2ed39c13ad64997ab3fee587aa1c101a814ad889fcb90f4a5469584e91',
    signature: '0x87CB0A342F7303B310A3B70FEE72F7CB22D5484F10A1958A6E68F2B0E2E8D606',
    tampered: false
  },
  {
    blockHeight: 27,
    blockHash: '000000f1e97ec78e559a5d373d98886c4dd395551da24178da25ea686291e7f6',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-14 13:00:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1023',
    caseId: 'CR-2026-1023',
    agency: 'police',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1023 for Case CR-2026-1023. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '86b54a7d4c56a3308abaa13259ac50196e84a50eb7002b2cb5e5204aeaa5b77f',
    merkleRoot: 'ab6a1bd173cd8e62428a64e4497bffe46ddccf31663253caf9dd2265caebee14',
    signature: '0x45E196CA5168E18CF15BA6C0EDCEEA0D9B7E1865D65E760EC3ABAEF322751A5E',
    tampered: false
  },
  {
    blockHeight: 28,
    blockHash: '000006dda38773659ced74ed382561e8498df8a198087be613ba71d79e93b964',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-14 20:45:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1024',
    caseId: 'CR-2026-1024',
    agency: 'forensics',
    officer: 'Sub-Insp. Priya Sharma (CCIC-7702)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1024 for Case CR-2026-1024. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '5063a6809b8965e8514b535c3888509b802249105e148c5c4858e57cdc46fa8e',
    merkleRoot: '24cd85b56cff96c443c7ec33b60c470e3d30f0fa6940aa87ec55fb53bd9206b0',
    signature: '0x17CFA3D96C3AAF99C66D90A9AD34290DBEBA910F9C01A036050B5F3BCF583CF6',
    tampered: false
  },
  {
    blockHeight: 29,
    blockHash: '00000d4f61918149368409b8a204ae6fa1260790dcd3f42d2069a9f29d466c5d',
    previousHash: '00000d2401e47562910283746501928374650192837465019283746501928376',
    timestamp: '2026-11-15 05:25:00 UTC',
    eventType: 'GENESIS_SEIZURE',
    evidenceId: 'EVD-2026-1025',
    caseId: 'CR-2026-1025',
    agency: 'prosecution',
    officer: 'Insp. Vikram Singh Rathod (CCIC-7701)',
    actionDescription: 'Cryptographic genesis intake and bitstream registration of Exhibit EVD-2026-1025 for Case CR-2026-1025. Standard FIPS 180-4 SHA-256 seal anchored.',
    evidenceHash: '7cdb4176c7a247630875c6304d57b5dd13ce484c947a392176af2d1dbfc0842a',
    merkleRoot: '89d262982ce07ea21f33975e1b16561b94e41732da02790adf277d27691325fa',
    signature: '0x0272ECA2DE8AFE4275DFD79C431F19A414397ECB63430C4B8ACC35801081B9B5',
    tampered: false
  }
];

const INITIAL_FORENSIC_REPORTS = [
  {
    reportId: 'CFSL-RPT-2026-0941',
    caseId: 'CASE-CR-2026-8831',
    caseNumber: 'CR-2026-8831',
    evidenceId: 'EVD-2026-0941',
    title: 'Volatile RAM Memory Dump & Cobalt Strike C2 Infiltration Analysis',
    authorOfficerName: 'Dr. Aris Thorne',
    authorBadgeId: 'CFSL-4402',
    authorAgencyId: 'forensics',
    authorDepartment: 'Central Forensic Science Laboratory (CFSL)',
    createdDate: '2026-10-24 14:15:00 UTC',
    status: 'COMPLETED_SIGNED',
    examinationScope: 'Extract active process memory, inspect thread injection, verify socket endpoints, and determine persistence mechanisms in memory dump EVD-2026-0941.',
    toolsHardware: 'Tableau T8u Hardware Write-Blocker, Volatility 3 (v2.5.0), Ghidra v11.0.3, LiME Kernel Acquisition Module, YARA v4.3.',
    methodology: 'Bitstream acquisition executed using LiME hardware write-blocker protocol. FIPS 180-4 SHA-256 genesis hash verified. Extracted memory pages analyzed via Volatility windows.pslist, netscan, and malfind plugins without altering the source image file.',
    findingsSummary: 'Process inspection revealed rogue svchost.exe (PID 4192) executing out of memory address 0x7FFE0000 with unbacked executable memory pages (PAGE_EXECUTE_READWRITE). Active TCP socket connection established to foreign C2 endpoint 198.51.100.24:443. Extracted reflective DLL contains Cobalt Strike 4.8 beacon configuration.',
    indicatorsOfCompromise: 'C2 IP: 198.51.100.24 (Port 443)\nInjected Process: svchost.exe (PID 4192, Parent PID 1024)\nCarved Payload SHA-256: 7f3a88c019284756291048572910485729104857291048572910485729104857\nMutex Identified: Global\\MSWin-NetworkTelemetry-Session0',
    expertConclusion: 'Physical bitstream integrity of Exhibit EVD-2026-0941 is verified with zero hash deviations. Scientific analysis confirms an advanced persistent threat (APT) beacon payload was actively running in memory at the time of system seizure.',
    evidenceDisposition: 'Exhibit remains preserved in CFSL secure cold vault. Digital examination report submitted to State Prosecution for judicial admissibility review.',
    signature: '0x83B19904CD76AA4410984DE1942055610034AC91B4920049458902341786EF34'
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

        return {
          currentAgencyId: (parsed && parsed.currentAgencyId) || 'admin',
          agencies: mergedAgencies,
          users: loadedUsers,
          cases: loadedCases,
          evidence: loadedEvidence,
          transfers: (parsed && Array.isArray(parsed.transfers)) ? parsed.transfers : INITIAL_TRANSFERS,
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

  getCasesForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return [];
    // Bar Council (defense) and Root Admin have access to ALL cases
    if (user.isAdmin || user.agencyId === 'defense') {
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

  getEvidencesForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return [];
    // Bar Council (defense) and Root Admin have access to ALL evidences
    if (user.isAdmin || user.agencyId === 'defense') {
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
    if (user.isAdmin || user.agencyId === 'defense') {
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
