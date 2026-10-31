/**
 * Digital Evidence Integrity System (DEIS)
 * Main Application Controller & Router
 */

class DEISApplication {
  constructor() {
    this.currentRoute = 'dashboard';
    // Support direct route from URL hash if present
    const initialHash = (window.location.hash || '').replace('#', '').trim();
    if (initialHash && ['dashboard', 'evidence', 'transfers', 'chain', 'verifier', 'certificate', 'users'].includes(initialHash)) {
      this.currentRoute = initialHash;
    }
    this.init();
  }

  init() {
    // Subscribe to store updates
    window.DEISStore.subscribe(() => {
      this.checkAuthAndRender();
      this.updateHeaderAndUserProfile();
    });

    // Support browser back/forward and hash clicks
    window.addEventListener('hashchange', () => {
      const hash = (window.location.hash || '').replace('#', '').trim();
      if (hash && ['dashboard', 'evidence', 'transfers', 'chain', 'verifier', 'certificate', 'users'].includes(hash)) {
        if (hash !== this.currentRoute) {
          this.navigate(hash);
        }
      }
    });

    // Setup Navigation Listeners
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      });
    });

    // Initial render
    this.checkAuthAndRender();
    this.updateHeaderAndUserProfile();
    this.setupModals();
  }

  checkAuthAndRender() {
    const store = window.DEISStore;
    const currentUser = store.getCurrentUser();
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('app-header');
    const container = document.getElementById('view-container');

    if (!currentUser) {
      // User is not authenticated -> Strictly hide shell and display Login View
      if (sidebar) {
        sidebar.classList.add('hidden');
        sidebar.style.display = 'none';
      }
      if (header) {
        header.classList.add('hidden');
        header.style.display = 'none';
      }
      if (container) {
        container.classList.remove('p-4', 'sm:p-6', 'lg:p-8');
        container.classList.add('p-0');
        try {
          window.LoginView.render(container);
        } catch (err) {
          console.error('DEIS LoginView Error:', err);
          container.innerHTML = `
            <div style="padding: 2rem; color: #f43f5e; font-family: monospace; background: #070B13; min-height: 100vh;">
              <h3>Authentication Portal Notice</h3>
              <p>${err.message}</p>
              <button onclick="localStorage.clear(); location.reload();" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #06b6d4; color: #000; font-weight: bold; border-radius: 4px;">Reset Storage & Reload</button>
            </div>
          `;
        }
      }
      safeCreateIcons();
      return;
    }

    // User is authenticated -> Show shell
    if (sidebar) {
      sidebar.classList.remove('hidden');
      sidebar.style.display = 'flex';
    }
    if (header) {
      header.classList.remove('hidden');
      header.style.display = 'flex';
    }
    if (container) {
      container.classList.add('p-4', 'sm:p-6', 'lg:p-8');
      container.classList.remove('p-0');
    }

    // Role-based route guard: if on admin route but not admin, switch to dashboard
    if (this.currentRoute === 'users' && !currentUser.isAdmin) {
      this.currentRoute = 'dashboard';
    }

    this.renderCurrentView();
  }

  navigate(route) {
    if (!window.DEISStore.getCurrentUser()) {
      this.checkAuthAndRender();
      return;
    }

    this.currentRoute = route;
    if (window.location.hash !== `#${route}`) {
      history.replaceState(null, '', `#${route}`);
    }

    // Update nav active classes
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('bg-cyan-500/10', 'text-cyan-400', 'border-cyan-500/40');
        link.classList.remove('text-slate-400', 'border-transparent');
      } else {
        link.classList.remove('bg-cyan-500/10', 'text-cyan-400', 'border-cyan-500/40');
        link.classList.add('text-slate-400', 'border-transparent');
      }
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    const container = document.getElementById('view-container');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      switch (this.currentRoute) {
        case 'dashboard':
          window.DashboardView.render(container);
          break;
        case 'evidence':
          window.EvidenceView.render(container);
          break;
        case 'transfers':
          window.TransferView.render(container);
          break;
        case 'chain':
          window.ChainView.render(container);
          break;
        case 'verifier':
          window.VerifierView.render(container);
          break;
        case 'certificate':
          window.CertificateView.render(container);
          break;
        case 'users':
          if (!window.DEISStore.getCurrentUser()?.isAdmin) {
            this.showToast('Access denied: Administrator clearance required.', 'error');
            this.navigate('dashboard');
            return;
          }
          window.UserManagementView.render(container);
          break;
        default:
          window.DashboardView.render(container);
      }
    } catch (err) {
      console.error(`DEIS View Render Error on '${this.currentRoute}':`, err);
      container.innerHTML = `
        <div class="cyber-card p-6 border border-rose-500/50 bg-rose-950/20 text-rose-200 font-mono text-xs space-y-3 max-w-2xl mx-auto mt-8">
          <div class="text-sm font-bold text-rose-400">View Rendering Notice: ${this.currentRoute.toUpperCase()}</div>
          <p>${err.message}</p>
          <pre class="bg-black/60 p-3 rounded border border-slate-800 text-[11px] overflow-x-auto text-slate-400">${err.stack || err.message}</pre>
          <div class="flex items-center gap-3 pt-2">
            <button onclick="window.DEISApp.navigate('dashboard')" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-sans">
              Return to Executive Command
            </button>
            <button onclick="window.DEISStore.resetFactoryData(); location.reload();" class="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded text-xs font-sans">
              Reset Vault Cache & Reload
            </button>
          </div>
        </div>
      `;
    }

    safeCreateIcons();
  }

  updateHeaderAndUserProfile() {
    const store = window.DEISStore;
    const user = store.getCurrentUser();
    const agency = store.getCurrentAgency() || {
      badge: 'ROOT-ADMIN',
      name: 'DEIS Root Access Authority'
    };

    if (!user) return;

    // Update Header Profile Elements
    const avatarEl = document.getElementById('user-avatar-initials');
    const nameEl = document.getElementById('user-profile-name');
    const badgeEl = document.getElementById('user-profile-badge');
    const clearanceEl = document.getElementById('user-clearance-badge');
    const agencyBadgeEl = document.getElementById('active-agency-badge');
    const agencyNameEl = document.getElementById('active-agency-name');

    if (avatarEl) avatarEl.textContent = user.initials || 'AD';
    if (nameEl) nameEl.textContent = user.name;
    if (badgeEl) badgeEl.textContent = `${user.badgeId} • ${agency.badge || 'ROOT-ADMIN'}`;
    if (clearanceEl) clearanceEl.textContent = user.clearanceLevel;
    if (agencyBadgeEl) agencyBadgeEl.textContent = agency.badge || 'ROOT-ADMIN';
    if (agencyNameEl) agencyNameEl.textContent = agency.name || '';

    // Toggle Admin Navigation Links
    const navUsersLink = document.getElementById('nav-users-link');
    if (navUsersLink) {
      if (user.isAdmin) {
        navUsersLink.classList.remove('hidden');
      } else {
        navUsersLink.classList.add('hidden');
      }
    }

    // Dynamic Switch User Dropdown
    const userSelect = document.getElementById('role-switcher-select');
    if (userSelect) {
      const allUsers = store.getUsers();
      userSelect.innerHTML = allUsers.map(u => `
        <option value="${u.id}" ${u.id === user.id ? 'selected' : ''}>
          ${u.isAdmin ? '🛡️' : '👤'} ${u.name} (${u.badgeId})
        </option>
      `).join('');
    }

    // Sidebar User Profile Box
    const sideUserEl = document.getElementById('sidebar-user-name');
    const sideBadgeEl = document.getElementById('sidebar-user-badge');
    if (sideUserEl) sideUserEl.textContent = user.name;
    if (sideBadgeEl) sideBadgeEl.textContent = user.badgeId;

    // Incoming count notification badge on sidebar
    const incomingPending = store.getIncomingTransfersForCurrentAgency().filter(t => t.status === 'PENDING_ACCEPTANCE').length;
    const navBadge = document.getElementById('nav-transfer-badge');
    if (navBadge) {
      if (incomingPending > 0) {
        navBadge.textContent = incomingPending;
        navBadge.classList.remove('hidden');
      } else {
        navBadge.classList.add('hidden');
      }
    }
  }

  handleSuccessfulLogin(user) {
    this.showToast(`Authentication Verified. Welcome, ${user.name}!`, 'success');
    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    // If admin, navigate to users provisioning or dashboard
    this.navigate(user.isAdmin ? 'users' : 'dashboard');
  }

  logout() {
    window.DEISStore.logout();
    this.showToast('Security session terminated. Evidence vault locked.', 'info');
    this.checkAuthAndRender();
  }

  switchRole(userId) {
    const user = window.DEISStore.getUserById(userId);
    if (user) {
      window.DEISStore.setCurrentUser(user);
      this.showToast(`Switched active session to ${user.name} (${user.badgeId})`, 'info');
    }
  }

  // --- Modal Helpers ---
  openModal(modalId, options = {}) {
    if (modalId === 'ingest-modal') {
      this.populateCaseDropdown(options.caseId || options.caseNumber);
    }

    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    safeCreateIcons();
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  openStoreEvidenceModal(caseIdentifier) {
    this.openModal('ingest-modal', { caseId: caseIdentifier });
  }

  populateCaseDropdown(preselectedCaseIdOrNumber) {
    const select = document.getElementById('ingest-case');
    if (!select) return;

    const cases = window.DEISStore.getCases();
    if (!cases || cases.length === 0) {
      select.innerHTML = '<option value="CR-2026-GENERAL">General Criminal Investigation</option>';
      return;
    }

    select.innerHTML = cases.map(c => {
      const isSelected = preselectedCaseIdOrNumber && 
        (c.id === preselectedCaseIdOrNumber || c.caseNumber === preselectedCaseIdOrNumber || String(preselectedCaseIdOrNumber).includes(c.caseNumber));
      return `<option value="${c.caseNumber}" ${isSelected ? 'selected' : ''}>📁 [${c.caseNumber}] ${c.title}</option>`;
    }).join('');
  }

  submitCreateCase(event) {
    event.preventDefault();
    const caseNumber = document.getElementById('case-number-input').value.trim();
    const title = document.getElementById('case-title-input').value.trim();
    const category = document.getElementById('case-category-input').value;
    const leadAgency = document.getElementById('case-agency-input').value;
    const courtJurisdiction = document.getElementById('case-court-input').value.trim();
    const description = document.getElementById('case-description-input').value.trim();

    try {
      const newCase = window.DEISStore.createCase({
        caseNumber,
        title,
        category,
        leadAgency,
        courtJurisdiction,
        description
      });

      this.closeModal('create-case-modal');
      document.getElementById('create-case-form').reset();
      this.showToast(`Case File ${newCase.caseNumber} opened successfully!`, 'success');

      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }

      this.renderCurrentView();
    } catch (err) {
      alert(err.message);
    }
  }

  setupModals() {
    const dropzone = document.getElementById('ingest-file-dropzone');
    const fileInput = document.getElementById('ingest-file-input');

    if (dropzone && fileInput) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.add('border-cyan-400', 'bg-cyan-950/30');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.remove('border-cyan-400', 'bg-cyan-950/30');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleIngestFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleIngestFile(e.target.files[0]);
        }
      });
    }
  }

  async handleIngestFile(file) {
    const hashDisplay = document.getElementById('ingest-calculated-hash');
    const sha512Display = document.getElementById('ingest-calculated-sha512');
    const fileNameEl = document.getElementById('ingest-file-name');
    const titleInput = document.getElementById('ingest-title');
    const sizeDisplay = document.getElementById('ingest-file-size');

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (sizeDisplay) sizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    if (titleInput && !titleInput.value) {
      titleInput.value = file.name.replace(/\.[^/.]+$/, "") + " (Seized Artifact)";
    }

    if (hashDisplay) hashDisplay.textContent = 'Calculating SHA-256 via Web Crypto API...';

    const sha256 = await CryptoEngine.sha256(file);
    const sha512 = await CryptoEngine.sha512(file);

    if (hashDisplay) hashDisplay.textContent = sha256;
    if (sha512Display) sha512Display.textContent = sha512;

    this.pendingIngestFile = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'binary/raw',
      sha256,
      sha512
    };

    this.showToast('Cryptographic hashes calculated successfully!', 'success');
  }

  async submitEvidenceIngestion(event) {
    event.preventDefault();
    const title = document.getElementById('ingest-title').value.trim();
    const caseNumber = document.getElementById('ingest-case').value.trim();
    const category = document.getElementById('ingest-category').value;
    const location = document.getElementById('ingest-location').value.trim() || 'Central Evidence Locker';
    const device = document.getElementById('ingest-device').value.trim() || 'Digital Storage Medium';
    const notes = document.getElementById('ingest-notes').value.trim() || 'Ingested via DEIS Web Console.';

    const sha256 = (this.pendingIngestFile && this.pendingIngestFile.sha256) || 
      await CryptoEngine.sha256(title + Date.now() + Math.random());
    const sha512 = (this.pendingIngestFile && this.pendingIngestFile.sha512) || 
      await CryptoEngine.sha512(sha256 + notes);
    const fileSize = (this.pendingIngestFile && this.pendingIngestFile.size) || '2.4 GB';
    const fileType = (this.pendingIngestFile && this.pendingIngestFile.type) || 'forensic-raw';

    const newEvidence = await window.DEISStore.addEvidence({
      title,
      caseNumber,
      category,
      seizureLocation: location,
      sourceDevice: device,
      notes,
      sha256,
      sha512,
      fileSize,
      fileType,
      tags: ['Manual-Ingest', category]
    });

    this.closeModal('ingest-modal');
    this.pendingIngestFile = null;
    document.getElementById('ingest-form').reset();
    document.getElementById('ingest-calculated-hash').textContent = 'Pending file drop...';
    document.getElementById('ingest-file-name').textContent = 'No file chosen';

    this.showToast(`Evidence artifact ${newEvidence.id} successfully sealed and registered!`, 'success');
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  }

  verifyEvidence(evidenceId) {
    this.navigate('verifier');
    if (window.VerifierView && typeof window.VerifierView.selectTargetEvidence === 'function') {
      window.VerifierView.selectTargetEvidence(evidenceId);
    }
  }

  inspectEvidence(evidenceId) {
    const ev = window.DEISStore.getEvidenceById(evidenceId);
    if (!ev) return;

    const modalBody = document.getElementById('inspect-modal-body');
    modalBody.innerHTML = `
      <div class="space-y-4 text-xs">
        <div class="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span class="font-mono text-cyan-400 font-bold text-sm">${ev.id}</span>
            <h3 class="text-base font-bold text-white mt-0.5">${ev.title}</h3>
            <p class="text-slate-400 text-xs mt-0.5">${ev.caseNumber}</p>
          </div>
          ${window.renderStatusBadge(ev.status)}
        </div>

        <div class="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono block">Current Custodian:</span>
            <span class="font-bold text-slate-200">${ev.currentCustodian}</span>
          </div>
          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono block">Category & Size:</span>
            <span class="font-mono text-slate-200">${ev.category} (${ev.fileSize})</span>
          </div>
          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono block">Source Device:</span>
            <span class="font-mono text-slate-300 truncate">${ev.sourceDevice}</span>
          </div>
          <div>
            <span class="text-slate-500 text-[10px] uppercase font-mono block">Seizure Timestamp:</span>
            <span class="font-mono text-slate-300">${ev.seizureDate}</span>
          </div>
        </div>

        <div class="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
          <div>
            <div class="flex items-center justify-between text-slate-500 text-[10px]">
              <span>SHA-256 DIGITAL INTEGRITY HASH:</span>
              <button onclick="window.DEISApp.copyToClipboard('${ev.sha256}')" class="text-cyan-400 hover:underline">Copy</button>
            </div>
            <div class="text-cyan-300 break-all select-all mt-0.5">${ev.sha256}</div>
          </div>
          <div class="pt-2 border-t border-slate-800">
            <div class="flex items-center justify-between text-slate-500 text-[10px]">
              <span>SHA-512 FORENSIC HASH:</span>
              <button onclick="window.DEISApp.copyToClipboard('${ev.sha512}')" class="text-cyan-400 hover:underline">Copy</button>
            </div>
            <div class="text-slate-400 truncate select-all mt-0.5">${ev.sha512}</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button onclick="window.DEISApp.viewCertificateFor('${ev.id}')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition">
            <i data-lucide="award" class="w-4 h-4 text-cyan-400"></i>
            <span>View Legal Certificate</span>
          </button>

          <button onclick="window.DEISApp.closeModal('inspect-modal'); window.DEISApp.startTransferForEvidence('${ev.id}')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition">
            <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
            <span>Initiate Transfer</span>
          </button>
        </div>
      </div>
    `;

    safeCreateIcons();
    this.openModal('inspect-modal');
  }

  viewCertificateFor(evidenceId) {
    this.closeModal('inspect-modal');
    window.CertificateView.selectedEvidenceId = evidenceId;
    this.navigate('certificate');
  }

  startTransferForEvidence(evidenceId) {
    this.openInitiateTransferModal(evidenceId);
  }

  openInitiateTransferModal(preselectedEvidenceId = null) {
    const store = window.DEISStore;
    const currentAgency = store.getCurrentAgency();
    const currentUser = store.getCurrentUser();
    const evidenceList = store.getEvidenceList();
    const agencies = store.state.agencies;

    const selectEl = document.getElementById('transfer-evidence-select');
    const toAgencySelect = document.getElementById('transfer-to-agency-select');
    const officerInput = document.getElementById('transfer-sender-officer');

    if (officerInput) {
      officerInput.value = currentUser ? currentUser.name : (currentAgency.officers[0] || 'Investigating Officer');
    }

    if (selectEl) {
      selectEl.innerHTML = evidenceList.map(ev => `
        <option value="${ev.id}" ${ev.id === preselectedEvidenceId ? 'selected' : ''}>
          ${ev.id} — ${ev.title} (${ev.currentCustodian})
        </option>
      `).join('');
    }

    if (toAgencySelect) {
      toAgencySelect.innerHTML = Object.values(agencies)
        .filter(a => a.id !== currentAgency.id)
        .map(a => `
          <option value="${a.id}">
            ${a.name} (${a.badge})
          </option>
        `).join('');
    }

    this.openModal('initiate-transfer-modal');
    safeCreateIcons();
  }

  async submitInitiateTransfer(event) {
    event.preventDefault();
    const evidenceId = document.getElementById('transfer-evidence-select').value;
    const toAgency = document.getElementById('transfer-to-agency-select').value;
    const transferMode = document.getElementById('transfer-mode-select').value;
    const initiatorOfficer = document.getElementById('transfer-sender-officer').value.trim();
    const recipientOfficer = document.getElementById('transfer-recipient-officer').value.trim();
    const purpose = document.getElementById('transfer-purpose').value.trim();

    try {
      const transfer = await window.DEISStore.initiateTransfer({
        evidenceId,
        toAgency,
        transferMode,
        initiatorOfficer,
        recipientOfficer,
        purpose
      });

      this.closeModal('initiate-transfer-modal');
      this.showToast(`Transfer dispatched! Issued Handoff PIN: ${transfer.handoffToken}`, 'success');
      this.navigate('transfers');
      this.showTransferQR(transfer.transferId);
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  openAcceptTransferModal(transferId) {
    const store = window.DEISStore;
    const transfer = store.getTransfers().find(t => t.transferId === transferId);
    if (!transfer) return;

    const modalBody = document.getElementById('accept-modal-body');
    const currentUser = store.getCurrentUser();
    const currentAgency = store.getCurrentAgency();

    modalBody.innerHTML = `
      <div class="space-y-4 text-xs">
        <div class="border-b border-slate-800 pb-3">
          <span class="font-mono text-cyan-400 font-bold">${transfer.transferId}</span>
          <h3 class="text-sm font-bold text-white mt-0.5">${transfer.evidenceTitle}</h3>
          <p class="text-slate-400 text-[11px]">From: ${store.state.agencies[transfer.fromAgency].name}</p>
        </div>

        <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
          <div class="text-slate-500 text-[10px] uppercase font-mono">Originating Officer Signature:</div>
          <div class="font-mono text-[10px] text-slate-300 truncate">${transfer.senderSignature}</div>
          <div class="text-slate-500 text-[10px] uppercase font-mono mt-2">Transit Mode:</div>
          <div class="text-cyan-300 font-semibold">${transfer.transferMode}</div>
        </div>

        <form onsubmit="window.DEISApp.submitAcceptTransfer(event, '${transfer.transferId}')" class="space-y-3 pt-2">
          <div>
            <label class="block text-slate-400 text-[11px] mb-1">Receiving Officer Name & Badge:</label>
            <input 
              type="text" 
              id="accept-officer-name" 
              required 
              value="${currentUser ? currentUser.name : (currentAgency.officers[0] || '')}" 
              class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500" 
            />
          </div>

          <div>
            <label class="block text-slate-400 text-[11px] mb-1">
              Enter 6-Digit Time-based Handoff PIN:
              <span class="text-amber-400 font-mono">(Hint: sender token is ${transfer.handoffToken})</span>
            </label>
            <input 
              type="text" 
              id="accept-token-input" 
              required 
              maxlength="6" 
              placeholder="e.g. ${transfer.handoffToken}"
              class="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 font-mono text-center text-lg tracking-widest text-amber-300 focus:outline-none focus:border-amber-400" 
            />
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button type="button" onclick="window.DEISApp.closeModal('accept-modal')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Verify Bitstream & Accept</span>
            </button>
          </div>
        </form>
      </div>
    `;

    safeCreateIcons();
    this.openModal('accept-modal');
  }

  async submitAcceptTransfer(event, transferId) {
    event.preventDefault();
    const token = document.getElementById('accept-token-input').value;
    const officer = document.getElementById('accept-officer-name').value;

    try {
      await window.DEISStore.acceptAndVerifyTransfer(transferId, token, officer);
      this.closeModal('accept-modal');
      this.showToast('Transfer accepted! 100% Bit-for-bit SHA-256 verified and committed to custody ledger.', 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  showTransferQR(transferId) {
    const store = window.DEISStore;
    const transfer = store.getTransfers().find(t => t.transferId === transferId);
    if (!transfer) return;

    const qrBody = document.getElementById('qr-modal-body');
    qrBody.innerHTML = `
      <div class="flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <div id="transfer-qr-canvas" class="p-2 bg-white rounded-lg shadow-xl"></div>
        
        <div>
          <span class="font-mono text-cyan-400 font-bold text-xs">${transfer.transferId}</span>
          <div class="text-sm font-bold text-white mt-0.5">${transfer.evidenceTitle}</div>
          <div class="text-xs text-slate-400 mt-1">Dual-Party Ephemeral Handoff Code:</div>
          <div class="text-2xl font-bold font-mono tracking-widest text-amber-400 mt-1">${transfer.handoffToken}</div>
        </div>

        <p class="text-[11px] text-slate-500 max-w-xs font-mono">
          Show this QR code or 6-digit PIN to the receiving officer upon physical or electronic package delivery.
        </p>
      </div>
    `;

    if (window.QRCode) {
      const payload = JSON.stringify({
        transferId: transfer.transferId,
        evidenceId: transfer.evidenceId,
        handoffToken: transfer.handoffToken,
        manifestHash: transfer.transferManifestHash
      });
      QRCode.toCanvas(payload, { width: 160, margin: 1 }, (err, canvas) => {
        if (!err && canvas) {
          const container = document.getElementById('transfer-qr-canvas');
          if (container) {
            container.innerHTML = '';
            container.appendChild(canvas);
          }
        }
      });
    }

    this.openModal('qr-modal');
  }

  printTransferReceipt(transferId) {
    const store = window.DEISStore;
    const transfer = store.getTransfers().find(t => t.transferId === transferId);
    if (transfer) {
      window.CertificateView.selectedEvidenceId = transfer.evidenceId;
      this.navigate('certificate');
    }
  }

  simulateTamperDemo() {
    window.DEISStore.simulateTampering(1, 'SIMULATED ATTACK: Malicious adversary modified memory extraction dump payload.');
    this.showToast('Tamper simulation initiated! Integrity mismatch alert triggered.', 'error');
    this.navigate('chain');
  }

  simulateTamperBlock(blockHeight) {
    window.DEISStore.simulateTampering(blockHeight, `MALICIOUS ATTACK: Block #${blockHeight} payload altered by unauthorized intruder.`);
    this.showToast(`Block #${blockHeight} compromised! Chain broken.`, 'error');
    this.renderCurrentView();
  }

  restoreIntegrity() {
    window.DEISStore.restoreIntegrity();
    this.showToast('Cryptographic chain of custody successfully restored to 100% valid state.', 'success');
    this.renderCurrentView();
    if (window.confetti) {
      window.confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colorClasses = {
      success: 'bg-emerald-950/90 border-emerald-500 text-emerald-200',
      error: 'bg-rose-950/90 border-rose-500 text-rose-200',
      info: 'bg-slate-900/90 border-cyan-500 text-cyan-200',
      warning: 'bg-amber-950/90 border-amber-500 text-amber-200'
    }[type] || 'bg-slate-900 border-slate-700 text-white';

    const icon = {
      success: 'check-circle-2',
      error: 'alert-triangle',
      info: 'info',
      warning: 'alert-circle'
    }[type] || 'info';

    toast.className = `p-3 rounded-lg border shadow-xl flex items-center gap-2.5 text-xs font-medium transition duration-300 transform translate-y-2 opacity-0 ${colorClasses}`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);
    safeCreateIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  copyToClipboard(text, customMessage = 'Copied to clipboard') {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(customMessage, 'info');
    });
  }
}

function safeCreateIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (e) {
      console.warn('DEIS: Lucide icon render warning', e);
    }
  }
}

function bootDEIS() {
  if (!window.DEISApp) {
    try {
      window.DEISApp = new DEISApplication();
    } catch (err) {
      console.error('Fatal initialization error in DEISApplication:', err);
      const container = document.getElementById('view-container');
      if (container) {
        container.innerHTML = `
          <div style="padding: 2.5rem; color: #f43f5e; font-family: monospace; background: #070B13; min-height: 100vh;">
            <h2 style="font-size: 1.25rem; font-weight: bold;">DEIS Console Initialization Notice</h2>
            <p style="color: #cbd5e1; margin-top: 0.5rem;">An error occurred while mounting the user interface:</p>
            <pre style="background: #0f172a; padding: 1rem; border: 1px solid #334155; border-radius: 0.5rem; margin-top: 1rem; overflow-x: auto;">${err.stack || err.message}</pre>
            <button onclick="localStorage.clear(); location.reload();" style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: #06b6d4; color: #000; font-weight: bold; border-radius: 0.375rem; border: none; cursor: pointer;">
              Reset Local Storage & Reload
            </button>
          </div>
        `;
      }
    }
  }
}

// Instant Zero-Latency Synchronous Boot
bootDEIS();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootDEIS);
}
