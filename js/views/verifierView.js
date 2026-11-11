/**
 * Digital Evidence Integrity System (DEIS)
 * View: File Authenticity & Forensic Integrity Verifier
 * 
 * Target Evidence Verification:
 * Select any registered case evidence to compare a working file against 
 * the indexed database record and the immutable blockchain ledger anchor.
 * FIPS 180-4 / FRE 902(14) compliant.
 */

const VerifierView = {
  selectedEvidenceId: null,
  targetComparisonResult: null,

  render(container) {
    if (!container) return;

    const store = window.DEISStore;
    const evidenceList = (store && typeof store.getEvidenceList === 'function') ? store.getEvidenceList() : [];
    const cases = (store && typeof store.getCases === 'function') ? store.getCases() : [];

    // Default to first evidence if none selected
    if (!this.selectedEvidenceId && evidenceList.length > 0) {
      this.selectedEvidenceId = evidenceList[0].id;
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Title & Overview -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <i data-lucide="shield-check" class="w-6 h-6 text-cyan-400"></i>
                <span>File Authenticity & Integrity Verifier</span>
              </h2>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">
                FIPS 180-4 / FRE 902(14)
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Select a target evidence artifact from the case dossier, then test a candidate file to perform a bit-for-bit cryptographic verification against the Database Record and Blockchain Ledger.
            </p>
          </div>

          <!-- Quick Open Storage Folder shortcut -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-slate-400 hidden md:inline">Evidence Vault Folder:</span>
            <span class="text-[10px] font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-700 text-cyan-300 select-all">
              evidence_vault/
            </span>
          </div>
        </div>

        <!-- Target Case Evidence Verification (Single Focused Feature) -->
        <div class="cyber-card p-6 rounded-xl border border-slate-800 space-y-5">
          <div class="border-b border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i data-lucide="git-compare" class="w-4 h-4 text-cyan-400"></i>
              <span>Target Case Evidence Verification</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Choose the registered evidence exhibit to audit, then drop or browse your local file to verify cryptographic bitstream authenticity.
            </p>
          </div>

          <!-- Step 1 & Step 2 Controls -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <!-- Step 1: Select Target Evidence -->
            <div class="md:col-span-6 space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label class="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span class="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono flex items-center justify-center">1</span>
                <span>Select Target Vault Evidence:</span>
              </label>

              <select 
                id="target-evidence-select" 
                onchange="VerifierView.handleTargetSelected(this.value)"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
              >
                ${evidenceList.length === 0 ? '<option value="">No evidence artifacts found in vault</option>' : ''}
                ${evidenceList.map(ev => `
                  <option value="${ev.id}" ${this.selectedEvidenceId === ev.id ? 'selected' : ''}>
                    [${ev.id}] ${ev.title} (${ev.caseNumber || 'Case File'})
                  </option>
                `).join('')}
              </select>

              <div class="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                <span>Total registered artifacts: ${evidenceList.length}</span>
                <button 
                  onclick="VerifierView.testSampleFile('${this.selectedEvidenceId}', false)"
                  class="text-cyan-400 hover:underline cursor-pointer font-semibold"
                  title="Simulate verifying genuine file"
                >
                  ⚡ Test with Genuine Bitstream
                </button>
              </div>
            </div>

            <!-- Step 2: Drop / Browse File -->
            <div class="md:col-span-6 space-y-2 p-4 rounded-xl bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 transition text-center flex flex-col justify-center" id="target-dropzone">
              <input type="file" id="target-file-input" class="hidden" onchange="VerifierView.handleTargetFileSelected(event)" />
              
              <div class="flex items-center justify-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                </div>
                <div class="text-left">
                  <div class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span class="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono flex items-center justify-center">2</span>
                    <span>Drop Candidate File to Compare</span>
                  </div>
                  <p class="text-[11px] text-slate-400">Drag & drop here or browse from local filesystem</p>
                </div>
              </div>

              <div class="pt-2 flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onclick="document.getElementById('target-file-input').click()"
                  class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <i data-lucide="folder-open" class="w-3.5 h-3.5"></i>
                  <span>Browse File</span>
                </button>

                <button 
                  type="button"
                  onclick="VerifierView.testSampleFile('${this.selectedEvidenceId}', true)"
                  class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-medium transition cursor-pointer"
                  title="Simulate verifying modified/tampered file"
                >
                  ⚠️ Test Tampered
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Side-by-Side Target Results Display -->
        <div id="target-results-container">
          ${this.renderTargetComparison()}
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
    this.setupDragAndDrop();
  },

  selectTargetEvidence(evidenceId) {
    this.selectedEvidenceId = evidenceId;
    this.targetComparisonResult = null;
    this.render(document.getElementById('view-container'));
  },

  setupDragAndDrop() {
    const dropzone = document.getElementById('target-dropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('border-cyan-400', 'bg-cyan-950/30');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-cyan-400', 'bg-cyan-950/30');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.processFile(files[0]);
      }
    });
  },

  handleTargetSelected(evidenceId) {
    this.selectedEvidenceId = evidenceId;
    this.targetComparisonResult = null;
    const container = document.getElementById('target-results-container');
    if (container) {
      container.innerHTML = this.renderTargetComparison();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  handleTargetFileSelected(e) {
    if (e.target.files && e.target.files[0]) {
      this.processFile(e.target.files[0]);
    }
  },

  async processFile(file) {
    if (!file) return;
    window.DEISApp.showToast(`Calculating SHA-256 for "${file.name}"...`, 'info');

    const liveSha256 = await CryptoEngine.sha256(file);
    const liveSha512 = await CryptoEngine.sha512(file);

    this.targetComparisonResult = {
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB (' + file.size.toLocaleString() + ' bytes)',
      liveSha256,
      liveSha512
    };

    const targetEv = window.DEISStore.getEvidenceById(this.selectedEvidenceId);
    if (targetEv && targetEv.sha256.toLowerCase() === liveSha256.toLowerCase()) {
      window.DEISApp.showToast(`100% BIT-FOR-BIT MATCH: Candidate file is authentic!`, 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      }
    } else {
      window.DEISApp.showToast(`INTEGRITY ALERT: Computed hash does not match sealed record!`, 'error');
    }

    const container = document.getElementById('target-results-container');
    if (container) {
      container.innerHTML = this.renderTargetComparison();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  testSampleFile(evidenceId, isTampered = false) {
    const targetEv = window.DEISStore.getEvidenceById(evidenceId || this.selectedEvidenceId);
    if (!targetEv) return;

    this.selectedEvidenceId = targetEv.id;

    if (isTampered) {
      const corruptSha256 = 'deadbeef' + targetEv.sha256.substring(8);
      this.targetComparisonResult = {
        fileName: `${targetEv.fileName || targetEv.id}_tampered_copy.raw`,
        fileSize: targetEv.fileSize || '16.4 GB',
        liveSha256: corruptSha256,
        liveSha512: 'ffff' + (targetEv.sha512 ? targetEv.sha512.substring(4) : '')
      };
      window.DEISApp.showToast('Simulated tampered file loaded: Hash mismatch triggered!', 'error');
    } else {
      this.targetComparisonResult = {
        fileName: targetEv.fileName || `${targetEv.id}_artifact.raw`,
        fileSize: targetEv.fileSize || '16.4 GB',
        liveSha256: targetEv.sha256,
        liveSha512: targetEv.sha512 || 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      };
      window.DEISApp.showToast(`Genuine bitstream for [${targetEv.id}] verified!`, 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      }
    }

    const select = document.getElementById('target-evidence-select');
    if (select) select.value = targetEv.id;

    const container = document.getElementById('target-results-container');
    if (container) {
      container.innerHTML = this.renderTargetComparison();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  renderTargetComparison() {
    if (!this.selectedEvidenceId) {
      return `
        <div class="cyber-card p-8 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
          <i data-lucide="shield-check" class="w-8 h-8 mx-auto text-slate-600"></i>
          <p class="text-xs text-slate-400">Please select an evidence artifact from Step 1 above to begin verification.</p>
        </div>
      `;
    }

    const targetEv = window.DEISStore.getEvidenceById(this.selectedEvidenceId);
    if (!targetEv) return '';

    const chainBlock = window.DEISStore.getChainBlocks().find(b => b.evidenceId === targetEv.id && (b.eventType === 'GENESIS_SEIZURE' || b.eventType.includes('SEIZURE')));
    const hasLiveFile = !!this.targetComparisonResult;
    const isDbMatch = hasLiveFile && (this.targetComparisonResult.liveSha256.toLowerCase() === targetEv.sha256.toLowerCase());
    const isChainMatch = hasLiveFile && chainBlock && (!chainBlock.tampered && chainBlock.evidenceHash.toLowerCase() === this.targetComparisonResult.liveSha256.toLowerCase());
    const isChainTampered = chainBlock && chainBlock.tampered;
    const isFullMatch = isDbMatch && (chainBlock ? isChainMatch : true);

    return `
      <div class="cyber-card p-6 rounded-xl border ${hasLiveFile ? (isFullMatch ? 'border-emerald-500/80 bg-emerald-950/20 cyber-glow-emerald' : 'border-rose-500/80 bg-rose-950/20') : 'border-slate-800'} space-y-5">
        
        <!-- Status Verdict Banner -->
        ${hasLiveFile ? `
          <div class="p-4 rounded-xl border ${isFullMatch ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200' : 'border-rose-500/40 bg-rose-950/40 text-rose-200'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg ${isFullMatch ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} flex items-center justify-center shrink-0">
                <i data-lucide="${isFullMatch ? 'shield-check' : 'alert-triangle'}" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold">
                  ${isFullMatch ? 'VERIFICATION SUCCESSFUL: DUAL-VERIFIED AGAINST DATABASE & BLOCKCHAIN LEDGER' : (isChainTampered ? 'CRITICAL BLOCKCHAIN SECURITY ALERT: LEDGER TAMPERING DETECTED!' : 'CRITICAL INTEGRITY FAILURE: HASH MISMATCH DETECTED!')}
                </h4>
                <p class="text-xs opacity-90 mt-0.5">
                  ${isFullMatch ? 'The tested local file matches both the indexed database record and the immutable blockchain block payload (100% bit-exact).' : (isChainTampered ? `Warning: Blockchain Block #${chainBlock.blockHeight} has been corrupted or tampered with! Evidence integrity compromised.` : 'The tested file has been modified, tampered with, or corrupted since initial seizure!')}
                </p>
              </div>
            </div>

            ${isFullMatch ? `
              <button onclick="VerifierView.printVerificationReport()" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow flex items-center gap-1.5 transition">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                <span>Print Verification Affidavit</span>
              </button>
            ` : ''}
          </div>
        ` : ''}

        <!-- 3-Way Cryptographic Comparison Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <!-- Record A: Database Vault Record -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <i data-lucide="database" class="w-3.5 h-3.5 text-cyan-400"></i>
                <span>A. DATABASE RECORD</span>
              </span>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono">${targetEv.id}</span>
            </div>

            <div class="space-y-1.5 text-xs font-mono">
              <div>
                <span class="text-slate-500 text-[10px] block">Title & Case:</span>
                <span class="text-white font-sans font-bold truncate block">${targetEv.title}</span>
                <span class="text-slate-400 text-[11px] block">${targetEv.caseNumber}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Database SHA-256 (evidences table):</span>
                <span class="text-cyan-300 text-[11px] break-all select-all block mt-0.5 font-semibold">${targetEv.sha256}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Database Match Status:</span>
                <span class="${hasLiveFile ? (isDbMatch ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') : 'text-slate-500'}">
                  ${hasLiveFile ? (isDbMatch ? '✓ 100% DB MATCH' : '✗ DB HASH MISMATCH') : 'Awaiting Test File'}
                </span>
              </div>
            </div>
          </div>

          <!-- Record B: Blockchain Ledger Block Anchor -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <i data-lucide="blocks" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>B. BLOCKCHAIN LEDGER</span>
              </span>
              <span class="cyber-badge ${chainBlock && !chainBlock.tampered ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'} text-[9px] font-mono">
                ${chainBlock ? `BLOCK #${chainBlock.blockHeight}` : 'UNMINED'}
              </span>
            </div>

            <div class="space-y-1.5 text-xs font-mono">
              <div>
                <span class="text-slate-500 text-[10px] block">Ledger Block Event:</span>
                <span class="text-slate-200 font-bold">${chainBlock ? chainBlock.eventType : 'N/A'}</span>
                <span class="text-slate-400 text-[10px] block">${chainBlock ? chainBlock.timestamp : ''}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Anchored SHA-256 in Block:</span>
                <span class="${chainBlock && chainBlock.tampered ? 'text-rose-400 font-bold' : 'text-emerald-300 font-semibold'} text-[11px] break-all select-all block mt-0.5">
                  ${chainBlock ? chainBlock.evidenceHash : 'N/A'}
                </span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Blockchain Verification:</span>
                <span class="${hasLiveFile ? (isChainMatch ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') : 'text-slate-500'}">
                  ${hasLiveFile ? (isChainMatch ? '✓ ANCHOR VALIDATED' : (isChainTampered ? '✗ BLOCK TAMPERED!' : '✗ CHAIN MISMATCH')) : 'Awaiting Test File'}
                </span>
              </div>
            </div>
          </div>

          <!-- Record C: Live Candidate File -->
          <div class="p-4 rounded-xl bg-slate-900/90 border ${hasLiveFile ? (isFullMatch ? 'border-emerald-500/80' : 'border-rose-500/80') : 'border-slate-700/80'} space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold ${hasLiveFile ? (isFullMatch ? 'text-emerald-300' : 'text-rose-300') : 'text-slate-400'}">
                C. CANDIDATE TEST FILE
              </span>
              <button onclick="document.getElementById('target-file-input').click()" class="text-[10px] text-cyan-400 hover:underline cursor-pointer">
                ${hasLiveFile ? 'Change File' : '+ Pick File'}
              </button>
            </div>

            ${hasLiveFile ? `
              <div class="space-y-1.5 text-xs font-mono">
                <div>
                  <span class="text-slate-500 text-[10px] block">Candidate File Name:</span>
                  <span class="text-white font-sans font-bold truncate block">${this.targetComparisonResult.fileName}</span>
                  <span class="text-slate-400 text-[10px]">${this.targetComparisonResult.fileSize}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] block">Live Computed SHA-256 Hash:</span>
                  <span class="${isFullMatch ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'} text-[11px] break-all select-all block mt-0.5">
                    ${this.targetComparisonResult.liveSha256}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] block">Consensus Verdict:</span>
                  <span class="${isFullMatch ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'} flex items-center gap-1">
                    <i data-lucide="${isFullMatch ? 'check-check' : 'x-circle'}" class="w-3.5 h-3.5"></i>
                    <span>${isFullMatch ? '✓ 100% BIT-FOR-BIT MATCH' : '✗ INTEGRITY FAILED'}</span>
                  </span>
                </div>
              </div>
            ` : `
              <div class="p-6 text-center space-y-2 border border-dashed border-slate-800 rounded-lg">
                <i data-lucide="upload-cloud" class="w-6 h-6 mx-auto text-slate-500"></i>
                <p class="text-xs text-slate-400">Click below or drag file above to test against record <strong>${targetEv.id}</strong>.</p>
                <button onclick="document.getElementById('target-file-input').click()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold cursor-pointer">
                  Select Local File
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  printVerificationReport() {
    const ev = this.selectedEvidenceId ? window.DEISStore.getEvidenceById(this.selectedEvidenceId) : null;
    const fileName = (this.targetComparisonResult && this.targetComparisonResult.fileName) || (ev ? ev.fileName : 'Verified Evidence File');
    const sha256 = (this.targetComparisonResult && this.targetComparisonResult.liveSha256) || (ev ? ev.sha256 : '');
    const user = window.DEISStore.getCurrentUser() || { name: 'System Security Administrator', badgeId: 'ADMIN-0001' };
    const date = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AFFIDAVIT OF CRYPTOGRAPHIC VERIFICATION — DEIS</title>
        <style>
          body { font-family: monospace; padding: 40px; color: #000; line-height: 1.5; font-size: 12px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
          .verdict { border: 2px solid #000; padding: 12px; font-weight: bold; font-size: 14px; text-align: center; margin: 20px 0; }
          .section { margin-bottom: 16px; }
          .label { font-weight: bold; }
          .hash { word-break: break-all; background: #eee; padding: 4px; display: block; margin-top: 4px; }
          .sign { margin-top: 40px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>DIGITAL EVIDENCE INTEGRITY SYSTEM (DEIS)</h2>
          <h3>OFFICIAL AFFIDAVIT OF CRYPTOGRAPHIC HASH VERIFICATION</h3>
          <p>Standard: ISO/IEC 27037:2012 | Federal Rule of Evidence 902(14)</p>
        </div>

        <div class="verdict">
          VERDICT: 100% BIT-FOR-BIT MATCH — INTEGRITY INTACT & UNALTERED
        </div>

        <div class="section">
          <div class="label">1. VERIFIED FILE METADATA:</div>
          <div>File Name: ${fileName}</div>
          <div>Case Association: ${ev ? ev.caseNumber : 'Criminal Investigation'}</div>
          <div>Evidence Record UID: ${ev ? ev.id : 'N/A'}</div>
          <div>Verification Timestamp: ${date}</div>
        </div>

        <div class="section">
          <div class="label">2. CRYPTOGRAPHIC BITSTREAM FINGERPRINT (SHA-256):</div>
          <span class="hash">${sha256}</span>
        </div>

        <div class="section">
          <div class="label">3. FORENSIC CERTIFICATION:</div>
          <p>
            I hereby certify that the digital artifact specified above was subjected to cryptographic bitstream analysis using the FIPS 180-4 SHA-256 algorithm. The computed hash matches the genesis seizure record on the custody ledger with 0 bits deviation. The evidentiary integrity is self-authenticating pursuant to FRE Rule 902(14).
          </p>
        </div>

        <div class="sign">
          <div>
            <p>___________________________________</p>
            <p class="label">Verifying Officer: ${user.name}</p>
            <p>Badge ID: ${user.badgeId}</p>
          </div>
          <div>
            <p>___________________________________</p>
            <p class="label">High Court Custody Registry</p>
            <p>Status: ADMISSIBLE IN COURT</p>
          </div>
        </div>
      </body>
      </html>
    `);

    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 500);
  }
};

window.VerifierView = VerifierView;
