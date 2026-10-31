/**
 * Digital Evidence Integrity System (DEIS)
 * View: Executive Dashboard & Operational Command
 */

const DashboardView = {
  render(container) {
    if (!container) return;
    const store = window.DEISStore;
    const currentAgency = store.getCurrentAgency() || {
      id: 'admin',
      name: 'DEIS Root Access & Identity Control Authority',
      badge: 'ROOT-ADMIN',
      roleLabel: 'Root System Administrator',
      icon: 'shield-check',
      publicKey: '0x000000000000000000000000000000000000000000000000000000000000ADMIN'
    };
    const evidenceList = store.getEvidenceList() || [];
    const transfers = store.getTransfers() || [];
    const chainBlocks = store.getChainBlocks() || [];
    const tamperAlert = (store.state && store.state.tamperAlertActive) || false;

    const inVaultCount = evidenceList.filter(e => e.status === 'IN_VAULT').length;
    const inTransitCount = evidenceList.filter(e => e.status === 'IN_TRANSIT').length;
    const underAnalysisCount = evidenceList.filter(e => e.status === 'UNDER_ANALYSIS').length;
    const admittedCount = evidenceList.filter(e => e.status === 'ADMITTED_IN_COURT').length;
    const tamperedCount = evidenceList.filter(e => e.status === 'TAMPERED').length;

    const incomingForMe = (store.getIncomingTransfersForCurrentAgency() || []).filter(t => t && t.status === 'PENDING_ACCEPTANCE');

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Simple Guide Banner -->
        <div class="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-950/60 via-navy-900 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs font-mono uppercase tracking-wider">How DEIS Works</span>
              <span class="text-xs text-slate-400">Digital Evidence in 3 Simple Steps</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-200">
              <strong>1. Upload</strong> file to create its unique digital fingerprint (SHA-256) &bull;
              <strong>2. Transfer</strong> safely using a 6-digit secret PIN &bull;
              <strong>3. Verify</strong> in court to prove nobody modified or tampered with the file!
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="window.DEISApp.navigate('chain')" class="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
              <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i>
              <span>Test Tamper Simulator</span>
            </button>
          </div>
        </div>

        <!-- Top Operational Banner & Tamper Alert -->
        ${tamperAlert ? `
          <div class="cyber-glow-rose bg-rose-950/80 border-2 border-rose-500/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <i data-lucide="alert-triangle" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-rose-200 font-bold tracking-wide text-base sm:text-lg flex items-center gap-2">
                  <span>WARNING: FILE TAMPERING DETECTED!</span>
                  <span class="cyber-badge bg-rose-500/30 text-rose-300 border border-rose-500/50">HACK SIMULATION ACTIVE</span>
                </h3>
                <p class="text-rose-300/80 text-xs sm:text-sm mt-0.5">
                  A file was altered or modified. The digital fingerprint does not match the original evidence!
                </p>
              </div>
            </div>
            <button onclick="window.DEISApp.restoreIntegrity()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-lg flex items-center gap-2 transition shrink-0">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
              <span>Restore Original Evidence</span>
            </button>
          </div>
        ` : `
          <div class="cyber-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-cyan-500">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <i data-lucide="${currentAgency.icon || 'shield'}" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-lg font-bold text-white tracking-tight">${currentAgency.name}</h2>
                  <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">${currentAgency.badge}</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Current Department: <strong class="text-slate-200">${currentAgency.roleLabel}</strong></span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <button onclick="window.DEISApp.openModal('create-case-modal')" class="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition cursor-pointer">
                <i data-lucide="folder-plus" class="w-4 h-4 text-cyan-400"></i>
                <span>+ Case File</span>
              </button>
              <button onclick="window.DEISApp.openModal('ingest-modal')" class="flex-1 md:flex-initial px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs sm:text-sm rounded-lg shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition cursor-pointer">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Add Evidence</span>
              </button>
              <button onclick="window.DEISApp.navigate('transfers')" class="flex-1 md:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer">
                <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                <span>Transfer File</span>
              </button>
            </div>
          </div>
        `}

        <!-- Incoming Action Alert if any pending transfers -->
        ${incomingForMe.length > 0 ? `
          <div class="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <i data-lucide="bell-ring" class="w-4 h-4"></i>
              </div>
              <div>
                <p class="text-amber-200 text-sm font-semibold">
                  You have <span class="text-amber-400 underline font-bold">${incomingForMe.length} incoming transfer(s)</span> waiting for your 6-digit PIN verification!
                </p>
                <p class="text-xs text-amber-300/70">From: ${incomingForMe.map(t => (store.state && store.state.agencies && store.state.agencies[t.fromAgency] ? store.state.agencies[t.fromAgency].badge : t.fromAgency)).join(', ')}</p>
              </div>
            </div>
            <button onclick="window.DEISApp.navigate('transfers')" class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shrink-0 transition">
              Accept Transfer
            </button>
          </div>
        ` : ''}

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <!-- Total Artifacts -->
          <div class="cyber-card p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Evidence Files</span>
              <i data-lucide="folder" class="w-4 h-4 text-cyan-400"></i>
            </div>
            <div class="mt-2 text-2xl font-bold text-white font-mono">${evidenceList.length}</div>
            <div class="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <i data-lucide="check-circle-2" class="w-3 h-3"></i>
              <span>All Fingerprinted</span>
            </div>
          </div>

          <!-- In-Transit -->
          <div class="cyber-card p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">In Transfer</span>
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-amber-400"></i>
            </div>
            <div class="mt-2 text-2xl font-bold text-white font-mono">${inTransitCount}</div>
            <div class="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400">
              <i data-lucide="clock" class="w-3 h-3"></i>
              <span>Waiting for PIN</span>
            </div>
          </div>

          <!-- Under Forensic Analysis -->
          <div class="cyber-card p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">In Forensic Lab</span>
              <i data-lucide="microscope" class="w-4 h-4 text-cyan-400"></i>
            </div>
            <div class="mt-2 text-2xl font-bold text-white font-mono">${underAnalysisCount}</div>
            <div class="mt-1 flex items-center gap-1.5 text-[11px] text-cyan-400">
              <i data-lucide="shield-check" class="w-3 h-3"></i>
              <span>Under Analysis</span>
            </div>
          </div>

          <!-- Court Admitted -->
          <div class="cyber-card p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">In Court</span>
              <i data-lucide="scale" class="w-4 h-4 text-purple-400"></i>
            </div>
            <div class="mt-2 text-2xl font-bold text-white font-mono">${admittedCount}</div>
            <div class="mt-1 flex items-center gap-1.5 text-[11px] text-purple-400">
              <i data-lucide="award" class="w-3 h-3"></i>
              <span>Submitted as Evidence</span>
            </div>
          </div>

          <!-- Chain Health -->
          <div class="cyber-card p-4 rounded-xl border ${tamperedCount > 0 ? 'border-rose-500/80 bg-rose-950/20' : 'border-slate-800'} col-span-2 lg:col-span-1 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tamper Status</span>
              <i data-lucide="${tamperedCount > 0 ? 'alert-triangle' : 'shield-check'}" class="w-4 h-4 ${tamperedCount > 0 ? 'text-rose-400' : 'text-emerald-400'}"></i>
            </div>
            <div class="mt-2 text-2xl font-bold font-mono ${tamperedCount > 0 ? 'text-rose-400' : 'text-emerald-400'}">
              ${tamperedCount > 0 ? 'TAMPERED!' : '100% GENUINE'}
            </div>
            <div class="mt-1 flex items-center gap-1.5 text-[11px] ${tamperedCount > 0 ? 'text-rose-400' : 'text-emerald-400'}">
              <span class="w-2 h-2 rounded-full ${tamperedCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}"></span>
              <span>${tamperedCount > 0 ? 'Discrepancy detected' : 'All files authentic'}</span>
            </div>
          </div>
        </div>

        <!-- Middle Section: Transfer Pipeline Visualizer & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Transfer Pipeline Tracker -->
          <div class="cyber-card p-5 rounded-xl lg:col-span-2 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="git-commit" class="w-5 h-5 text-cyan-400"></i>
                <h3 class="font-bold text-slate-100 text-sm tracking-wide">Evidence Journey: From Crime Scene to Court</h3>
              </div>
              <span class="text-xs text-slate-400 font-mono">Standard 4-Step Chain</span>
            </div>

            <!-- Pipeline stages graphic -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2">
              <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 relative">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">1. Police Seizure</span>
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                </div>
                <p class="text-xs text-slate-300 font-semibold">Collected & Fingerprinted</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Seized at crime scene and locked with SHA-256 hash</p>
              </div>

              <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 relative">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">2. Forensic Lab</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p class="text-xs text-slate-300 font-semibold">Analyzed by Scientists</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Examined without touching or altering the master copy</p>
              </div>

              <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 relative">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">3. Prosecution</span>
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <p class="text-xs text-slate-300 font-semibold">Legal Case Prep</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Shared with defense lawyers and legal prosecution</p>
              </div>

              <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 relative">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold text-purple-400 uppercase tracking-wider">4. Courtroom</span>
                  <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                </div>
                <p class="text-xs text-slate-300 font-semibold">Trial & Final Verdict</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Admitted in court with full printable legal certificate</p>
              </div>
            </div>

            <!-- Active Evidence Table Preview -->
            <div class="pt-3">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Active Evidence Items</h4>
                <button onclick="window.DEISApp.navigate('evidence')" class="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition">
                  <span>View All in Vault</span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr class="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th class="py-2.5 px-3">EVIDENCE ID</th>
                      <th class="py-2.5 px-3">TITLE & CATEGORY</th>
                      <th class="py-2.5 px-3">SHA-256 INTEGRITY HASH</th>
                      <th class="py-2.5 px-3">CURRENT CUSTODIAN</th>
                      <th class="py-2.5 px-3">STATUS</th>
                      <th class="py-2.5 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 font-sans">
                    ${evidenceList.slice(0, 3).map(ev => `
                      <tr class="hover:bg-slate-800/40 transition">
                        <td class="py-2.5 px-3 font-mono font-semibold text-cyan-300">${ev.id}</td>
                        <td class="py-2.5 px-3">
                          <div class="font-medium text-slate-100">${ev.title}</div>
                          <div class="text-[10px] text-slate-500">${ev.category} • ${ev.fileSize}</div>
                        </td>
                        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                          <span title="${ev.sha256}" class="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            ${CryptoEngine.shortenHash(ev.sha256, 6)}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                          <span class="cyber-badge bg-slate-800 text-slate-200 border border-slate-700">${ev.currentCustodian}</span>
                        </td>
                        <td class="py-2.5 px-3">
                          ${renderStatusBadge(ev.status)}
                        </td>
                        <td class="py-2.5 px-3 text-right">
                          <button onclick="window.DEISApp.inspectEvidence('${ev.id}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition">
                            Inspect
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Quick Transfer & Integrity Tool Card -->
          <div class="cyber-card p-5 rounded-xl space-y-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
                <h3 class="font-bold text-slate-100 text-sm">Security & Compliance Center</h3>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                DEIS enforces dual-party cryptographic non-repudiation. Transfers require originating officer signature, ephemeral TOTP handoff PIN, and recipient bitstream re-verification.
              </p>

              <!-- Quick Compliance badges -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div class="text-[10px] text-slate-400 uppercase font-mono">Standard</div>
                  <div class="text-xs font-bold text-slate-200 mt-0.5">ISO/IEC 27037</div>
                  <div class="text-[10px] text-emerald-400 mt-0.5">Compliant</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div class="text-[10px] text-slate-400 uppercase font-mono">Evidence Rule</div>
                  <div class="text-xs font-bold text-slate-200 mt-0.5">FRE Rule 902(14)</div>
                  <div class="text-[10px] text-emerald-400 mt-0.5">Self-Authenticating</div>
                </div>
              </div>

              <!-- Tamper Demonstration Simulator -->
              <div class="mt-5 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span>Interactive Tamper Demo</span>
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">Test Chain Integrity</span>
                </div>
                <p class="text-[11px] text-slate-400">
                  Simulate an adversary attempting to alter evidence records to see DEIS's instant cryptographic detection in action.
                </p>
                <div class="pt-1 flex items-center gap-2">
                  <button onclick="window.DEISApp.simulateTamperDemo()" class="w-full py-1.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 font-semibold text-xs rounded transition flex items-center justify-center gap-1.5">
                    <i data-lucide="flame" class="w-3.5 h-3.5"></i>
                    <span>Simulate Tamper Attack</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Web Crypto Engine</span>
              <span class="text-emerald-400 font-mono flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> SubtleCrypto Ready
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Custody Ledger Transactions (Latest Chain Blocks) -->
        <div class="cyber-card p-5 rounded-xl space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="layers" class="w-5 h-5 text-cyan-400"></i>
              <h3 class="font-bold text-slate-100 text-sm">Real-time Custody Ledger Stream</h3>
            </div>
            <button onclick="window.DEISApp.navigate('chain')" class="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition">
              <span>Inspect Full Blockchain Ledger</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="space-y-3">
            ${chainBlocks.slice(-3).reverse().map(block => `
              <div class="p-3.5 rounded-lg ${block.tampered ? 'bg-rose-950/40 border-2 border-rose-500/80' : 'bg-slate-900/60 border border-slate-800'} flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold ${block.tampered ? 'text-rose-400' : 'text-cyan-400'} shrink-0 mt-0.5">
                    #${block.blockHeight}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-xs text-slate-200">${block.eventType}</span>
                      <span class="cyber-badge bg-slate-800 text-slate-400 text-[10px] border border-slate-700">${block.agency}</span>
                      <span class="text-[10px] text-slate-500 font-mono">${block.timestamp}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">${block.actionDescription}</p>
                    <div class="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500 flex-wrap">
                      <span>PrevHash: <span class="text-slate-400">${CryptoEngine.shortenHash(block.previousHash, 4)}</span></span>
                      <span>BlockHash: <span class="${block.tampered ? 'text-rose-400 font-bold' : 'text-slate-400'}">${CryptoEngine.shortenHash(block.blockHash, 4)}</span></span>
                      <span>Officer: <span class="text-slate-300 font-sans">${block.officer}</span></span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span class="cyber-badge ${block.tampered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
                    <i data-lucide="${block.tampered ? 'x-circle' : 'check'}" class="w-3 h-3"></i>
                    ${block.tampered ? 'INVALID BLOCK' : 'VERIFIED SEAL'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }
};

function renderStatusBadge(status) {
  switch (status) {
    case 'IN_VAULT':
      return `<span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>In Vault</span>`;
    case 'IN_TRANSIT':
      return `<span class="cyber-badge bg-amber-500/15 text-amber-300 border border-amber-500/30"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>In Transit</span>`;
    case 'UNDER_ANALYSIS':
      return `<span class="cyber-badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Forensics Lab</span>`;
    case 'ADMITTED_IN_COURT':
      return `<span class="cyber-badge bg-purple-500/15 text-purple-300 border border-purple-500/30"><span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Court Admitted</span>`;
    case 'TAMPERED':
      return `<span class="cyber-badge bg-rose-500/20 text-rose-300 border border-rose-500/50"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Tampered</span>`;
    default:
      return `<span class="cyber-badge bg-slate-800 text-slate-300 border border-slate-700">${status}</span>`;
  }
}

window.DashboardView = DashboardView;
window.renderStatusBadge = renderStatusBadge;
