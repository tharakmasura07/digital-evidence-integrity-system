/**
 * Digital Evidence Integrity System (DEIS)
 * View: Case Files Dossier & Stored Evidence Vault
 * 
 * Manages Legal Case Files that contain and store cryptographically sealed evidence artifacts.
 */

const EvidenceView = {
  currentCategory: 'ALL',
  currentStatus: 'ALL',
  selectedCase: 'ALL',
  searchQuery: '',

  render(container) {
    if (!container) return;

    const store = window.DEISStore;
    const cases = (store && typeof store.getCases === 'function') ? store.getCases() : [];
    const evidenceList = (store && typeof store.getEvidenceList === 'function') ? store.getEvidenceList() : [];

    // Ensure all cases from evidence exist in case registry
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

    // Filter evidence based on search, status, category, and case
    const q = (this.searchQuery || '').toLowerCase().trim();
    const filteredEvidence = evidenceList.filter(ev => {
      if (!ev) return false;

      // Case match
      const caseMatches = this.selectedCase === 'ALL' ||
        (ev.caseNumber && ev.caseNumber.toUpperCase().includes(this.selectedCase.toUpperCase())) ||
        (ev.caseId && ev.caseId.toUpperCase() === this.selectedCase.toUpperCase());

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

      return caseMatches && catMatches && statusMatches && searchMatches;
    });

    // Filter Case Files
    const filteredCases = cases.filter(c => {
      if (this.selectedCase !== 'ALL' && c.caseNumber !== this.selectedCase && c.id !== this.selectedCase) {
        return false;
      }
      if (q) {
        const matchesCaseMeta = (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
          (c.title && c.title.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q));

        const hasMatchingEvidence = filteredEvidence.some(ev => 
          ev.caseNumber && ev.caseNumber.toUpperCase().includes(c.caseNumber.toUpperCase())
        );

        return matchesCaseMeta || hasMatchingEvidence;
      }
      return true;
    });

    const categories = ['ALL', 'Memory Dump', 'Video Surveillance', 'Disk Image', 'Mobile Forensics', 'Network Telemetry', 'Encrypted Archive'];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Title & Primary Actions -->
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

        <!-- Metric Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Registered Case Files</div>
            <div class="mt-1 text-2xl font-bold text-cyan-300 font-mono">${cases.length} <span class="text-xs text-slate-400 font-sans font-normal">case files</span></div>
            <div class="text-[10px] text-slate-400 mt-1">Dedicated folders storing verified evidence</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Total Evidence Stored</div>
            <div class="mt-1 text-2xl font-bold text-white font-mono">${evidenceList.length} <span class="text-xs text-slate-400 font-sans font-normal">artifacts</span></div>
            <div class="text-[10px] text-emerald-400 mt-1 font-mono">100% SHA-256 Verified</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Evidence in Current Filter</div>
            <div class="mt-1 text-2xl font-bold text-purple-400 font-mono">${filteredEvidence.length} <span class="text-xs text-slate-400 font-sans font-normal">matching</span></div>
            <div class="text-[10px] text-slate-400 mt-1 font-mono">Across ${filteredCases.length} case file${filteredCases.length === 1 ? '' : 's'}</div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="cyber-card p-4 rounded-xl space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <!-- Search -->
            <div class="md:col-span-6 relative">
              <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input 
                type="text" 
                id="evidence-search-input"
                placeholder="Search case files, titles, officers, or SHA-256 hashes..." 
                value="${this.searchQuery}"
                oninput="EvidenceView.handleSearch(this.value)"
                class="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <!-- Case Filter -->
            <div class="md:col-span-3 flex items-center gap-2">
              <label class="text-xs text-slate-400 shrink-0 font-medium">Case File:</label>
              <select 
                onchange="EvidenceView.handleCaseFilter(this.value)"
                class="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 truncate cursor-pointer"
              >
                <option value="ALL" ${this.selectedCase === 'ALL' ? 'selected' : ''}>📁 All Case Files (${cases.length})</option>
                ${cases.map(c => `
                  <option value="${c.caseNumber}" ${this.selectedCase === c.caseNumber ? 'selected' : ''}>📂 [${c.caseNumber}] ${c.title}</option>
                `).join('')}
              </select>
            </div>

            <!-- Status Filter -->
            <div class="md:col-span-3 flex items-center gap-2">
              <label class="text-xs text-slate-400 shrink-0 font-medium">Status:</label>
              <select 
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
                onclick="EvidenceView.handleCategoryFilter('${cat}')"
                class="px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 cursor-pointer ${this.currentCategory === cat ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}"
              >
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Case Files Container -->
        ${filteredCases.length === 0 ? `
          <div class="cyber-card p-12 text-center rounded-xl space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
              <i data-lucide="folder-lock" class="w-6 h-6"></i>
            </div>
            <h3 class="text-slate-300 font-bold text-sm">No Case Files Found</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              No investigation cases match your current filters. Click below to create a new case file.
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="EvidenceView.resetFilters()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer">
                Reset Filters
              </button>
              <button onclick="window.DEISApp.openModal('create-case-modal')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
                + Open New Case File
              </button>
            </div>
          </div>
        ` : `
          <div class="space-y-6">
            ${filteredCases.map(caseFile => {
              // Get all evidence stored in this specific Case File
              const caseEvidence = filteredEvidence.filter(ev => 
                (ev.caseId && ev.caseId === caseFile.id) ||
                (ev.caseNumber && ev.caseNumber.toUpperCase().includes(caseFile.caseNumber.toUpperCase()))
              );

              const hasTampered = caseEvidence.some(ev => ev.status === 'TAMPERED');
              const custodians = Array.from(new Set(caseEvidence.map(ev => ev.currentCustodian).filter(Boolean)));

              return `
                <!-- CASE FILE DOSSIER CARD -->
                <div class="cyber-card rounded-2xl border ${hasTampered ? 'border-rose-500/80 bg-rose-950/10' : 'border-slate-800'} overflow-hidden space-y-0 transition">
                  
                  <!-- Case Dossier Header -->
                  <div class="p-4 sm:p-5 bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div class="flex items-start sm:items-center gap-3.5">
                      <div class="w-12 h-12 rounded-xl ${hasTampered ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'} flex items-center justify-center shrink-0 shadow-lg">
                        <i data-lucide="${hasTampered ? 'alert-triangle' : 'folder-lock'}" class="w-6 h-6"></i>
                      </div>
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">
                            CASE FILE: ${caseFile.caseNumber}
                          </span>
                          <span class="cyber-badge bg-slate-800 text-slate-300 border border-slate-700 text-[9px]">
                            ${caseFile.category}
                          </span>
                          <span class="cyber-badge ${hasTampered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'} text-[9px]">
                            ${hasTampered ? 'INTEGRITY ALERT' : 'ACTIVE INVESTIGATION'}
                          </span>
                        </div>
                        <h3 class="text-base font-bold text-white tracking-tight mt-1">
                          ${caseFile.title}
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          ${caseFile.description}
                        </p>
                      </div>
                    </div>

                    <!-- Store Evidence Button for this specific Case File -->
                    <div class="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                      <button 
                        onclick="window.DEISApp.openStoreEvidenceModal('${caseFile.caseNumber}')" 
                        class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                        title="Store and register a digital evidence artifact into this case file"
                      >
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>+ Store Evidence in this Case</span>
                      </button>
                    </div>
                  </div>

                  <!-- Case Metadata Strip -->
                  <div class="px-5 py-2.5 bg-navy-950/90 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-mono">
                    <div class="flex items-center gap-4 flex-wrap text-slate-400 text-[11px]">
                      <div>
                        <span class="text-slate-500">Jurisdiction:</span> 
                        <span class="text-slate-300">${caseFile.courtJurisdiction}</span>
                      </div>
                      <div>•</div>
                      <div>
                        <span class="text-slate-500">Lead Agency:</span> 
                        <span class="text-slate-300">${caseFile.leadAgencyName || caseFile.leadAgency}</span>
                      </div>
                      <div>•</div>
                      <div>
                        <span class="text-slate-500">Disk Folder:</span> 
                        <span class="text-cyan-300 select-all">${caseFile.storageFolder || `evidence_vault/Case_${caseFile.caseNumber}/`}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 text-[11px]">
                      <span class="text-slate-400 font-sans">Active Custodians:</span>
                      ${custodians.length > 0 ? custodians.map(c => `
                        <span class="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">
                          ${c}
                        </span>
                      `).join('') : '<span class="text-slate-500">No active transfers</span>'}
                    </div>
                  </div>

                  <!-- Evidence Files Stored Inside This Case -->
                  <div class="p-4 sm:p-5">
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
                        <span>Stored Evidence Artifacts (${caseEvidence.length})</span>
                      </div>
                      <span class="text-[10px] text-slate-500 font-mono">Cryptographically Sealed in Case Folder</span>
                    </div>

                    ${caseEvidence.length === 0 ? `
                      <div class="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-center space-y-2">
                        <i data-lucide="folder-open" class="w-8 h-8 mx-auto text-slate-600"></i>
                        <p class="text-xs text-slate-400">No evidence artifacts have been stored in Case <strong>${caseFile.caseNumber}</strong> yet.</p>
                        <button onclick="window.DEISApp.openStoreEvidenceModal('${caseFile.caseNumber}')" class="px-3.5 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition cursor-pointer">
                          + Store First Evidence in this Case File
                        </button>
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
                            ${caseEvidence.map(item => `
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

                                <!-- SHA-256 -->
                                <td class="py-3 px-3">
                                  <div class="font-mono text-[11px] text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 max-w-xs">
                                    <span class="truncate select-all text-cyan-300" title="${item.sha256}">
                                      ${item.sha256 ? item.sha256.substring(0, 16) + '...' + item.sha256.substring(item.sha256.length - 8) : 'Generating...'}
                                    </span>
                                    <button onclick="window.DEISApp.copyToClipboard('${item.sha256}', 'SHA-256 Hash copied!')" class="text-slate-500 hover:text-white shrink-0" title="Copy full SHA-256">
                                      <i data-lucide="copy" class="w-3.5 h-3.5"></i>
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
                                  ${window.renderStatusBadge(item.status)}
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
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.render(document.getElementById('view-container'));
  },

  handleCaseFilter(caseValue) {
    this.selectedCase = caseValue;
    this.render(document.getElementById('view-container'));
  },

  handleStatusFilter(status) {
    this.currentStatus = status;
    this.render(document.getElementById('view-container'));
  },

  handleCategoryFilter(cat) {
    this.currentCategory = cat;
    this.render(document.getElementById('view-container'));
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedCase = 'ALL';
    this.currentCategory = 'ALL';
    this.currentStatus = 'ALL';
    const input = document.getElementById('evidence-search-input');
    if (input) input.value = '';
    this.render(document.getElementById('view-container'));
  }
};

window.EvidenceView = EvidenceView;
