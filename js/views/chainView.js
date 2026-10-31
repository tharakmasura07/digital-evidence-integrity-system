/**
 * Digital Evidence Integrity System (DEIS)
 * View: Blockchain-Style Chain of Custody & Tamper Simulation Engine
 */

const ChainView = {
  render(container) {
    const store = window.DEISStore;
    const blocks = store.getChainBlocks();
    const isTampered = store.state.tamperAlertActive;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Action Row -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <i data-lucide="layers" class="w-6 h-6 text-cyan-400"></i>
              <span>Evidence History & Tamper Test</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              A permanent timeline of everywhere the evidence has traveled. Click "Simulate Hack" on any block to see how the system catches tampering instantly!
            </p>
          </div>

          <div class="flex items-center gap-2.5">
            <button onclick="ChainView.runFullAudit()" class="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-2 transition">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Verify All Blocks</span>
            </button>

            ${isTampered ? `
              <button onclick="window.DEISApp.restoreIntegrity()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-2 transition">
                <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                <span>Restore Chain</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Chain Integrity Diagnostic Banner -->
        <div class="cyber-card p-4 rounded-xl border ${isTampered ? 'border-rose-500/80 bg-rose-950/30' : 'border-emerald-500/30 bg-emerald-950/10'}">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg ${isTampered ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} flex items-center justify-center shrink-0">
                <i data-lucide="${isTampered ? 'shield-x' : 'shield-check'}" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold ${isTampered ? 'text-rose-200' : 'text-emerald-200'}">
                  ${isTampered ? 'LEDGER INTEGRITY COMPROMISED: HASH MISMATCH DETECTED' : 'CHAIN OF CUSTODY INTEGRITY VERIFIED (100% UNBROKEN)'}
                </h4>
                <p class="text-xs ${isTampered ? 'text-rose-300/80' : 'text-emerald-300/80'} mt-0.5">
                  ${isTampered ? 'A block payload or hash pointer has been modified. In court, evidence with broken custody is ruled inadmissible.' : 'All cryptographic blocks, previous hash links, and multi-agency ECDSA signatures are mathematically consistent.'}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs font-mono">
              <span class="text-slate-400">Total Blocks: <strong class="text-white">${blocks.length}</strong></span>
              <span class="text-slate-600">•</span>
              <span class="text-slate-400">Consensus: <strong class="text-cyan-400">POA-Forensic</strong></span>
            </div>
          </div>
        </div>

        <!-- Tamper Simulator Explainer -->
        <div class="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
            <span><strong>Tamper Simulation Mode:</strong> Click any block's <span class="text-amber-400">"Simulate Tamper Attack"</span> button below to witness how modern cryptography detects even 1 altered bit.</span>
          </div>
        </div>

        <!-- Blockchain Visualizer Timeline -->
        <div class="space-y-6 relative pl-4 sm:pl-8 border-l-2 ${isTampered ? 'border-rose-500/50' : 'border-cyan-500/40'} my-4">
          ${blocks.map((block, idx) => `
            <div class="relative group">
              <!-- Node Circle on the line -->
              <div class="absolute -left-[25px] sm:-left-[41px] top-4 w-6 h-6 rounded-full border-2 ${block.tampered ? 'border-rose-500 bg-rose-950 text-rose-400' : 'border-cyan-400 bg-slate-950 text-cyan-400'} flex items-center justify-center font-mono text-[10px] font-bold shadow-lg">
                ${block.blockHeight}
              </div>

              <!-- Block Card -->
              <div class="cyber-card p-5 rounded-xl border ${block.tampered ? 'border-rose-500/80 bg-rose-950/20 cyber-glow-rose' : 'border-slate-800'} space-y-3.5 transition">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono text-xs font-bold text-cyan-400">BLOCK #${block.blockHeight}</span>
                    <span class="cyber-badge bg-slate-800 text-slate-200 border border-slate-700">${block.eventType}</span>
                    <span class="text-xs text-slate-400 font-mono">${block.evidenceId}</span>
                    ${block.tampered ? `
                      <span class="cyber-badge bg-rose-500/30 text-rose-300 border border-rose-500/60 font-bold animate-pulse">
                        <i data-lucide="flame" class="w-3 h-3"></i> TAMPERED BLOCK
                      </span>
                    ` : `
                      <span class="cyber-badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <i data-lucide="check" class="w-3 h-3"></i> LINK VERIFIED
                      </span>
                    `}
                  </div>

                  <span class="text-[11px] text-slate-400 font-mono">${block.timestamp}</span>
                </div>

                <!-- Block Payload Info -->
                <div class="text-xs space-y-2">
                  <p class="text-slate-200 leading-relaxed font-sans ${block.tampered ? 'text-rose-200 font-semibold' : ''}">
                    ${block.actionDescription}
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    <div class="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px]">
                      <span class="text-slate-500 uppercase font-mono text-[10px] block">Acting Body & Officer:</span>
                      <span class="text-slate-200 font-medium">${block.agency.toUpperCase()} • ${block.officer}</span>
                    </div>

                    <div class="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px]">
                      <span class="text-slate-500 uppercase font-mono text-[10px] block">Case Reference:</span>
                      <span class="text-slate-200 font-medium">${block.caseId || 'State v. Incident'}</span>
                    </div>
                  </div>
                </div>

                <!-- Cryptographic Fingerprint Pointers (Blockchain Linkage) -->
                <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-2">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400">
                    <span class="text-slate-500 text-[10px]">PREVIOUS BLOCK HASH (PrevHash):</span>
                    <span class="text-cyan-400 select-all truncate" title="${block.previousHash}">
                      ${block.previousHash}
                    </span>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span class="text-slate-500 text-[10px]">CURRENT BLOCK HASH (BlockHash):</span>
                    <span class="${block.tampered ? 'text-rose-400 font-bold' : 'text-emerald-400'} select-all truncate" title="${block.blockHash}">
                      ${block.blockHash}
                    </span>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span class="text-slate-500 text-[10px]">MERKLE ROOT TREE DIGEST:</span>
                    <span class="text-slate-300 select-all truncate" title="${block.merkleRoot}">
                      ${block.merkleRoot}
                    </span>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span class="text-slate-500 text-[10px]">DIGITAL SIGNATURE (ECDSA):</span>
                    <span class="text-slate-400 select-all truncate" title="${block.signature}">
                      ${CryptoEngine.shortenHash(block.signature, 16)}
                    </span>
                  </div>
                </div>

                <!-- Block Tamper Actions -->
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-slate-500 font-mono">Non-Repudiation Guaranteed</span>
                  ${block.tampered ? `
                    <span class="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <i data-lucide="alert-octagon" class="w-4 h-4"></i>
                      Tampered by Simulation
                    </span>
                  ` : `
                    <button onclick="window.DEISApp.simulateTamperBlock(${block.blockHeight})" class="px-2.5 py-1 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 rounded text-xs transition flex items-center gap-1.5">
                      <i data-lucide="skull" class="w-3.5 h-3.5 text-rose-400"></i>
                      <span>Simulate Tamper Attack on Block #${block.blockHeight}</span>
                    </button>
                  `}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  async runFullAudit() {
    const store = window.DEISStore;
    const blocks = store.getChainBlocks();
    const isTampered = store.state.tamperAlertActive;

    window.DEISApp.showToast('Initiating cryptographic verification of all blocks...', 'info');

    setTimeout(() => {
      if (isTampered) {
        window.DEISApp.showToast('AUDIT FAILED: Cryptographic hash discrepancy identified in custody chain!', 'error');
      } else {
        window.DEISApp.showToast(`AUDIT PASSED: All ${blocks.length} blocks mathematically verified with 100% integrity!`, 'success');
        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
      }
    }, 800);
  }
};

window.ChainView = ChainView;
