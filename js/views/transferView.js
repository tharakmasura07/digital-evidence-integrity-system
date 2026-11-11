/**
 * Digital Evidence Integrity System (DEIS)
 * View: Dual-Party Transfer Protocol & Secure Handoff Portal
 */

const TransferView = {
  activeTab: 'incoming', // incoming, outgoing, history

  render(container) {
    const store = window.DEISStore;
    const currentAgency = store.getCurrentAgency();
    const incoming = store.getIncomingTransfersForCurrentAgency();
    const outgoing = store.getOutgoingTransfersForCurrentAgency();
    const allTransfers = store.getTransfers();

    const pendingIncoming = incoming.filter(t => t.status === 'PENDING_ACCEPTANCE');

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <i data-lucide="arrow-left-right" class="w-6 h-6 text-cyan-400"></i>
              <span>Transfer Evidence Between Departments</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Safely transfer evidence between Police, Forensic Labs, Lawyers, and Court using a secure 6-digit PIN.
            </p>
          </div>

          <button onclick="window.DEISApp.openInitiateTransferModal()" class="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>+ Send Evidence</span>
          </button>
        </div>

        <!-- Protocol Flow Explainer Card -->
        <div class="cyber-card p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i>
            <span>How Safe Evidence Handover Works:</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] text-slate-400">
            <div class="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span class="font-bold text-cyan-400">1. Select File:</span> Choose which evidence to send.
            </div>
            <div class="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span class="font-bold text-cyan-400">2. Destination:</span> Select receiving body (Lab, Court, etc.).
            </div>
            <div class="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span class="font-bold text-cyan-400">3. Sender Signs:</span> Sender authorizes the transfer.
            </div>
            <div class="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span class="font-bold text-amber-400">4. 6-Digit PIN:</span> A secret security PIN is generated.
            </div>
            <div class="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span class="font-bold text-emerald-400">5. Recipient Accepts:</span> Receiver enters PIN to claim custody.
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-3 border-b border-slate-800 pb-2">
          <button 
            onclick="TransferView.switchTab('incoming')" 
            class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${this.activeTab === 'incoming' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}"
          >
            <i data-lucide="inbox" class="w-4 h-4"></i>
            <span>Incoming for ${currentAgency.badge}</span>
            ${pendingIncoming.length > 0 ? `
              <span class="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-pulse">
                ${pendingIncoming.length}
              </span>
            ` : ''}
          </button>

          <button 
            onclick="TransferView.switchTab('outgoing')" 
            class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${this.activeTab === 'outgoing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}"
          >
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>Dispatched Outbox (${outgoing.length})</span>
          </button>

          <button 
            onclick="TransferView.switchTab('history')" 
            class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${this.activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}"
          >
            <i data-lucide="clock" class="w-4 h-4"></i>
            <span>All System Transfers (${allTransfers.length})</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div id="transfer-tab-content">
          ${this.renderTabContent(currentAgency, incoming, outgoing, allTransfers)}
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render(document.getElementById('view-container'));
  },

  renderTabContent(currentAgency, incoming, outgoing, allTransfers) {
    if (this.activeTab === 'incoming') {
      if (incoming.length === 0) {
        return `
          <div class="cyber-card p-12 text-center rounded-xl space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
              <i data-lucide="inbox" class="w-6 h-6"></i>
            </div>
            <h3 class="text-slate-300 font-bold text-sm">No Incoming Transfers for ${currentAgency.badge}</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              When other agencies dispatch evidence items to your department, they will appear here with cryptographic verification tokens.
            </p>
          </div>
        `;
      }

      return `
        <div class="space-y-4">
          ${incoming.map(t => this.renderTransferCard(t, 'incoming')).join('')}
        </div>
      `;
    }

    if (this.activeTab === 'outgoing') {
      if (outgoing.length === 0) {
        return `
          <div class="cyber-card p-12 text-center rounded-xl space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
              <i data-lucide="send" class="w-6 h-6"></i>
            </div>
            <h3 class="text-slate-300 font-bold text-sm">No Outgoing Transfers Dispatched</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Use the "Initiate New Transfer Dispatch" button to transfer an evidence artifact from your vault to another body.
            </p>
          </div>
        `;
      }

      return `
        <div class="space-y-4">
          ${outgoing.map(t => this.renderTransferCard(t, 'outgoing')).join('')}
        </div>
      `;
    }

    // All Transfers History
    return `
      <div class="space-y-4">
        ${allTransfers.map(t => this.renderTransferCard(t, 'history')).join('')}
      </div>
    `;
  },

  renderTransferCard(t, mode) {
    const store = window.DEISStore;
    const fromAg = store.state.agencies[t.fromAgency];
    const toAg = store.state.agencies[t.toAgency];
    const isPending = t.status === 'PENDING_ACCEPTANCE';
    const canAccept = mode === 'incoming' && isPending;

    return `
      <div class="cyber-card p-5 rounded-xl border ${isPending ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'} space-y-4">
        <!-- Top Status & IDs -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg ${isPending ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'} flex items-center justify-center shrink-0">
              <i data-lucide="${isPending ? 'arrow-left-right' : 'check-circle-2'}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-cyan-400">${t.transferId}</span>
                <span class="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                <span class="font-mono text-xs text-slate-400">${t.evidenceId}</span>
              </div>
              <h4 class="text-sm font-bold text-white mt-0.5">${t.evidenceTitle}</h4>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            ${isPending ? `
              <span class="cyber-badge bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                AWAITING DUAL-ACCEPTANCE
              </span>
            ` : `
              <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <i data-lucide="check" class="w-3 h-3"></i>
                TRANSFERRED & VERIFIED
              </span>
            `}
          </div>
        </div>

        <!-- Transfer Parties Flow -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono">Originating Body (Sender):</span>
            <div class="font-bold text-slate-200 mt-0.5">${fromAg ? fromAg.name : t.fromAgency}</div>
            <div class="text-[11px] text-slate-400 mt-0.5">Officer: ${t.initiatorOfficer}</div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5">Dispatched: ${t.dispatchTime}</div>
          </div>

          <div class="flex flex-col items-center justify-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-slate-800 text-center">
            <span class="text-[10px] text-slate-400 uppercase font-mono mb-1">Transit Channel</span>
            <span class="cyber-badge bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] text-center max-w-[200px] truncate">
              ${t.transferMode}
            </span>
            <div class="mt-1.5 text-[10px] text-slate-500 font-mono">
              Manifest: ${CryptoEngine.shortenHash(t.transferManifestHash, 6)}
            </div>
          </div>

          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono">Designated Recipient Body:</span>
            <div class="font-bold text-slate-200 mt-0.5">${toAg ? toAg.name : t.toAgency}</div>
            <div class="text-[11px] text-slate-400 mt-0.5">Designated: ${t.recipientOfficer || 'Authorized Agent'}</div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5">
              ${t.acceptedTime ? `Accepted: ${t.acceptedTime}` : 'Status: Pending Verification'}
            </div>
          </div>
        </div>

        <!-- Purpose & Manifest Details -->
        <div class="text-xs space-y-1">
          <span class="text-slate-500 text-[11px] uppercase font-mono">Transfer Mandate & Purpose:</span>
          <p class="text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            ${t.purpose}
          </p>
        </div>

        <!-- Cryptographic Handoff Token & Acceptance Desk -->
        <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80">
          <div class="flex items-center gap-2">
            <div class="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-2">
              <i data-lucide="key" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>Handoff Token (PIN):</span>
              <strong class="text-cyan-400 tracking-wider text-sm select-all">${t.handoffToken}</strong>
            </div>

            <button onclick="window.DEISApp.showTransferToken('${t.transferId}')" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1.5 transition cursor-pointer" title="View Handoff Token Details">
              <i data-lucide="eye" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>View PIN</span>
            </button>
          </div>

          <div class="flex items-center gap-2 justify-end">
            ${canAccept ? `
              <button onclick="window.DEISApp.openAcceptTransferModal('${t.transferId}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition animate-pulse">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
                <span>Verify & Accept Handoff</span>
              </button>
            ` : `
              <button onclick="window.DEISApp.printTransferReceipt('${t.transferId}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                <span>Transfer Receipt</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }
};

window.TransferView = TransferView;
