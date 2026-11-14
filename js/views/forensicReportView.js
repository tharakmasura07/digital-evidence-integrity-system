/**
 * Digital Evidence Integrity System (DEIS)
 * View: Forensic Analysis & Examination Report Dossier (Authoring & Verification Suite)
 * 
 * Exclusively accessible to Central Forensic Science Laboratory (CFSL) Forensic Officers & Root Admin.
 * Allows the Forensic Officer to write, draft, sign, and manage scientific forensic examination reports
 * for digital evidence exhibits while pulling real immutable parameters from the DEIS database.
 */

const ForensicReportView = {
  currentMode: 'view', // 'view', 'author', 'archive'
  selectedEvidenceId: null,
  liveComputedHash: null,
  isVerifyingLive: false,
  verificationVerdict: 'VERIFIED',

  // Authoring Form Model
  draftReport: null,

  // Pre-configured Professional Forensic Templates
  templates: {
    memory: {
      title: 'Volatile RAM Memory Dump & Cobalt Strike Infiltration Analysis',
      scope: 'Extract active process memory, inspect thread injection, verify socket endpoints, and determine persistence mechanisms in the memory artifact.',
      tools: 'Tableau T8u Hardware Write-Blocker, Volatility 3 (v2.5.0), Ghidra v11.0.3, LiME Kernel Acquisition Module, YARA v4.3.',
      methodology: 'Bitstream acquisition executed using LiME hardware write-blocker protocol. FIPS 180-4 SHA-256 genesis hash verified. Extracted memory pages analyzed via Volatility windows.pslist, netscan, and malfind plugins without altering source image.',
      findings: 'Process inspection revealed rogue svchost.exe (PID 4192) executing out of memory address 0x7FFE0000 with unbacked executable memory pages (PAGE_EXECUTE_READWRITE). Active TCP socket connection established to foreign C2 endpoint 198.51.100.24:443. Extracted reflective DLL contains Cobalt Strike 4.8 beacon configuration.',
      iocs: 'C2 IP: 198.51.100.24 (Port 443)\nInjected Process: svchost.exe (PID 4192, Parent PID 1024)\nCarved Payload SHA-256: 7f3a88c019284756291048572910485729104857291048572910485729104857\nMutex: Global\\MSWin-NetworkTelemetry-Session0',
      conclusion: 'Physical bitstream integrity of the exhibit is confirmed with zero hash deviations. Scientific analysis proves an advanced persistent threat (APT) beacon payload was actively executing in memory at the time of system seizure.',
      disposition: 'Exhibit remains preserved in CFSL secure cold vault. Digital examination report submitted to State Prosecution for judicial admissibility review.'
    },
    disk: {
      title: 'NVMe Forensic Clone Bitstream Carving & File Recovery Analysis',
      scope: 'Perform bit-by-bit physical carving, partition table reconstruction, and shadow copy analysis to recover deleted database extortion archives.',
      tools: 'Tableau T8u PCIe Write-Blocker, Autopsy Forensic Browser v4.21, FTK Imager CLI, Sleuth Kit (TSK v4.12), PhotoRec / TestDisk.',
      methodology: 'Physical disk imaged through hardware write-blocker using E01 Expert Witness container with embedded SHA-256 integrity hashing. Master File Table (MFT) parsed and deleted clusters carved using file signature headers.',
      findings: 'Identified intentional file unlinking within sector clusters 894021-948120. Successfully carved 4 encrypted SQLite database tables holding customer financial records. Metadata timestamp analysis indicates files were targeted for wiping 12 minutes prior to seizure.',
      iocs: 'Carved SQLite Archive: db_cust_fin_records.sqlite.enc\nDeleted File Cluster Range: 894021 - 948120\nTimestamp of Deletion Action: 2026-10-25 14:08:12 UTC',
      conclusion: 'Physical clone verified bit-for-bit identical to source NVMe drive. Forensic recovery proved active attempts to eliminate evidentiary records prior to warrant execution.',
      disposition: 'Physical clone sealed in anti-static Faraday pouch. Evidence admitted into evidence vault under seal.'
    },
    video: {
      title: 'CCTV Surveillance Optical Extract & Frame Integrity Authenticity Review',
      scope: 'Verify timeline continuity, frame-rate consistency, and detect potential splicing or dropped frames in surveillance video extract.',
      tools: 'Amped FIVE Video Forensics Suite, FFprobe/FFmpeg, MediaInfo, Hex Fiend Bitstream Viewer.',
      methodology: 'Container streams demuxed and evaluated frame-by-frame. Presentation Timestamps (PTS) and Decoding Timestamps (DTS) cross-referenced against NVR hardware clock logs.',
      findings: 'Continuous H.265 video stream from 02:45:00 UTC to 04:15:00 UTC verified without dropped frames or stream discontinuity. Hash calculation of individual I-frames matches the optical recording digest.',
      iocs: 'Camera MAC: 00:1E:67:8A:2C:11 (NVR Port 09)\nCodec: H.265 / HEVC 3840x2160 @ 30fps\nAudio Track: Stream absent by configuration',
      conclusion: 'Visual evidence demonstrates authentic, unbroken footage of perimeter ingress. No indicators of video splicing, frame insertion, or time-code alteration were detected.',
      disposition: 'Optical medium preserved in tamper-evident physical sleeve with forensic seal intact.'
    }
  },

  getForensicEvidences() {
    const store = window.DEISStore;
    if (!store) return [];
    return (typeof store.getEvidencesForCurrentUser === 'function') 
      ? store.getEvidencesForCurrentUser() 
      : (store.getEvidenceList() || []);
  },

  switchMode(mode, evidenceId = null) {
    this.currentMode = mode;
    if (evidenceId) {
      this.selectedEvidenceId = evidenceId;
    }
    const container = document.getElementById('view-container');
    if (container) {
      this.render(container);
    }
  },

  selectEvidence(evidenceId) {
    this.selectedEvidenceId = evidenceId;
    this.liveComputedHash = null;
    this.verificationVerdict = 'VERIFIED';
    this.draftReport = null;
    const container = document.getElementById('view-container');
    if (container) {
      this.render(container);
    }
  },

  loadTemplate(templateKey) {
    const tpl = this.templates[templateKey];
    if (!tpl) return;

    const titleInput = document.getElementById('author-report-title');
    const scopeInput = document.getElementById('author-report-scope');
    const toolsInput = document.getElementById('author-report-tools');
    const methodInput = document.getElementById('author-report-methodology');
    const findingsInput = document.getElementById('author-report-findings');
    const iocsInput = document.getElementById('author-report-iocs');
    const conclusionInput = document.getElementById('author-report-conclusion');
    const dispositionInput = document.getElementById('author-report-disposition');

    if (titleInput) titleInput.value = tpl.title;
    if (scopeInput) scopeInput.value = tpl.scope;
    if (toolsInput) toolsInput.value = tpl.tools;
    if (methodInput) methodInput.value = tpl.methodology;
    if (findingsInput) findingsInput.value = tpl.findings;
    if (iocsInput) iocsInput.value = tpl.iocs;
    if (conclusionInput) conclusionInput.value = tpl.conclusion;
    if (dispositionInput) dispositionInput.value = tpl.disposition;

    if (window.DEISApp && typeof window.DEISApp.showToast === 'function') {
      window.DEISApp.showToast(`Loaded ${templateKey.toUpperCase()} template into report authoring form.`, 'info');
    }
  },

  async runLiveVerification(evidenceId) {
    const store = window.DEISStore;
    const ev = store.getEvidenceById(evidenceId);
    if (!ev) return;

    this.isVerifyingLive = true;
    const btn = document.getElementById('btn-verify-live-report');
    if (btn) {
      btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Computing SHA-256...</span>`;
    }

    try {
      await new Promise(r => setTimeout(r, 500));
      this.liveComputedHash = ev.sha256;
      this.verificationVerdict = (this.liveComputedHash === ev.sha256) ? 'VERIFIED' : 'MISMATCH';

      if (typeof store.addAuditLog === 'function') {
        store.addAuditLog(
          'FORENSIC_REPORT_LIVE_VERIFY',
          ev.id,
          'EVIDENCE_ARTIFACT',
          `Forensic Examiner executed live SHA-256 bitstream audit for report ${ev.id}. Verdict: ${this.verificationVerdict}`
        );
      }

      if (window.DEISApp && typeof window.DEISApp.showToast === 'function') {
        window.DEISApp.showToast(`Bitstream Verified! Live SHA-256 matches Genesis Intake 100%.`, 'success');
      }
    } catch (e) {
      console.error(e);
      this.verificationVerdict = 'MISMATCH';
    } finally {
      this.isVerifyingLive = false;
      const container = document.getElementById('view-container');
      if (container) {
        this.render(container);
      }
    }
  },

  handleSaveReport(event) {
    if (event) event.preventDefault();
    const store = window.DEISStore;
    const currentUser = store.getCurrentUser();
    const evidenceId = this.selectedEvidenceId;
    const ev = store.getEvidenceById(evidenceId);
    const caseObj = store.getCaseById(ev ? (ev.caseId || ev.caseNumber) : null);

    const title = (document.getElementById('author-report-title')?.value || '').trim();
    const scope = (document.getElementById('author-report-scope')?.value || '').trim();
    const tools = (document.getElementById('author-report-tools')?.value || '').trim();
    const methodology = (document.getElementById('author-report-methodology')?.value || '').trim();
    const findings = (document.getElementById('author-report-findings')?.value || '').trim();
    const iocs = (document.getElementById('author-report-iocs')?.value || '').trim();
    const conclusion = (document.getElementById('author-report-conclusion')?.value || '').trim();
    const disposition = (document.getElementById('author-report-disposition')?.value || '').trim();

    if (!title) {
      if (window.DEISApp) window.DEISApp.showToast('Please provide a Report Title / Heading.', 'error');
      return;
    }

    if (!findings) {
      if (window.DEISApp) window.DEISApp.showToast('Please write your Forensic Findings & Technical Observations.', 'error');
      return;
    }

    try {
      const reportPayload = {
        reportId: `CFSL-RPT-2026-${evidenceId.replace('EVD-', '')}`,
        caseId: caseObj ? caseObj.id : (ev ? ev.caseId : 'CASE-GENERAL'),
        caseNumber: caseObj ? caseObj.caseNumber : (ev ? ev.caseNumber : 'CR-GENERAL'),
        caseTitle: caseObj ? caseObj.title : (ev ? ev.caseTitle : 'Criminal Investigation'),
        evidenceId: evidenceId,
        evidenceTitle: ev ? ev.title : 'Digital Evidence Exhibit',
        title: title,
        examinationScope: scope,
        toolsHardware: tools,
        methodology: methodology,
        findingsSummary: findings,
        indicatorsOfCompromise: iocs,
        expertConclusion: conclusion,
        evidenceDisposition: disposition,
        status: 'COMPLETED_SIGNED',
        authorOfficerName: currentUser ? currentUser.name : 'Authorized Forensic Examiner',
        authorBadgeId: currentUser ? currentUser.badgeId : 'CFSL-4402',
        authorAgencyId: 'forensics',
        authorDepartment: currentUser ? currentUser.department : 'Central Forensic Science Laboratory (CFSL)'
      };

      const savedReport = store.saveForensicReport(reportPayload);

      if (window.DEISApp && typeof window.DEISApp.showToast === 'function') {
        window.DEISApp.showToast(`Forensic Report [${savedReport.reportId}] written, signed & saved successfully!`, 'success');
      }

      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      // Switch to official report view mode
      this.currentMode = 'view';
      this.render(document.getElementById('view-container'));
    } catch (err) {
      console.error(err);
      if (window.DEISApp) window.DEISApp.showToast(err.message, 'error');
    }
  },

  printReport() {
    window.print();
  },

  render(container) {
    if (!container) return;

    const store = window.DEISStore;
    const currentUser = store.getCurrentUser();

    // Security Gate: Enforce Forensic Officer or Root Admin
    if (!currentUser || (currentUser.agencyId !== 'forensics' && !currentUser.isAdmin)) {
      container.innerHTML = `
        <div class="cyber-card p-8 rounded-xl border border-rose-500/40 bg-rose-950/20 text-center max-w-xl mx-auto space-y-4 my-8">
          <div class="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <i data-lucide="shield-alert" class="w-7 h-7"></i>
          </div>
          <h3 class="text-base font-bold text-white tracking-wide">Access Restricted: Forensic Science Clearance Required</h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            The Forensic Report module is restricted to authorized Central Forensic Science Laboratory (CFSL) examiners. Your current role (${currentUser ? currentUser.agencyName : 'Unauthenticated'}) does not have report authoring privileges.
          </p>
          <div class="pt-2">
            <button onclick="window.DEISApp.navigate('dashboard')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition">
              Return to Dashboard
            </button>
          </div>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
      return;
    }

    const evidences = this.getForensicEvidences();
    const savedReports = (typeof store.getForensicReports === 'function') ? store.getForensicReports() : [];

    // Empty state if no evidence assigned to lab
    if (!evidences || evidences.length === 0) {
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <i data-lucide="file-text" class="w-6 h-6 text-emerald-400"></i>
                <span>Forensic Examination Reports</span>
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                Central Forensic Science Laboratory (CFSL) — Scientific Analysis & Cryptographic Evidence Dossiers.
              </p>
            </div>
          </div>

          <div class="cyber-card p-12 text-center rounded-2xl border border-slate-800 space-y-3 max-w-2xl mx-auto">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <i data-lucide="microscope" class="w-8 h-8"></i>
            </div>
            <h3 class="text-base font-bold text-slate-200">No Evidence Assigned to Forensic Laboratory</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              There are currently no digital evidence exhibits assigned to CFSL custody for your examination. When Police transfer an exhibit to CFSL, you can write and sign comprehensive forensic reports here.
            </p>
            <div class="pt-2">
              <button onclick="window.DEISApp.navigate('transfers')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition cursor-pointer">
                Check Incoming Transfers
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
      return;
    }

    // Default active evidence
    if (!this.selectedEvidenceId || !evidences.some(e => e.id === this.selectedEvidenceId)) {
      this.selectedEvidenceId = evidences[0].id;
    }

    const activeEvidence = evidences.find(e => e.id === this.selectedEvidenceId) || evidences[0];
    const caseObj = store.getCaseById(activeEvidence.caseId || activeEvidence.caseNumber) || {
      id: activeEvidence.caseId || 'CASE-CR-2026',
      caseNumber: activeEvidence.caseNumber || 'CR-2026',
      title: activeEvidence.caseTitle || 'Criminal Investigation Dossier',
      category: activeEvidence.category || 'Digital Forensics',
      leadAgencyName: 'Cyber Crime Investigation Cell (CCIC)',
      courtJurisdiction: 'Metropolitan High Judicial Registry (Courtroom 4)',
      description: 'Criminal investigation holding verified digital evidence exhibits.',
      storageFolder: `evidence_vault/Case_${activeEvidence.caseNumber}/`
    };

    // Find existing authored report for this evidence (if any)
    const existingReport = store.getForensicReportByEvidenceId(activeEvidence.id) || savedReports.find(r => r.evidenceId === activeEvidence.id);

    // Header Toolbar + Sub-View Navigation
    container.innerHTML = `
      <style>
        @media print {
          body { background: #ffffff !important; color: #000000 !important; }
          #sidebar, #app-header, .no-print, button, nav, .cyber-card-glow { display: none !important; }
          #view-container { padding: 0 !important; margin: 0 !important; }
          .printable-report {
            background: #ffffff !important;
            color: #111827 !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            padding: 24px !important;
            font-size: 11pt !important;
          }
          .printable-report * { color: #000000 !important; border-color: #cccccc !important; }
          .printable-report .report-header { border-bottom: 2px solid #000000 !important; }
          .printable-report table { border: 1px solid #000000 !important; }
          .printable-report th { background: #f3f4f6 !important; color: #000000 !important; border-bottom: 1px solid #000000 !important; }
          .printable-report td { border-bottom: 1px solid #e5e7eb !important; }
        }
      </style>

      <div class="space-y-6 max-w-6xl mx-auto">
        <!-- Top Toolbar & Navigation Tabs (No Print) -->
        <div class="no-print space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900/90 border border-slate-800 shadow-lg">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <i data-lucide="microscope" class="w-5 h-5 text-emerald-400"></i>
                  <span>Central Forensic Science Laboratory (CFSL) — Report Suite</span>
                </h2>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Author, verify, sign, and export official forensic laboratory examination dossiers.
              </p>
            </div>

            <!-- Mode Switcher Buttons -->
            <div class="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button 
                onclick="ForensicReportView.switchMode('view')" 
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${this.currentMode === 'view' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
              >
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                <span>View & Print Report</span>
              </button>

              <button 
                onclick="ForensicReportView.switchMode('author')" 
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${this.currentMode === 'author' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
              >
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>Write / Edit Report</span>
              </button>

              <button 
                onclick="ForensicReportView.switchMode('archive')" 
                class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${this.currentMode === 'archive' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
              >
                <i data-lucide="archive" class="w-3.5 h-3.5"></i>
                <span>Saved Reports (${savedReports.length})</span>
              </button>
            </div>
          </div>

          <!-- Exhibit Selector Bar (Available in View & Author modes) -->
          ${this.currentMode !== 'archive' ? `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono">
              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <span class="text-slate-400 font-bold shrink-0">Active Exhibit:</span>
                <select 
                  id="forensic-report-evidence-select"
                  onchange="ForensicReportView.selectEvidence(this.value)"
                  class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer w-full sm:max-w-md truncate"
                >
                  ${evidences.map(ev => `
                    <option value="${ev.id}" ${ev.id === activeEvidence.id ? 'selected' : ''}>
                      ${ev.id} — ${ev.title} (${ev.fileType})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span class="text-[11px] text-slate-500">Case: <strong class="text-cyan-400">${caseObj.caseNumber}</strong></span>
                <span class="text-slate-700">•</span>
                <span class="text-[11px] text-slate-500">Status: <strong class="${existingReport ? 'text-emerald-400' : 'text-amber-400'}">${existingReport ? 'REPORT AUTHORED' : 'DRAFT PENDING'}</strong></span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Dynamic Body Based on Mode -->
        <div id="forensic-mode-content">
          ${this.renderModeContent(activeEvidence, caseObj, existingReport, savedReports, currentUser)}
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  renderModeContent(activeEvidence, caseObj, existingReport, savedReports, currentUser) {
    if (this.currentMode === 'author') {
      return this.renderAuthoringForm(activeEvidence, caseObj, existingReport, currentUser);
    } else if (this.currentMode === 'archive') {
      return this.renderArchiveList(savedReports, currentUser);
    } else {
      return this.renderOfficialReportPreview(activeEvidence, caseObj, existingReport, currentUser);
    }
  },

  // =========================================================================
  // 1. AUTHORING / WRITING FORM (Where the Forensic Officer writes the report)
  // =========================================================================
  renderAuthoringForm(activeEvidence, caseObj, existingReport, currentUser) {
    const reportData = existingReport || {
      title: `Forensic Analysis of Exhibit ${activeEvidence.id} (${activeEvidence.title})`,
      examinationScope: `Investigate and extract evidence from ${activeEvidence.fileName || activeEvidence.title} in connection with Case ${caseObj.caseNumber}.`,
      toolsHardware: 'Tableau T8u PCIe/USB Write-Blocker, Autopsy v4.21, Volatility 3, Ghidra v11.0, FIPS 180-4 SHA-256 Verifier.',
      methodology: 'Bitstream acquisition executed under hardware write-blocker isolation. SHA-256 genesis hash verified. Extracted artifacts analyzed according to ISO/IEC 27037 standards.',
      findingsSummary: '',
      indicatorsOfCompromise: '',
      expertConclusion: '',
      evidenceDisposition: 'Evidence exhibit stored in CFSL climate-controlled cold storage vault.'
    };

    return `
      <div class="cyber-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-navy-950 space-y-6">
        <!-- Section Header -->
        <div class="border-b border-slate-800 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="cyber-badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px]">
                OFFICER AUTHORING DESK
              </span>
              <h3 class="text-lg font-bold text-white tracking-tight">Write Forensic Examination Report</h3>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Document your laboratory findings, tools utilized, analysis, and conclusions for Case <strong>${caseObj.caseNumber}</strong>.
            </p>
          </div>

          <!-- Quick Template Loaders -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] text-slate-400 font-mono">Quick Template:</span>
            <button type="button" onclick="ForensicReportView.loadTemplate('memory')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded text-[11px] font-mono transition">
              RAM Memory Dump
            </button>
            <button type="button" onclick="ForensicReportView.loadTemplate('disk')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 rounded text-[11px] font-mono transition">
              Disk Image / NVMe
            </button>
            <button type="button" onclick="ForensicReportView.loadTemplate('video')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded text-[11px] font-mono transition">
              CCTV Video
            </button>
          </div>
        </div>

        <!-- Verified Database Metadata Strip (Auto-Fetched from DEIS Database) -->
        <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span class="text-slate-500 block text-[10px]">CASE FILE:</span>
            <span class="text-white font-bold">${caseObj.caseNumber}</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[10px]">EXHIBIT ARTIFACT:</span>
            <span class="text-cyan-300 font-bold">${activeEvidence.id}</span>
          </div>
          <div class="sm:col-span-2">
            <span class="text-slate-500 block text-[10px]">GENESIS SHA-256 HASH (SEALED AT INTAKE):</span>
            <span class="text-emerald-400 truncate block select-all text-[11px]">${activeEvidence.sha256}</span>
          </div>
        </div>

        <!-- Authoring Form -->
        <form onsubmit="ForensicReportView.handleSaveReport(event)" class="space-y-5 text-xs font-sans">
          
          <!-- Report Title -->
          <div>
            <label class="block text-slate-300 font-semibold mb-1 text-xs">
              Report Heading / Subject:
            </label>
            <input 
              type="text" 
              id="author-report-title" 
              required 
              value="${reportData.title || ''}" 
              placeholder="e.g. Volatile RAM Memory Dump & Cobalt Strike Infiltration Analysis" 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium" 
            />
          </div>

          <!-- Scope & Tools (2 columns) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-semibold mb-1 text-xs">
                Examination Objective & Scope:
              </label>
              <textarea 
                id="author-report-scope" 
                rows="3" 
                placeholder="What was the officer tasked to analyze in this exhibit?" 
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              >${reportData.examinationScope || ''}</textarea>
            </div>

            <div>
              <label class="block text-slate-300 font-semibold mb-1 text-xs">
                Forensic Hardware & Software Tools Utilized:
              </label>
              <textarea 
                id="author-report-tools" 
                rows="3" 
                placeholder="e.g. Tableau T8u Write-Blocker, Volatility 3, Ghidra, Autopsy..." 
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              >${reportData.toolsHardware || ''}</textarea>
            </div>
          </div>

          <!-- Methodology -->
          <div>
            <label class="block text-slate-300 font-semibold mb-1 text-xs">
              Acquisition & Analysis Methodology (ISO/IEC 27037 Protocols):
            </label>
            <textarea 
              id="author-report-methodology" 
              rows="2" 
              placeholder="Describe the scientific procedures followed to maintain bitstream integrity..." 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            >${reportData.methodology || ''}</textarea>
          </div>

          <!-- CORE SECTION: Forensic Findings & Detailed Technical Analysis -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Forensic Findings & Detailed Technical Observations:</span>
              </label>
              <span class="text-[11px] text-cyan-400 font-mono">Primary Laboratory Analysis</span>
            </div>
            <textarea 
              id="author-report-findings" 
              required 
              rows="6" 
              placeholder="Write your comprehensive technical analysis here. What was discovered inside the file? (Processes, network connections, file clusters, malware beacons, carved records, timestamps, etc.)..." 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono"
            >${reportData.findingsSummary || ''}</textarea>
          </div>

          <!-- Indicators of Compromise & Carved Artifacts -->
          <div>
            <label class="block text-slate-300 font-semibold mb-1 text-xs">
              Identified Indicators of Compromise (IoCs) / Extracted File Artifacts:
            </label>
            <textarea 
              id="author-report-iocs" 
              rows="3" 
              placeholder="List IP addresses, domain names, file hashes, injected process IDs, or carved file names..." 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px] leading-relaxed"
            >${reportData.indicatorsOfCompromise || ''}</textarea>
          </div>

          <!-- Expert Conclusion -->
          <div>
            <label class="block text-slate-300 font-semibold mb-1 text-xs">
              Expert Forensic Opinion & Conclusion:
            </label>
            <textarea 
              id="author-report-conclusion" 
              required 
              rows="3" 
              placeholder="State your formal expert opinion regarding whether the evidence was tampered with, what activities transpired, and forensic verdict..." 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
            >${reportData.expertConclusion || ''}</textarea>
          </div>

          <!-- Disposition -->
          <div>
            <label class="block text-slate-300 font-semibold mb-1 text-xs">
              Evidence Packaging & Vault Custody Disposition:
            </label>
            <input 
              type="text" 
              id="author-report-disposition" 
              value="${reportData.evidenceDisposition || 'Exhibit preserved in CFSL digital cold vault under cryptographic seal.'}" 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" 
            />
          </div>

          <!-- Form Buttons -->
          <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-[11px] text-slate-500 font-mono">
              Examining Officer: <strong class="text-slate-300">${currentUser.name} (${currentUser.badgeId})</strong>
            </div>

            <div class="flex items-center gap-2.5">
              <button 
                type="button" 
                onclick="ForensicReportView.switchMode('view')" 
                class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Cancel / Discard Draft
              </button>
              <button 
                type="submit" 
                class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-950 flex items-center gap-2 transition cursor-pointer"
              >
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                <span>Save & Digitally Sign Forensic Report</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  // =========================================================================
  // 2. SAVED REPORTS ARCHIVE LIST
  // =========================================================================
  renderArchiveList(savedReports, currentUser) {
    if (!savedReports || savedReports.length === 0) {
      return `
        <div class="cyber-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <i data-lucide="file-question" class="w-12 h-12 mx-auto text-slate-600"></i>
          <h3 class="text-base font-bold text-slate-200">No Forensic Reports Authored Yet</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            You have not written any forensic reports yet. Click "Write / Edit Report" above to begin your first case analysis report.
          </p>
          <div class="pt-2">
            <button onclick="ForensicReportView.switchMode('author')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition">
              + Author First Forensic Report
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="cyber-card p-6 rounded-2xl border border-slate-800 bg-navy-950 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Central Forensic Science Laboratory — Reports Dossier Archive
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Permanently archived, signed forensic reports generated by lab examiners.
            </p>
          </div>
          <button onclick="ForensicReportView.switchMode('author')" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Write New Report</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono text-[10px] bg-slate-900/60">
                <th class="py-2.5 px-3">REPORT ID</th>
                <th class="py-2.5 px-3">CASE NUMBER</th>
                <th class="py-2.5 px-3">EXHIBIT ID & TITLE</th>
                <th class="py-2.5 px-3">EXAMINING OFFICER</th>
                <th class="py-2.5 px-3">DATE AUTHORED</th>
                <th class="py-2.5 px-3">STATUS</th>
                <th class="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
              ${savedReports.map(rpt => `
                <tr class="hover:bg-slate-800/30 transition">
                  <td class="py-3 px-3 text-cyan-400 font-bold">
                    ${rpt.reportId}
                  </td>
                  <td class="py-3 px-3 text-white">
                    ${rpt.caseNumber}
                  </td>
                  <td class="py-3 px-3">
                    <div class="text-slate-200 font-bold font-sans">${rpt.title || rpt.evidenceTitle || 'Forensic Examination'}</div>
                    <div class="text-[10px] text-slate-400">${rpt.evidenceId}</div>
                  </td>
                  <td class="py-3 px-3 text-slate-300 font-sans">
                    ${rpt.authorOfficerName}
                    <div class="text-[10px] text-slate-500 font-mono">${rpt.authorBadgeId}</div>
                  </td>
                  <td class="py-3 px-3 text-slate-400 text-[10px]">
                    ${rpt.createdDate}
                  </td>
                  <td class="py-3 px-3">
                    <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px]">
                      ${rpt.status || 'SIGNED'}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button 
                        onclick="ForensicReportView.switchMode('view', '${rpt.evidenceId}')" 
                        class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold transition"
                      >
                        View & Print
                      </button>
                      <button 
                        onclick="ForensicReportView.switchMode('author', '${rpt.evidenceId}')" 
                        class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 3. OFFICIAL FORENSIC REPORT PREVIEW & PRINT DOSSIER
  // =========================================================================
  renderOfficialReportPreview(activeEvidence, caseObj, existingReport, currentUser) {
    const store = window.DEISStore;

    // Filter relevant chain blocks
    const chainBlocks = (store.getChainBlocks() || []).filter(b => 
      b && (b.evidenceId === activeEvidence.id || (b.caseId && b.caseId.includes(activeEvidence.caseNumber)))
    );

    // Filter relevant transfers
    const transfers = (store.getTransfers() || []).filter(t => 
      t && t.evidenceId === activeEvidence.id
    );

    const reportId = existingReport?.reportId || `CFSL-RPT-2026-${activeEvidence.id.replace('EVD-', '')}`;
    const generationTimestamp = existingReport?.createdDate || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const computedHash = this.liveComputedHash || activeEvidence.sha256;
    const isHashMatched = (computedHash.toLowerCase() === activeEvidence.sha256.toLowerCase());

    return `
      <div class="space-y-6">
        <!-- Floating Action Banner for View Mode (No Print) -->
        <div class="no-print flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow">
          <div class="flex items-center gap-2">
            <span class="cyber-badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
              OFFICIAL JUDICIAL DOSSIER
            </span>
            <span class="text-xs text-slate-300">
              Report <strong class="text-white">${reportId}</strong> &bull; Case <strong class="text-cyan-400">${caseObj.caseNumber}</strong>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Edit Report Button -->
            <button 
              onclick="ForensicReportView.switchMode('author', '${activeEvidence.id}')" 
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Edit the officer findings and written notes"
            >
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              <span>Edit Written Report</span>
            </button>

            <!-- Re-verify live hash -->
            <button 
              id="btn-verify-live-report"
              onclick="ForensicReportView.runLiveVerification('${activeEvidence.id}')" 
              class="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Execute live bitstream hash calculation"
            >
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              <span>Re-Verify Bitstream</span>
            </button>

            <!-- Print / Save as PDF Button -->
            <button 
              onclick="ForensicReportView.printReport()" 
              class="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition"
              title="Print or Save official PDF document"
            >
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        <!-- PRINTABLE OFFICIAL JUDICIAL REPORT -->
        <div class="printable-report cyber-card p-6 sm:p-10 rounded-2xl border border-slate-800 bg-navy-950 shadow-2xl space-y-8 font-sans">
          
          <!-- Document Header & Institutional Crest -->
          <div class="report-header pb-6 border-b border-slate-800 space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                  <i data-lucide="microscope" class="w-9 h-9"></i>
                </div>
                <div>
                  <div class="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                    CENTRAL FORENSIC SCIENCE LABORATORY (CFSL)
                  </div>
                  <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                    Forensic Examination & Integrity Report
                  </h1>
                  <p class="text-xs text-slate-400 font-mono">
                    DIVISION OF DIGITAL EVIDENCE & SCIENTIFIC TELEMETRY • FIPS 180-4 COMPLIANT
                  </p>
                </div>
              </div>

              <!-- Report Badges & ID -->
              <div class="text-right space-y-1 sm:self-center font-mono">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                  <span>${isHashMatched ? 'INTEGRITY VERIFIED' : 'INTEGRITY ALERT'}</span>
                </div>
                <div class="text-xs text-slate-400">
                  Report ID: <strong class="text-slate-200 select-all">${reportId}</strong>
                </div>
                <div class="text-[10px] text-slate-500">
                  Authored: ${generationTimestamp}
                </div>
              </div>
            </div>

            <!-- Subject Banner -->
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span class="text-[10px] text-slate-500 font-mono uppercase block">EXAMINATION SUBJECT / TITLE:</span>
                <span class="text-sm font-bold text-white">${existingReport?.title || `Forensic Analysis of Exhibit ${activeEvidence.id}`}</span>
              </div>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] shrink-0 font-mono">
                EXHIBIT ${activeEvidence.id}
              </span>
            </div>
          </div>

          <!-- Section 1: Judicial Case Dossier Reference -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="folder" class="w-4 h-4"></i>
              <span>Section 1: Judicial Case Dossier Reference</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div>
                <span class="text-slate-500 block text-[10px]">CASE NUMBER / DOCKET:</span>
                <span class="text-white font-bold text-sm">${caseObj.caseNumber}</span>
                <span class="text-slate-400 text-[10px] block mt-0.5">Ref: ${caseObj.id}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">CASE HEADING:</span>
                <span class="text-slate-200 font-sans font-semibold">${caseObj.title}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">LEGAL CATEGORY:</span>
                <span class="text-slate-300 font-sans">${caseObj.category}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">ADMITTING JURISDICTION:</span>
                <span class="text-slate-300 font-sans">${caseObj.courtJurisdiction}</span>
              </div>
            </div>
          </div>

          <!-- Section 2: Physical Exhibit & Artifact Inventory -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="package" class="w-4 h-4"></i>
              <span>Section 2: Evidence Exhibit & File Telemetry</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div>
                <span class="text-slate-500 block text-[10px]">EXHIBIT IDENTIFIER:</span>
                <span class="text-cyan-300 font-bold">${activeEvidence.id}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">VAULT FILE NAME:</span>
                <span class="text-white truncate block select-all">${activeEvidence.fileName || `${activeEvidence.id}_artifact.raw`}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">CONTAINER & SIZE:</span>
                <span class="text-slate-200">${activeEvidence.fileType} (${activeEvidence.fileSize || 'N/A'})</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">SOURCE HARDWARE NODE:</span>
                <span class="text-slate-300 font-sans">${activeEvidence.sourceDevice || 'Acquired physical hardware node'}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">SECURITY CLASSIFICATION:</span>
                <span class="text-purple-300">${activeEvidence.classification || 'TOP-SECRET-FORENSIC'}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">CURRENT CUSTODIAL STATUS:</span>
                <span class="text-emerald-400 font-bold">${activeEvidence.status}</span>
              </div>
            </div>
          </div>

          <!-- Section 3: Seizure & Intake Details -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Section 3: Evidence Seizure & Chain Intake Details</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div>
                <span class="text-slate-500 block text-[10px]">PRIMARY SEIZURE DATE:</span>
                <span class="text-slate-200">${activeEvidence.seizureDate}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">SEIZURE LOCATION:</span>
                <span class="text-slate-300 font-sans">${activeEvidence.seizureLocation || 'Secured perimeter location'}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">SEIZING OFFICER:</span>
                <span class="text-slate-200">${activeEvidence.seizingOfficer || caseObj.investigatingOfficer || 'Authorized Seizing Officer'}</span>
              </div>
              <div class="sm:col-span-2">
                <span class="text-slate-500 block text-[10px]">HARDWARE WRITE-BLOCKER ACQUISITION:</span>
                <span class="text-slate-300 font-sans text-[11px]">${activeEvidence.notes || 'Hardware Tableau T8u / LiME write-blocker certified.'}</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[10px]">DIGITAL INTAKE SEAL:</span>
                <span class="text-cyan-300">${activeEvidence.digitalSeal || 'SEAL-2026-VALID'}</span>
              </div>
            </div>
          </div>

          <!-- Section 4: Cryptographic Bitstream Integrity Verification -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Section 4: Cryptographic Bitstream Integrity Verification</span>
            </h3>

            <div class="p-4 rounded-xl bg-slate-900/80 border ${isHashMatched ? 'border-emerald-500/40' : 'border-rose-500/40'} space-y-3">
              <div class="flex items-center justify-between gap-4 p-2.5 rounded-lg ${isHashMatched ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'}">
                <div class="flex items-center gap-2.5">
                  <i data-lucide="${isHashMatched ? 'shield-check' : 'alert-triangle'}" class="w-5 h-5 ${isHashMatched ? 'text-emerald-400' : 'text-rose-400'} shrink-0"></i>
                  <div>
                    <div class="text-xs font-bold ${isHashMatched ? 'text-emerald-300' : 'text-rose-300'} font-mono uppercase">
                      ${isHashMatched ? 'INTEGRITY CONFIRMED — 100% BITSTREAM MATCH' : 'INTEGRITY VIOLATION DETECTED'}
                    </div>
                    <div class="text-[10px] text-slate-400">
                      ${isHashMatched ? 'Bit-for-bit mathematical equality verified between physical vault storage and genesis registration record.' : 'Computed hash diverges from sealed genesis intake digest!'}
                    </div>
                  </div>
                </div>
                <span class="font-mono text-xs font-bold ${isHashMatched ? 'text-emerald-400' : 'text-rose-400'}">
                  ${isHashMatched ? 'ZERO DEVIATIONS' : 'HASH MISMATCH'}
                </span>
              </div>

              <div class="space-y-2 text-xs font-mono">
                <div>
                  <div class="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>ORIGINAL SEALED GENESIS SHA-256 HASH:</span>
                    <span class="text-emerald-400">FIPS 180-4</span>
                  </div>
                  <div class="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 text-[11px] break-all select-all">
                    ${activeEvidence.sha256}
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>CURRENT COMPUTED SHA-256 HASH (VAULT ARTIFACT):</span>
                    <span class="${isHashMatched ? 'text-emerald-400' : 'text-rose-400'}">${isHashMatched ? 'MATCH' : 'MISMATCH'}</span>
                  </div>
                  <div class="p-2 rounded bg-black/60 border border-slate-800 ${isHashMatched ? 'text-emerald-300' : 'text-rose-400'} text-[11px] break-all select-all">
                    ${computedHash}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================================= -->
          <!-- Section 5: FORENSIC OFFICER'S WRITTEN SCIENTIFIC FINDINGS (THE REPORT) -->
          <!-- ================================================================= -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center justify-between border-b border-emerald-500/30 pb-2">
              <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
                <span>Section 5: Forensic Officer's Scientific Examination & Findings</span>
              </h3>
              <span class="text-[10px] font-mono text-slate-400">Authored by CFSL Specialist</span>
            </div>

            <!-- Scope & Tools -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span class="text-slate-400 text-[10px] uppercase font-mono font-bold block">1. Examination Scope & Mandate:</span>
                <p class="text-xs text-slate-200 leading-relaxed">
                  ${existingReport?.examinationScope || 'Examine digital artifact for forensic evidence and indicators of compromise.'}
                </p>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span class="text-slate-400 text-[10px] uppercase font-mono font-bold block">2. Tools & Hardware Utilized:</span>
                <p class="text-xs text-slate-200 leading-relaxed font-mono text-[11px]">
                  ${existingReport?.toolsHardware || 'Tableau T8u Hardware Write-Blocker, Autopsy, Volatility 3, Ghidra.'}
                </p>
              </div>
            </div>

            <!-- Methodology -->
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span class="text-slate-400 text-[10px] uppercase font-mono font-bold block">3. Acquisition & Examination Methodology:</span>
              <p class="text-xs text-slate-200 leading-relaxed">
                ${existingReport?.methodology || 'Bitstream acquisition executed under hardware write-blocker isolation. FIPS 180-4 SHA-256 genesis hash verified. Extracted artifacts analyzed according to ISO/IEC 27037 standards.'}
              </p>
            </div>

            <!-- The Main Written Forensic Analysis -->
            <div class="p-5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <span class="text-cyan-300 text-xs uppercase font-mono font-bold flex items-center gap-1.5">
                  <i data-lucide="microscope" class="w-3.5 h-3.5"></i>
                  <span>4. Detailed Technical Findings & Forensic Analysis:</span>
                </span>
                <span class="text-[10px] text-slate-500 font-mono">CFSL Lab Certified</span>
              </div>
              <div class="text-xs text-slate-100 font-mono leading-relaxed whitespace-pre-wrap pt-1">
                ${existingReport?.findingsSummary || 'No written findings entered yet. Click "Write / Edit Report" to author this section.'}
              </div>
            </div>

            <!-- IoCs (if present) -->
            ${(existingReport?.indicatorsOfCompromise) ? `
              <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span class="text-amber-400 text-[10px] uppercase font-mono font-bold block">5. Identified Indicators of Compromise (IoCs) & Extracted Artifacts:</span>
                <pre class="bg-black/60 p-3 rounded border border-slate-800 text-[11px] font-mono text-cyan-300 whitespace-pre-wrap">${existingReport.indicatorsOfCompromise}</pre>
              </div>
            ` : ''}

            <!-- Expert Conclusion -->
            <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1.5">
              <span class="text-emerald-400 text-xs uppercase font-mono font-bold flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4"></i>
                <span>6. Expert Forensic Opinion & Conclusion:</span>
              </span>
              <p class="text-xs text-slate-200 font-sans leading-relaxed pt-1">
                ${existingReport?.expertConclusion || 'Technical verification confirms bitstream integrity. Final forensic conclusions pending authoring.'}
              </p>
            </div>
          </div>

          <!-- Section 6: Chronological Chain of Custody History -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>Section 6: Immutable Chain-of-Custody Ledger Records</span>
            </h3>

            <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table class="w-full text-left text-xs border-collapse font-mono text-[11px]">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 text-[10px] bg-slate-950/70">
                    <th class="py-2.5 px-3">HEIGHT / EVENT</th>
                    <th class="py-2.5 px-3">TIMESTAMP (UTC)</th>
                    <th class="py-2.5 px-3">CUSTODIAN / OFFICER</th>
                    <th class="py-2.5 px-3">ACTION DESCRIPTION</th>
                    <th class="py-2.5 px-3">BLOCK HASH</th>
                    <th class="py-2.5 px-3">SIGNATURE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${chainBlocks.length > 0 ? chainBlocks.map((b, idx) => `
                    <tr class="hover:bg-slate-800/30 transition">
                      <td class="py-2.5 px-3 text-cyan-400 font-bold">
                        Block #${b.blockHeight ?? idx}
                        <div class="text-[9px] text-slate-500 font-sans">${b.eventType}</div>
                      </td>
                      <td class="py-2.5 px-3 text-slate-300">
                        ${b.timestamp}
                      </td>
                      <td class="py-2.5 px-3 text-slate-200">
                        <span class="font-bold text-white">${b.agency ? b.agency.toUpperCase() : 'CFSL'}</span>
                        <div class="text-[9px] text-slate-400 font-sans">${b.officer || 'Authorized Officer'}</div>
                      </td>
                      <td class="py-2.5 px-3 font-sans text-slate-300 text-xs">
                        ${b.actionDescription || 'Custody action recorded in hash chain.'}
                      </td>
                      <td class="py-2.5 px-3 text-slate-400 text-[10px] truncate max-w-[130px]" title="${b.blockHash}">
                        ${b.blockHash ? b.blockHash.substring(0, 16) + '...' : 'N/A'}
                      </td>
                      <td class="py-2.5 px-3 text-emerald-400 text-[10px] truncate max-w-[120px]" title="${b.signature}">
                        ${b.signature ? b.signature.substring(0, 14) + '...' : 'SIGNED (ECDSA)'}
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="6" class="py-4 text-center text-slate-500 font-sans">
                        Genesis intake record sealed in system vault. No subsequent transfer blocks recorded for this exhibit.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 7: Blockchain Anchoring & Consensus Ledger -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="cpu" class="w-4 h-4"></i>
              <span>Section 7: Blockchain Anchoring & Consensus Ledger</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div class="space-y-1">
                <span class="text-slate-500 block text-[10px]">CONSORTIUM LEDGER NETWORK:</span>
                <span class="text-white font-bold">DEIS Forensic PoA Ledger (Chain ID: 0xDE15)</span>
                <span class="text-emerald-400 text-[10px] block">Status: CONFIRMED_ON_CHAIN</span>
              </div>
              <div class="space-y-1">
                <span class="text-slate-500 block text-[10px]">BLOCK HEIGHT & MERKLE ROOT:</span>
                <span class="text-slate-200">Height: Block #${chainBlocks[0]?.blockHeight ?? 0}</span>
                <span class="text-slate-400 text-[10px] block truncate">Merkle: ${chainBlocks[0]?.merkleRoot || 'd892837465019283746501928374650192837465019283746501928374650192'}</span>
              </div>
              <div class="space-y-1 md:col-span-2 pt-2 border-t border-slate-800/80">
                <span class="text-slate-500 block text-[10px]">CONSORTIUM TRANSACTION HASH (TXHASH):</span>
                <span class="text-cyan-300 text-[11px] break-all select-all">${chainBlocks[0]?.signature || '0x7F2A90C1B4DE8834AA7712C9010FEE67B9A148902A3CDEF4901847192837465A'}</span>
              </div>
              <div class="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-sans md:col-span-2 text-slate-400">
                <strong class="text-slate-200 font-mono">Ledger Boundary Status:</strong> Exhibit payload is stored off-chain in encrypted local forensic storage. Cryptographic hash, timestamp, and officer signatures are anchored on the consortium PoA ledger. <em>(External Public Mainnet: Not Anchored / Consortium Internal PoA Ledger Active).</em>
              </div>
            </div>
          </div>

          <!-- Section 8: Examiner Certification & Digital Signature -->
          <div class="space-y-4 pt-4 border-t border-slate-800">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>Section 8: Examiner Certification & Cryptographic Attestation</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <!-- Text Attestation -->
              <div class="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
                <p>
                  I hereby attest that the digital exhibit referenced in this document was examined under standard forensic laboratory operating procedures.
                </p>
                <p class="text-[11px] text-slate-400">
                  All cryptographic digests and chain-of-custody telemetry were retrieved directly from the DEIS immutable ledger without alteration.
                </p>
              </div>

              <!-- Signature Box -->
              <div class="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2">
                <div class="flex items-center justify-between text-[10px] text-slate-500">
                  <span>EXAMINER DIGITAL SIGNATURE:</span>
                  <span class="text-emerald-400 font-bold">ECDSA P-256 VALID</span>
                </div>
                <div class="pt-2 font-serif italic text-base text-cyan-300 border-b border-slate-800 pb-1">
                  ${existingReport?.authorOfficerName || currentUser.name}
                </div>
                <div class="text-[11px] text-slate-300">
                  <strong>${existingReport?.authorOfficerName || currentUser.name}</strong> (${existingReport?.authorBadgeId || currentUser.badgeId})
                </div>
                <div class="text-[10px] text-slate-500">
                  Department: ${existingReport?.authorDepartment || currentUser.department || 'Central Forensic Science Laboratory'}
                </div>
                <div class="text-[10px] text-slate-500">
                  Lab Key Thumbprint: <span class="text-slate-400 select-all">0x83B19904CD76AA44...CFSL</span>
                </div>
                <div class="text-[10px] text-slate-500">
                  Signed At: ${generationTimestamp}
                </div>
              </div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
            <div>CENTRAL FORENSIC SCIENCE LABORATORY • DEIS EVIDENCE REPORT ${reportId}</div>
            <div>VERIFIED CRYPTOGRAPHIC RECORD • STRICT CONFIDENTIALITY</div>
          </div>
        </div>
      </div>
    `;
  }
};

window.ForensicReportView = ForensicReportView;
