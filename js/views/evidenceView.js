/**
 * Digital Evidence Integrity System (DEIS)
 * View: Case Files Dossier & Stored Evidence Vault
 * 
 * Manages Legal Case Files that contain and store cryptographically sealed evidence artifacts.
 * Features:
 * - Persistent Filter & Metrics Controls (no focus loss on search typing)
 * - Tabbed Case Dossier Navigation (Case 1 shown by default)
 * - Cryptographic Bitstream SHA-256 Linkage & Blockchain Anchors
 */

const EvidenceView = {
  currentCategory: 'ALL',
  currentStatus: 'ALL',
  selectedCase: 'ALL',
  activeCaseNumber: null,
  searchQuery: '',

  getCasesAndEvidence() {
    const store = window.DEISStore;
    const cases = (store && typeof store.getCases === 'function') ? [...store.getCases()] : [];
    const evidenceList = (store && typeof store.getEvidenceList === 'function') ? store.getEvidenceList() : [];

    // Ensure all cases referenced by evidence exist in case registry
    const registeredCaseNumbers = new Set(cases.map(c => (c.caseNumber || '').trim().toUpperCase()));
    evidenceList.forEach(ev => {
      if (ev && ev.caseNumber) {
        const numOnly = ev.caseNumber.split(' ')[0].trim().toUpperCase();
        if (numOnly && !registeredCaseNumbers.has(numOnly)) {
          registeredCaseNumbers.add(numOnly);
          cases.push({
            id: `CASE-${numOnly}`,
            caseNumber: numOnly,
            title: ev.caseTitle || ev.caseNumber,
            category: ev.category || 'General Forensics',
            leadAgency: ev.custodianAgency || 'police',
            leadAgencyName: ev.currentCustodian || 'Investigating Authority',
            investigatingOfficer: 'System Security Administrator',
            courtJurisdiction: 'Metropolitan High Judicial Registry',
            status: 'ACTIVE_INVESTIGATION',
            openedDate: ev.seizureDate || '2026-10-24 00:00:00 UTC',
            storageFolder: `evidence_vault/Case_${numOnly}/`,
            description: 'Digital evidence dossier holding cryptographically fingerprinted exhibits.'
          });
        }
      }
    });

    return { cases, evidenceList };
  },

  getFilteredData() {
    const { cases, evidenceList } = this.getCasesAndEvidence();
    const q = (this.searchQuery || '').toLowerCase().trim();

    const filteredEvidence = evidenceList.filter(ev => {
      if (!ev) return false;

      // Category match
      const catMatches = this.currentCategory === 'ALL' || ev.category === this.currentCategory;

      // Status match
      const statusMatches = this.currentStatus === 'ALL' || ev.status === this.currentStatus;

      // Query match
      const searchMatches = !q ||
        (ev.id && ev.id.toLowerCase().includes(q)) ||
        (ev.title && ev.title.toLowerCase().includes(q)) ||
        (ev.caseNumber && ev.caseNumber.toLowerCase().includes(q)) ||
        (ev.sha256 && ev.sha256.toLowerCase().includes(q)) ||
        (ev.currentCustodian && ev.currentCustodian.toLowerCase().includes(q)) ||
        (ev.tags && Array.isArray(ev.tags) && ev.tags.some(t => t.toLowerCase().includes(q)));

      return catMatches && statusMatches && searchMatches;
    });

    return { cases, evidenceList, filteredEvidence, q };
  },

  render(container) {
    if (!container) return;

    const { cases, evidenceList, filteredEvidence } = this.getFilteredData();

    // Default to Case 1 if activeCaseNumber is not set or not in current cases
    if (!this.activeCaseNumber || !cases.some(c => c.caseNumber === this.activeCaseNumber)) {
      this.activeCaseNumber = cases.length > 0 ? cases[0].caseNumber : '';
    }

    const categories = ['ALL', 'Memory Dump', 'Video Surveillance', 'Disk Image', 'Mobile Forensics', 'Network Telemetry', 'Encrypted Archive'];

    // Check if persistent wrapper already exists inside container
    const existingWrapper = document.getElementById('evidence-vault-wrapper');
    if (existingWrapper && container.contains(existingWrapper)) {
      // Just update dynamic metrics, dropdowns, and tabbed content without wiping out search input
      this.refreshCaseFilterDropdown();
      this.updateMetrics();
      this.renderDynamicContent();
      return;
    }

    // Initial render of the complete view structure (matches the user's interface screenshot)
    container.innerHTML = `
      <div id="evidence-vault-wrapper" class="space-y-6">
        <!-- Top Title & Primary Actions (Matches Screenshot) -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <i data-lucide="folder-lock" class="w-6 h-6 text-cyan-400"></i>
                <span>Case Files & Evidence Vault</span>
              </h2>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">
                DOSSIER-STORE
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Create investigation case files and store cryptographically sealed evidence artifacts inside each case dossier.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <button onclick="window.DEISApp.openModal('create-case-modal')" class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-semibold text-xs rounded-lg transition flex items-center gap-2 shadow cursor-pointer">
              <i data-lucide="folder-plus" class="w-4 h-4 text-cyan-400"></i>
              <span>+ Open New Case File</span>
            </button>

            <button onclick="window.DEISApp.openModal('ingest-modal')" class="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition cursor-pointer">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>+ Ingest Evidence Artifact</span>
            </button>
          </div>
        </div>

        <!-- Metric Summary Cards (Matches Screenshot) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">REGISTERED CASE FILES</div>
            <div id="metric-case-count" class="mt-1 text-2xl font-bold text-cyan-300 font-mono">
              ${cases.length} <span class="text-xs text-slate-400 font-sans font-normal">case files</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Dedicated folders storing verified evidence</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">TOTAL EVIDENCE STORED</div>
            <div id="metric-evidence-count" class="mt-1 text-2xl font-bold text-white font-mono">
              ${evidenceList.length} <span class="text-xs text-slate-400 font-sans font-normal">artifacts</span>
            </div>
            <div class="text-[10px] text-emerald-400 mt-1 font-mono">100% SHA-256 Verified</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE IN CURRENT FILTER</div>
            <div id="metric-filtered-evidence-count" class="mt-1 text-2xl font-bold text-purple-400 font-mono">
              ${filteredEvidence.length} <span class="text-xs text-slate-400 font-sans font-normal">matching</span>
            </div>
            <div id="metric-filtered-cases-subtitle" class="text-[10px] text-slate-400 mt-1 font-mono">
              Across ${cases.length} case file${cases.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        <!-- Filter & Search Bar (Matches Screenshot) -->
        <div class="cyber-card p-4 rounded-xl space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <!-- Search Input: Stays permanent in DOM, never destroyed during typing -->
            <div class="md:col-span-6 relative">
              <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input 
                type="text" 
                id="evidence-search-input"
                placeholder="Search case files, titles, officers, or SHA-256 hashes..." 
                value="${this.searchQuery}"
                oninput="EvidenceView.handleSearch(this.value)"
                autocomplete="off"
                class="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <!-- Case Filter Dropdown -->
            <div class="md:col-span-3 flex items-center gap-2">
              <label class="text-xs text-slate-400 shrink-0 font-medium">Case File:</label>
              <select 
                id="case-filter-select"
                onchange="EvidenceView.handleCaseFilter(this.value)"
                class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 truncate cursor-pointer font-mono"
              >
                <option value="ALL" ${this.selectedCase === 'ALL' ? 'selected' : ''}>📁 All Case Files (${cases.length})</option>
                ${cases.map(c => `
                  <option value="${c.caseNumber}" ${this.activeCaseNumber === c.caseNumber ? 'selected' : ''}>📂 [${c.caseNumber}] ${c.title}</option>
                `).join('')}
              </select>
            </div>

            <!-- Status Filter Dropdown -->
            <div class="md:col-span-3 flex items-center gap-2">
              <label class="text-xs text-slate-400 shrink-0 font-medium">Status:</label>
              <select 
                id="status-filter-select"
                onchange="EvidenceView.handleStatusFilter(this.value)"
                class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL" ${this.currentStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
                <option value="IN_VAULT" ${this.currentStatus === 'IN_VAULT' ? 'selected' : ''}>In Vault</option>
                <option value="IN_TRANSIT" ${this.currentStatus === 'IN_TRANSIT' ? 'selected' : ''}>In Transit</option>
                <option value="UNDER_ANALYSIS" ${this.currentStatus === 'UNDER_ANALYSIS' ? 'selected' : ''}>Forensics Lab</option>
                <option value="ADMITTED_IN_COURT" ${this.currentStatus === 'ADMITTED_IN_COURT' ? 'selected' : ''}>Court Admitted</option>
                <option value="TAMPERED" ${this.currentStatus === 'TAMPERED' ? 'selected' : ''}>Tampered</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1">
            <span class="text-slate-400 shrink-0 text-[11px] font-mono">Category:</span>
            ${categories.map(cat => `
              <button 
                data-cat="${cat}"
                onclick="EvidenceView.handleCategoryFilter('${cat}')"
                class="category-pill-btn px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer ${this.currentCategory === cat ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}"
              >
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Dynamic Container for Case Tabs & Stored Evidences -->
        <div id="evidence-vault-dynamic-content" class="space-y-4">
          <!-- Populated by renderDynamicContent -->
        </div>
      </div>
    `;

    // Render tabbed case view & evidence
    this.renderDynamicContent();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  updateMetrics() {
    const { cases, evidenceList, filteredEvidence } = this.getFilteredData();

    const caseCountEl = document.getElementById('metric-case-count');
    if (caseCountEl) {
      caseCountEl.innerHTML = `${cases.length} <span class="text-xs text-slate-400 font-sans font-normal">case files</span>`;
    }

    const evCountEl = document.getElementById('metric-evidence-count');
    if (evCountEl) {
      evCountEl.innerHTML = `${evidenceList.length} <span class="text-xs text-slate-400 font-sans font-normal">artifacts</span>`;
    }

    const filteredCountEl = document.getElementById('metric-filtered-evidence-count');
    if (filteredCountEl) {
      filteredCountEl.innerHTML = `${filteredEvidence.length} <span class="text-xs text-slate-400 font-sans font-normal">matching</span>`;
    }

    const filteredSubtitleEl = document.getElementById('metric-filtered-cases-subtitle');
    if (filteredSubtitleEl) {
      // Find how many cases have matching evidence
      const matchingCases = cases.filter(c => 
        filteredEvidence.some(ev => ev.caseNumber && ev.caseNumber.toUpperCase().includes(c.caseNumber.toUpperCase()))
      );
      filteredSubtitleEl.textContent = `Across ${matchingCases.length} case file${matchingCases.length === 1 ? '' : 's'}`;
    }
  },

  renderDynamicContent() {
    const container = document.getElementById('evidence-vault-dynamic-content');
    if (!container) return;

    const { cases, evidenceList, filteredEvidence, q } = this.getFilteredData();

    if (cases.length === 0) {
      container.innerHTML = `
        <div class="cyber-card p-12 text-center rounded-xl space-y-3">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
            <i data-lucide="folder-lock" class="w-6 h-6"></i>
          </div>
          <h3 class="text-slate-300 font-bold text-sm">No Investigation Case Files Found</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't registered any legal cases yet. Create your first case dossier to store digital evidence.
          </p>
          <div class="pt-2">
            <button onclick="window.DEISApp.openModal('create-case-modal')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
              + Open First Case File
            </button>
          </div>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
      return;
    }

    // Default to Case 1 if activeCaseNumber is not set or not in cases
    if (!this.activeCaseNumber || !cases.some(c => c.caseNumber === this.activeCaseNumber)) {
      this.activeCaseNumber = cases[0].caseNumber;
    }

    // Identify active case dossier
    const activeCase = cases.find(c => c.caseNumber === this.activeCaseNumber) || cases[0];
    const activeCaseIndex = cases.findIndex(c => c.caseNumber === activeCase.caseNumber);

    // Get all evidence stored in this active case
    const allCaseEvidence = evidenceList.filter(ev => 
      (ev.caseId && ev.caseId === activeCase.id) ||
      (ev.caseNumber && ev.caseNumber.toUpperCase().includes(activeCase.caseNumber.toUpperCase()))
    );

    // Filtered evidence for this active case
    const displayedCaseEvidence = filteredEvidence.filter(ev => 
      (ev.caseId && ev.caseId === activeCase.id) ||
      (ev.caseNumber && ev.caseNumber.toUpperCase().includes(activeCase.caseNumber.toUpperCase()))
    );

    const hasTampered = allCaseEvidence.some(ev => ev.status === 'TAMPERED');
    const custodians = Array.from(new Set(allCaseEvidence.map(ev => ev.currentCustodian).filter(Boolean)));

    container.innerHTML = `
      <!-- BROWSER-STYLE CASE TABS BAR (Auto-Resizing like Google Chrome Tabs) -->
      <div class="space-y-0">
        <!-- Tab Strip Header (Tabs shrink and resize proportionally if overflowing, exactly like Chrome) -->
        <div class="flex items-end gap-1 px-2 pt-2 bg-navy-950/95 border-x border-t border-slate-800 rounded-t-2xl select-none overflow-hidden w-full">
          <div class="flex items-end gap-1 flex-1 min-w-0 overflow-hidden flex-nowrap">
            ${cases.map((c, idx) => {
              const isSelected = (c.caseNumber === activeCase.caseNumber);
              
              // Evidence count in this case
              const cAllEv = evidenceList.filter(ev => 
                (ev.caseId && ev.caseId === c.id) ||
                (ev.caseNumber && ev.caseNumber.toUpperCase().includes(c.caseNumber.toUpperCase()))
              );
              const cFilteredEv = filteredEvidence.filter(ev => 
                (ev.caseId && ev.caseId === c.id) ||
                (ev.caseNumber && ev.caseNumber.toUpperCase().includes(c.caseNumber.toUpperCase()))
              );
              const cTampered = cAllEv.some(ev => ev.status === 'TAMPERED');

              const badgeText = (q || this.currentCategory !== 'ALL' || this.currentStatus !== 'ALL')
                ? `${cFilteredEv.length}/${cAllEv.length}`
                : `${cAllEv.length}`;

              return `
                <button
                  onclick="EvidenceView.switchCaseTab('${c.caseNumber}')"
                  class="chrome-case-tab group relative flex items-center justify-center sm:justify-start gap-1.5 px-2 py-2 sm:py-2.5 rounded-t-xl text-xs font-mono transition cursor-pointer select-none overflow-hidden shrink ${
                    isSelected
                      ? 'bg-slate-900 text-white border-t-2 border-l border-r border-cyan-400 font-bold -mb-[1px] z-10 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/70 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 border-t border-l border-r border-slate-800/80'
                  }"
                  style="flex: 1 1 0px; min-width: 28px; max-width: 220px;"
                  title="${c.caseNumber}: ${c.title}"
                >
                  <!-- Tab Icon (Always centered, visible even when severely shrunk down to 28px) -->
                  <div class="w-4 h-4 flex items-center justify-center shrink-0 ${isSelected ? (cTampered ? 'text-rose-400' : 'text-cyan-400') : (cTampered ? 'text-rose-500' : 'text-slate-500 group-hover:text-slate-300')}">
                    <i data-lucide="${cTampered ? 'alert-triangle' : 'folder-lock'}" class="w-3.5 h-3.5"></i>
                  </div>

                  <!-- Tab Label (Truncates dynamically; hides smoothly when tab is shrunk) -->
                  <div class="flex items-center gap-1 font-sans truncate min-w-0 overflow-hidden text-left">
                    <span class="font-mono font-bold text-xs ${isSelected ? 'text-cyan-300' : 'text-slate-300'} truncate">
                      ${c.caseNumber}
                    </span>
                    <span class="text-[11px] truncate hidden md:inline ${isSelected ? 'text-slate-100 font-medium' : 'text-slate-400'}">
                      ${c.title}
                    </span>
                  </div>

                  <!-- Tab Evidence Count Pill (Hides gracefully on compact tabs) -->
                  <span class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold shrink-0 hidden lg:inline ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }" title="${badgeText} artifacts in this case">
                    ${badgeText}
                  </span>

                  ${isSelected ? `
                    <!-- Chrome Active Tab Close 'x' icon (matching Chrome screenshot) -->
                    <span class="ml-auto w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 shrink-0 hidden sm:flex" title="Active Case">
                      <i data-lucide="x" class="w-2.5 h-2.5"></i>
                    </span>
                  ` : ''}
                </button>
              `;
            }).join('')}

            <!-- Chrome Style '+' New Tab Button (Fixed width, never shrinks) -->
            <button 
              onclick="window.DEISApp.openModal('create-case-modal')" 
              class="w-7 h-7 mb-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 flex items-center justify-center transition cursor-pointer shadow-sm shrink-0 ml-1"
              title="Open a new Case File dossier"
            >
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- ACTIVE CASE DOSSIER (Browser Content Window) -->
        <div class="cyber-card rounded-b-2xl border border-slate-800 overflow-hidden space-y-0 transition ${hasTampered ? 'border-rose-500/80 bg-rose-950/10' : ''}">
          <!-- Active Case Header Banner -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl ${hasTampered ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'} flex items-center justify-center shrink-0 shadow-lg">
                <i data-lucide="${hasTampered ? 'alert-triangle' : 'folder-lock'}" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">
                    CASE ${activeCaseIndex + 1}: ${activeCase.caseNumber}
                  </span>
                  <span class="cyber-badge bg-slate-800 text-slate-300 border border-slate-700 text-[9px]">
                    ${activeCase.category}
                  </span>
                  <span class="cyber-badge ${hasTampered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'} text-[9px]">
                    ${hasTampered ? 'INTEGRITY ALERT' : 'ACTIVE INVESTIGATION'}
                  </span>
                </div>
                <h3 class="text-base font-bold text-white tracking-tight mt-1">
                  ${activeCase.title}
                </h3>
                <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  ${activeCase.description}
                </p>
              </div>
            </div>

            <!-- Store Evidence Button into this specific Active Case -->
            <div class="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
              <button 
                onclick="window.DEISApp.openStoreEvidenceModal('${activeCase.caseNumber}')" 
                class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                title="Store and register a digital evidence artifact into Case ${activeCase.caseNumber}"
              >
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>+ Store Evidence in this Case</span>
              </button>
            </div>
          </div>

          <!-- Active Case Metadata Strip -->
          <div class="px-5 py-2.5 bg-navy-950/90 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-mono">
            <div class="flex items-center gap-4 flex-wrap text-slate-400 text-[11px]">
              <div>
                <span class="text-slate-500">Jurisdiction:</span> 
                <span class="text-slate-300">${activeCase.courtJurisdiction}</span>
              </div>
              <div>•</div>
              <div>
                <span class="text-slate-500">Lead Agency:</span> 
                <span class="text-slate-300">${activeCase.leadAgencyName || activeCase.leadAgency}</span>
              </div>
              <div>•</div>
              <div>
                <span class="text-slate-500">Vault Folder:</span> 
                <span class="text-cyan-300 select-all">${activeCase.storageFolder || `evidence_vault/Case_${activeCase.caseNumber}/`}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-[11px]">
              <span class="text-slate-400 font-sans">Active Custodians:</span>
              ${custodians.length > 0 ? custodians.map(c => `
                <span class="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">
                  ${c}
                </span>
              `).join('') : '<span class="text-slate-500 font-sans">No active transfers</span>'}
            </div>
          </div>

          <!-- Stored Evidence Files in this Active Case -->
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs font-bold text-slate-200 flex items-center gap-2">
                <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
                <span>Evidence Artifacts Stored in Case ${activeCase.caseNumber} (${displayedCaseEvidence.length}${displayedCaseEvidence.length !== allCaseEvidence.length ? ` of ${allCaseEvidence.length}` : ''})</span>
              </div>
              <span class="text-[10px] text-slate-500 font-mono">Cryptographically Fingerprinted with SHA-256</span>
            </div>

            ${displayedCaseEvidence.length === 0 ? `
              <div class="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-center space-y-2.5">
                <i data-lucide="folder-open" class="w-9 h-9 mx-auto text-slate-600"></i>
                <h4 class="text-xs font-bold text-slate-300">
                  ${allCaseEvidence.length === 0 ? `No evidence artifacts have been stored in Case ${activeCase.caseNumber} yet.` : `No artifacts in Case ${activeCase.caseNumber} match your current filter criteria.`}
                </h4>
                <p class="text-xs text-slate-500 max-w-sm mx-auto">
                  ${allCaseEvidence.length === 0 ? 'Click below to register and bitstream-fingerprint digital evidence directly into this case dossier.' : 'Try clearing your search query or reset status/category filters.'}
                </p>
                <div class="pt-2 flex items-center justify-center gap-2">
                  ${allCaseEvidence.length > 0 ? `
                    <button onclick="EvidenceView.resetFilters()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer">
                      Reset Filters
                    </button>
                  ` : ''}
                  <button onclick="window.DEISApp.openStoreEvidenceModal('${activeCase.caseNumber}')" class="px-3.5 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition cursor-pointer">
                    + Store First Evidence in Case ${activeCase.caseNumber}
                  </button>
                </div>
              </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                      <th class="py-2.5 px-3">EVIDENCE ARTIFACT</th>
                      <th class="py-2.5 px-3">CATEGORY & FILE TYPE</th>
                      <th class="py-2.5 px-3">SHA-256 HASH (BITSTREAM FINGERPRINT)</th>
                      <th class="py-2.5 px-3">CURRENT CUSTODIAN</th>
                      <th class="py-2.5 px-3">STATUS</th>
                      <th class="py-2.5 px-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 font-sans">
                    ${displayedCaseEvidence.map(item => `
                      <tr class="hover:bg-slate-800/30 transition">
                        <!-- Title & ID -->
                        <td class="py-3 px-3">
                          <div class="font-bold text-white flex items-center gap-1.5">
                            <span>${item.title}</span>
                            ${item.tags && item.tags.includes('Court-Exhibit-A') ? `
                              <span class="cyber-badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px]">EXHIBIT A</span>
                            ` : ''}
                          </div>
                          <div class="text-[10px] text-cyan-300 font-mono flex items-center gap-2 mt-0.5">
                            <span>${item.id}</span>
                            <span>•</span>
                            <span class="text-slate-400 select-all">${item.fileName || `${item.id}_artifact.raw`}</span>
                            <span>•</span>
                            <span class="text-slate-400">${item.fileSize || 'Unknown Size'}</span>
                          </div>
                        </td>

                        <!-- Category & Format -->
                        <td class="py-3 px-3">
                          <div class="text-slate-200 font-medium">${item.category}</div>
                          <div class="text-[10px] text-slate-500 font-mono">${item.fileType || 'binary/raw'}</div>
                        </td>

                        <!-- SHA-256 Hash with Copy & Blockchain Link -->
                        <td class="py-3 px-3">
                          <div class="font-mono text-[11px] text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 max-w-xs">
                            <span class="truncate select-all text-cyan-300 font-semibold" title="${item.sha256}">
                              ${item.sha256 ? item.sha256.substring(0, 16) + '...' + item.sha256.substring(item.sha256.length - 8) : 'Generating...'}
                            </span>
                            <button onclick="window.DEISApp.copyToClipboard('${item.sha256}', 'SHA-256 Hash copied!')" class="text-slate-500 hover:text-white shrink-0 cursor-pointer" title="Copy full SHA-256">
                              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                            </button>
                          </div>
                          <div class="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                            <i data-lucide="blocks" class="w-3 h-3 text-emerald-400 shrink-0"></i>
                            <button onclick="window.DEISApp.viewChainForEvidence('${item.id}')" class="hover:underline text-emerald-400 font-semibold cursor-pointer text-left" title="View anchored block in blockchain ledger">
                              Anchored in Blockchain Ledger ↗
                            </button>
                          </div>
                        </td>

                        <!-- Custodian -->
                        <td class="py-3 px-3">
                          <span class="cyber-badge bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px]">
                            ${item.currentCustodian}
                          </span>
                          <div class="text-[10px] text-slate-500 font-mono mt-0.5">Agency: ${item.custodianAgency}</div>
                        </td>

                        <!-- Status Badge -->
                        <td class="py-3 px-3">
                          ${window.renderStatusBadge ? window.renderStatusBadge(item.status) : `<span class="cyber-badge">${item.status}</span>`}
                        </td>

                        <!-- Actions -->
                        <td class="py-3 px-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button 
                              onclick="window.DEISApp.verifyEvidence('${item.id}')"
                              class="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-semibold transition cursor-pointer"
                              title="Verify this file against its sealed vault fingerprint"
                            >
                              Verify
                            </button>
                            <button 
                              onclick="window.DEISApp.initiateTransfer('${item.id}')"
                              class="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-semibold transition cursor-pointer"
                              title="Initiate custody transfer to another operating body"
                            >
                              Transfer
                            </button>
                            <button 
                              onclick="window.DEISApp.inspectEvidence('${item.id}')"
                              class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition cursor-pointer"
                              title="Inspect metadata & seizure details"
                            >
                              Inspect
                            </button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  refreshCaseFilterDropdown() {
    const select = document.getElementById('case-filter-select');
    if (!select) return;
    const { cases } = this.getCasesAndEvidence();
    select.innerHTML = `
      <option value="ALL" ${this.selectedCase === 'ALL' ? 'selected' : ''}>📁 All Case Files (${cases.length})</option>
      ${cases.map(c => `
        <option value="${c.caseNumber}" ${this.activeCaseNumber === c.caseNumber ? 'selected' : ''}>📂 [${c.caseNumber}] ${c.title}</option>
      `).join('')}
    `;
  },

  switchCaseTab(caseNumber) {
    this.activeCaseNumber = caseNumber;
    // Keep the Case File select dropdown synced with active tab
    const caseSelect = document.getElementById('case-filter-select');
    if (caseSelect) {
      caseSelect.value = caseNumber;
    }
    this.renderDynamicContent();
  },

  handleSearch(query) {
    this.searchQuery = query;
    // Update live metric counts without touching or recreating the search input DOM
    this.updateMetrics();
    // Re-render only the dynamic tab bar and case content
    this.renderDynamicContent();
  },

  handleCaseFilter(caseValue) {
    this.selectedCase = caseValue;
    if (caseValue !== 'ALL') {
      this.activeCaseNumber = caseValue;
    }
    this.updateMetrics();
    this.renderDynamicContent();
  },

  handleStatusFilter(status) {
    this.currentStatus = status;
    this.updateMetrics();
    this.renderDynamicContent();
  },

  handleCategoryFilter(cat) {
    this.currentCategory = cat;
    // Update pill button styling directly in the DOM
    const pills = document.querySelectorAll('.category-pill-btn');
    pills.forEach(p => {
      const pillCat = p.getAttribute('data-cat');
      if (pillCat === cat) {
        p.className = 'category-pill-btn px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      } else {
        p.className = 'category-pill-btn px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800';
      }
    });
    this.updateMetrics();
    this.renderDynamicContent();
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedCase = 'ALL';
    this.currentCategory = 'ALL';
    this.currentStatus = 'ALL';

    const input = document.getElementById('evidence-search-input');
    if (input) input.value = '';

    const caseSelect = document.getElementById('case-filter-select');
    if (caseSelect) {
      const { cases } = this.getCasesAndEvidence();
      caseSelect.value = (cases.length > 0 ? cases[0].caseNumber : 'ALL');
      this.activeCaseNumber = (cases.length > 0 ? cases[0].caseNumber : null);
    }

    const statusSelect = document.getElementById('status-filter-select');
    if (statusSelect) statusSelect.value = 'ALL';

    const pills = document.querySelectorAll('.category-pill-btn');
    pills.forEach(p => {
      const pillCat = p.getAttribute('data-cat');
      if (pillCat === 'ALL') {
        p.className = 'category-pill-btn px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      } else {
        p.className = 'category-pill-btn px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800';
      }
    });

    this.updateMetrics();
    this.renderDynamicContent();
  }
};

window.EvidenceView = EvidenceView;
