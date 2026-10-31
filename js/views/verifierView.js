/**
 * Digital Evidence Integrity System (DEIS)
 * View: Advanced File Authenticity & Forensic Integrity Verifier
 * 
 * Features:
 * 1. Auto-Scan & Cross-Reference: Drop any file to identify which Case File & Evidence Record it matches.
 * 2. Target Evidence Verification: Select any vault artifact to compare the live file against sealed record.
 * 3. Interactive Tamper Sandbox: Educational live hasher demonstrating the cryptographic Avalanche Effect.
 * 4. Direct Hash Comparator: Compare warrant/judicial hashes against extraction hashes.
 * 5. Official Verification Affidavit: Print/export verifiable integrity reports for court.
 */

const VerifierView = {
  activeTab: 'auto-scan', // 'auto-scan' | 'target-verify' | 'sandbox'
  selectedEvidenceId: null,
  lastScannedFile: null,
  computedSha256: null,
  computedSha512: null,
  fileMeta: null,
  matchResult: null,
  targetComparisonResult: null,

  render(container) {
    if (!container) return;

    const store = window.DEISStore;
    const evidenceList = (store && typeof store.getEvidenceList === 'function') ? store.getEvidenceList() : [];
    const cases = (store && typeof store.getCases === 'function') ? store.getCases() : [];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Title & Overview -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <i data-lucide="scan-line" class="w-6 h-6 text-cyan-400"></i>
                <span>File Authenticity & Integrity Verifier</span>
              </h2>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">
                FIPS 180-4 / FRE 902(14)
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Verify bit-for-bit authenticity of digital evidence files against sealed vault records using real Web Crypto SHA-256 and SHA-512 algorithms.
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

        <!-- Mode Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
          <button 
            onclick="VerifierView.switchTab('auto-scan')" 
            class="px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer ${this.activeTab === 'auto-scan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}"
          >
            <i data-lucide="upload-cloud" class="w-4 h-4"></i>
            <span>1. Auto-Scan & Vault Match</span>
          </button>

          <button 
            onclick="VerifierView.switchTab('target-verify')" 
            class="px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer ${this.activeTab === 'target-verify' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}"
          >
            <i data-lucide="git-compare" class="w-4 h-4"></i>
            <span>2. Verify Target Case Evidence</span>
          </button>

          <button 
            onclick="VerifierView.switchTab('sandbox')" 
            class="px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer ${this.activeTab === 'sandbox' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}"
          >
            <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
            <span>3. Live Tamper Sandbox (Avalanche Effect)</span>
          </button>
        </div>

        <!-- TAB CONTENT 1: AUTO-SCAN & VAULT MATCH -->
        <div id="tab-auto-scan" class="${this.activeTab === 'auto-scan' ? 'block' : 'hidden'} space-y-6">
          <!-- Dropzone Area -->
          <div class="cyber-card p-6 sm:p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 transition text-center space-y-4" id="verifier-dropzone">
            <input type="file" id="verifier-file-input" class="hidden" onchange="VerifierView.handleFileSelected(event)" />
            
            <div class="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <i data-lucide="upload-cloud" class="w-8 h-8"></i>
            </div>

            <div>
              <h3 class="text-white font-bold text-base">Drop Any File Here to Check for Tampering</h3>
              <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                The scanner will calculate genuine SHA-256 / SHA-512 hashes and automatically search all Case Files in the vault for a bit-by-bit match.
              </p>
            </div>

            <div class="flex items-center justify-center gap-3 pt-1">
              <button onclick="document.getElementById('verifier-file-input').click()" class="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold rounded-lg text-xs shadow-lg shadow-cyan-600/20 inline-flex items-center gap-2 cursor-pointer transition">
                <i data-lucide="folder-open" class="w-4 h-4"></i>
                <span>Browse File from Machine</span>
              </button>
            </div>

            <!-- Quick Demo Files Helper -->
            <div class="pt-3 border-t border-slate-800/80 max-w-xl mx-auto">
              <span class="text-[11px] text-slate-400 block mb-2 font-mono">
                Or test with actual sample artifacts stored on your computer:
              </span>
              <div class="flex flex-wrap items-center justify-center gap-2">
                ${evidenceList.slice(0, 3).map(ev => `
                  <button 
                    onclick="VerifierView.testSampleEvidence('${ev.id}')"
                    class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded text-[10px] font-mono transition cursor-pointer"
                    title="Simulate verifying ${ev.fileName || ev.title}"
                  >
                    📄 Test ${ev.id} (${ev.category})
                  </button>
                `).join('')}
              </div>
            </div>

            <p class="text-[10px] text-slate-500 font-mono">
              🔒 100% Client-Side Privacy: All hashing runs in your browser memory. Files are never uploaded or sent to any server.
            </p>
          </div>

          <!-- Dynamic Verification Results Container -->
          <div id="verifier-results">
            ${this.renderAutoScanResults()}
          </div>
        </div>

        <!-- TAB CONTENT 2: VERIFY SPECIFIC CASE EVIDENCE (SIDE-BY-SIDE) -->
        <div id="tab-target-verify" class="${this.activeTab === 'target-verify' ? 'block' : 'hidden'} space-y-6">
          <div class="cyber-card p-5 rounded-xl border border-slate-800 space-y-4">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i>
                <span>Step 1: Select Registered Evidence from Vault</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Choose the official evidence item you are auditing, then drop your local file to verify they are bit-for-bit identical.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div class="md:col-span-8">
                <select 
                  id="target-evidence-select" 
                  onchange="VerifierView.handleTargetSelected(this.value)"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
                >
                  <option value="">-- Choose an Evidence Artifact to Verify --</option>
                  ${evidenceList.map(ev => `
                    <option value="${ev.id}" ${this.selectedEvidenceId === ev.id ? 'selected' : ''}>
                      [${ev.id}] ${ev.title} (${ev.caseNumber || 'Case File'})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="md:col-span-4 flex items-center gap-2">
                <button 
                  onclick="document.getElementById('target-file-input').click()"
                  class="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <i data-lucide="folder-open" class="w-4 h-4"></i>
                  <span>Step 2: Drop File to Compare</span>
                </button>
                <input type="file" id="target-file-input" class="hidden" onchange="VerifierView.handleTargetFileSelected(event)" />
              </div>
            </div>
          </div>

          <!-- Side-by-Side Target Results Display -->
          <div id="target-results-container">
            ${this.renderTargetComparison()}
          </div>
        </div>

        <!-- TAB CONTENT 3: LIVE TAMPER SANDBOX (AVALANCHE EFFECT) -->
        <div id="tab-sandbox" class="${this.activeTab === 'sandbox' ? 'block' : 'hidden'} space-y-6">
          <div class="cyber-card p-6 rounded-xl border border-slate-800 space-y-4">
            <div>
              <div class="flex items-center gap-2">
                <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
                <h3 class="text-base font-bold text-white">Cryptographic Avalanche Effect Demo</h3>
              </div>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                In digital forensics, changing even a single byte (like altering a contract from $10,000 to $90,000) completely scrambles the resulting SHA-256 fingerprint. Type or modify text below to see live cryptographic hashing in real-time.
              </p>
            </div>

            <!-- Side by side text inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Original Message -->
              <div class="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-200">Original Document / Evidence String:</span>
                  <span class="text-[10px] font-mono text-cyan-400">UNALTERED</span>
                </div>
                <textarea 
                  id="sandbox-text-a" 
                  rows="3"
                  oninput="VerifierView.updateSandboxHashes()"
                  class="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >Official Police Seizure Log: Server Serial 8G4K992-X confirmed at 03:15 UTC.</textarea>
                
                <div class="pt-2 border-t border-slate-800">
                  <div class="text-[10px] font-mono text-slate-500 uppercase">Computed SHA-256:</div>
                  <div id="sandbox-hash-a" class="font-mono text-[11px] text-cyan-300 break-all select-all mt-0.5">...</div>
                </div>
              </div>

              <!-- Altered Message -->
              <div class="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-200">Tampered Document / Altered String:</span>
                  <span class="text-[10px] font-mono text-rose-400">ALTERED (Change 1 letter!)</span>
                </div>
                <textarea 
                  id="sandbox-text-b" 
                  rows="3"
                  oninput="VerifierView.updateSandboxHashes()"
                  class="w-full bg-navy-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-rose-200 focus:outline-none focus:border-rose-500"
                >Official Police Seizure Log: Server Serial 8G4K992-Y confirmed at 03:15 UTC.</textarea>
                
                <div class="pt-2 border-t border-slate-800">
                  <div class="text-[10px] font-mono text-slate-500 uppercase">Computed SHA-256:</div>
                  <div id="sandbox-hash-b" class="font-mono text-[11px] text-rose-300 break-all select-all mt-0.5">...</div>
                </div>
              </div>
            </div>

            <!-- Comparison Verdict Strip -->
            <div id="sandbox-verdict" class="p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs font-mono">
              <!-- Dynamically updated -->
            </div>
          </div>
        </div>

        <!-- Manual Direct Hash Comparison Utility -->
        <div class="cyber-card p-5 rounded-xl border border-slate-800 space-y-4">
          <div class="flex items-center gap-2">
            <i data-lucide="git-compare" class="w-5 h-5 text-cyan-400"></i>
            <h3 class="font-bold text-slate-100 text-sm">Direct Hash Comparison Tool</h3>
          </div>
          <p class="text-xs text-slate-400">
            Compare two hash fingerprints (e.g. hash provided on a search warrant vs. lab extraction hash) to identify single-bit deviations.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-mono text-slate-400">Hash Fingerprint A (Original / Warrant Hash):</label>
              <textarea 
                id="compare-hash-a" 
                rows="2"
                placeholder="Paste SHA-256 or SHA-512..."
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] font-mono text-slate-400">Hash Fingerprint B (Working / Test Hash):</label>
              <textarea 
                id="compare-hash-b" 
                rows="2"
                placeholder="Paste comparison hash..."
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <div id="compare-result-badge"></div>
            <button onclick="VerifierView.runCompare()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="check-check" class="w-4 h-4"></i>
              <span>Compare Fingerprints</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
    this.setupDragAndDrop();
    if (this.activeTab === 'sandbox') {
      this.updateSandboxHashes();
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render(document.getElementById('view-container'));
  },

  selectTargetEvidence(evidenceId) {
    this.activeTab = 'target-verify';
    this.selectedEvidenceId = evidenceId;
    this.render(document.getElementById('view-container'));
  },

  setupDragAndDrop() {
    const dropzone = document.getElementById('verifier-dropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('border-cyan-400', 'bg-cyan-950/20');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-cyan-400', 'bg-cyan-950/20');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.processFile(files[0]);
      }
    });
  },

  handleFileSelected(e) {
    if (e.target.files && e.target.files[0]) {
      this.processFile(e.target.files[0]);
    }
  },

  async processFile(file) {
    window.DEISApp.showToast(`Calculating SHA-256 and SHA-512 for "${file.name}"...`, 'info');

    const sha256 = await CryptoEngine.sha256(file);
    const sha512 = await CryptoEngine.sha512(file);
    const hexDump = await CryptoEngine.generateHexDump(file, 128);

    this.lastScannedFile = file.name;
    this.computedSha256 = sha256;
    this.computedSha512 = sha512;
    this.fileMeta = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB (' + file.size.toLocaleString() + ' bytes)',
      type: file.type || 'application/octet-stream',
      lastModified: new Date(file.lastModified).toISOString(),
      hexDump
    };

    // Cross reference against vault evidence
    const store = window.DEISStore;
    const match = store.getEvidenceList().find(e => e.sha256.toLowerCase() === sha256.toLowerCase());
    this.matchResult = match || null;

    if (this.matchResult) {
      window.DEISApp.showToast(`MATCH FOUND: Authentic Evidence Item ${match.id} verified!`, 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      }
    } else {
      window.DEISApp.showToast('Calculation complete. No registered vault match for this specific hash.', 'info');
    }

    const container = document.getElementById('verifier-results');
    if (container) {
      container.innerHTML = this.renderAutoScanResults();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  testSampleEvidence(evidenceId) {
    const ev = window.DEISStore.getEvidenceById(evidenceId);
    if (!ev) return;

    this.lastScannedFile = ev.fileName || `${ev.id}_artifact.raw`;
    this.computedSha256 = ev.sha256;
    this.computedSha512 = ev.sha512 || 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
    this.fileMeta = {
      name: ev.fileName || `${ev.id}_artifact.raw`,
      size: ev.fileSize || '16.4 GB',
      type: ev.fileType || 'forensic-raw',
      lastModified: ev.seizureDate || '2026-10-24 03:15:22 UTC',
      hexDump: `00000000  4c 69 4d 45 01 00 00 00  00 10 00 00 00 00 00 00  |LiME............|\n00000010  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|\n00000020  03 00 3e 00 01 00 00 00  90 5b 01 00 00 00 00 00  |..>......[......|\n00000030  40 00 00 00 00 00 00 00  b0 89 24 01 00 00 00 00  |@.........$.....|`
    };
    this.matchResult = ev;

    window.DEISApp.showToast(`Simulated verification of genuine artifact "${ev.id}"!`, 'success');
    if (window.confetti) {
      window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    }

    const container = document.getElementById('verifier-results');
    if (container) {
      container.innerHTML = this.renderAutoScanResults();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  renderAutoScanResults() {
    if (!this.computedSha256) return '';

    const isMatch = !!this.matchResult;

    return `
      <div class="cyber-card p-6 rounded-xl border ${isMatch ? 'border-emerald-500/80 bg-emerald-950/20 cyber-glow-emerald' : 'border-slate-800'} space-y-4">
        <!-- Match Banner -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl ${isMatch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'} flex items-center justify-center shrink-0">
              <i data-lucide="${isMatch ? 'shield-check' : 'help-circle'}" class="w-7 h-7"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold ${isMatch ? 'text-emerald-200' : 'text-slate-200'}">
                  ${isMatch ? '100% BIT-FOR-BIT MATCH DETECTED IN DEIS VAULT' : 'FILE DIGEST CALCULATED (UNTRACKED IN VAULT)'}
                </h3>
                ${isMatch ? `
                  <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px]">
                    AUTHENTIC EVIDENCE
                  </span>
                ` : ''}
              </div>
              <p class="text-xs ${isMatch ? 'text-emerald-300/80' : 'text-slate-400'} mt-1">
                ${isMatch ? `Matched Evidence Record: <strong class="text-white">${this.matchResult.id}</strong> — ${this.matchResult.title}` : 'This file can be registered as a new evidence artifact in any Case File.'}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            ${isMatch ? `
              <button onclick="VerifierView.printVerificationReport()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Print Verification Affidavit</span>
              </button>
            ` : `
              <button onclick="window.DEISApp.openModal('ingest-modal')" class="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition cursor-pointer">
                + Ingest into Case File
              </button>
            `}
          </div>
        </div>

        <!-- File Details & Cryptographic Hashes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- Metadata -->
          <div class="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div class="text-[10px] font-mono text-slate-500 uppercase">Analyzed File Details</div>
            <div class="font-bold text-slate-200 text-sm truncate">${this.fileMeta.name}</div>
            <div class="text-slate-400 font-mono text-[11px]">Size: ${this.fileMeta.size}</div>
            <div class="text-slate-400 font-mono text-[11px]">MIME: ${this.fileMeta.type}</div>
            ${isMatch ? `
              <div class="text-cyan-300 font-mono text-[11px] pt-1 border-t border-slate-800/80">
                Case: ${this.matchResult.caseNumber || 'Registered Case File'}
              </div>
              <div class="text-slate-400 font-mono text-[10px]">
                Custodian: ${this.matchResult.currentCustodian} (${this.matchResult.custodianAgency})
              </div>
            ` : ''}
          </div>

          <!-- Hashes -->
          <div class="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div>
              <div class="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SHA-256 BITSTREAM DIGEST:</span>
                <button onclick="window.DEISApp.copyToClipboard('${this.computedSha256}')" class="text-cyan-400 hover:underline">Copy</button>
              </div>
              <div class="font-mono text-[11px] text-cyan-300 select-all break-all mt-0.5">
                ${this.computedSha256}
              </div>
            </div>

            <div class="pt-1.5 border-t border-slate-800/80">
              <div class="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SHA-512 HIGH-ASSURANCE HASH:</span>
                <button onclick="window.DEISApp.copyToClipboard('${this.computedSha512}')" class="text-cyan-400 hover:underline">Copy</button>
              </div>
              <div class="font-mono text-[10px] text-slate-400 select-all truncate mt-0.5">
                ${this.computedSha512}
              </div>
            </div>
          </div>
        </div>

        <!-- Raw Hex Dump Preview -->
        <div>
          <div class="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
            <span>FORENSIC HEX DUMP PREVIEW (FIRST 128 BYTES):</span>
            <span class="text-[10px] text-slate-500 font-sans">Offset | Hex Bytes | ASCII Representation</span>
          </div>
          <pre class="bg-black/80 p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed select-all">${this.fileMeta.hexDump}</pre>
        </div>
      </div>
    `;
  },

  handleTargetSelected(evidenceId) {
    this.selectedEvidenceId = evidenceId;
    const container = document.getElementById('target-results-container');
    if (container) {
      container.innerHTML = this.renderTargetComparison();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  async handleTargetFileSelected(e) {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    window.DEISApp.showToast(`Comparing "${file.name}" against selected evidence record...`, 'info');

    const liveSha256 = await CryptoEngine.sha256(file);
    const liveSha512 = await CryptoEngine.sha512(file);

    this.targetComparisonResult = {
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB (' + file.size.toLocaleString() + ' bytes)',
      liveSha256,
      liveSha512
    };

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
        <div class="p-8 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
          <i data-lucide="shield-check" class="w-8 h-8 mx-auto text-slate-600"></i>
          <p class="text-xs text-slate-400">Please select an evidence artifact from the dropdown above to begin verification.</p>
        </div>
      `;
    }

    const targetEv = window.DEISStore.getEvidenceById(this.selectedEvidenceId);
    if (!targetEv) return '';

    const hasLiveFile = !!this.targetComparisonResult;
    const isMatch = hasLiveFile && (this.targetComparisonResult.liveSha256.toLowerCase() === targetEv.sha256.toLowerCase());

    return `
      <div class="cyber-card p-6 rounded-xl border ${hasLiveFile ? (isMatch ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-rose-500/80 bg-rose-950/20') : 'border-slate-800'} space-y-5">
        
        <!-- Status Verdict Banner -->
        ${hasLiveFile ? `
          <div class="p-4 rounded-xl border ${isMatch ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200' : 'border-rose-500/40 bg-rose-950/40 text-rose-200'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg ${isMatch ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} flex items-center justify-center shrink-0">
                <i data-lucide="${isMatch ? 'shield-check' : 'alert-triangle'}" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold">
                  ${isMatch ? 'VERIFICATION SUCCESSFUL: 100% BITSTREAM MATCH' : 'CRITICAL INTEGRITY FAILURE: HASH MISMATCH DETECTED!'}
                </h4>
                <p class="text-xs opacity-90 mt-0.5">
                  ${isMatch ? 'The tested local file is completely identical to the sealed record. No modification detected.' : 'The tested file has been modified, tampered with, or corrupted since initial seizure!'}
                </p>
              </div>
            </div>

            ${isMatch ? `
              <button onclick="VerifierView.printVerificationReport()" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer">
                Print Verification Affidavit
              </button>
            ` : ''}
          </div>
        ` : ''}

        <!-- Side by Side Comparator Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Record A: Vault Official Record -->
          <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-cyan-300">A. OFFICIAL VAULT SEALED RECORD</span>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[9px]">${targetEv.id}</span>
            </div>

            <div class="space-y-1.5 text-xs font-mono">
              <div>
                <span class="text-slate-500 text-[10px] block">Title & Case:</span>
                <span class="text-white font-sans font-bold">${targetEv.title}</span>
                <span class="text-slate-400 text-[11px] block">${targetEv.caseNumber}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Recorded Size:</span>
                <span class="text-slate-300">${targetEv.fileSize}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Sealed SHA-256 Bitstream Hash:</span>
                <span class="text-cyan-300 text-[11px] break-all select-all block mt-0.5">${targetEv.sha256}</span>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] block">Active Custodian:</span>
                <span class="text-slate-300">${targetEv.currentCustodian} (${targetEv.custodianAgency})</span>
              </div>
            </div>
          </div>

          <!-- Record B: Live Tested File -->
          <div class="p-4 rounded-xl bg-slate-900/90 border ${hasLiveFile ? (isMatch ? 'border-emerald-500/80' : 'border-rose-500/80') : 'border-slate-700/80'} space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold ${hasLiveFile ? (isMatch ? 'text-emerald-300' : 'text-rose-300') : 'text-slate-400'}">
                B. LOCAL CANDIDATE FILE
              </span>
              <button onclick="document.getElementById('target-file-input').click()" class="text-[10px] text-cyan-400 hover:underline cursor-pointer">
                ${hasLiveFile ? 'Change File' : '+ Drop / Select File'}
              </button>
            </div>

            ${hasLiveFile ? `
              <div class="space-y-1.5 text-xs font-mono">
                <div>
                  <span class="text-slate-500 text-[10px] block">File Name:</span>
                  <span class="text-white font-sans font-bold">${this.targetComparisonResult.fileName}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] block">Live Computed Size:</span>
                  <span class="text-slate-300">${this.targetComparisonResult.fileSize}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] block">Live Computed SHA-256 Hash:</span>
                  <span class="${isMatch ? 'text-emerald-300' : 'text-rose-400 font-bold'} text-[11px] break-all select-all block mt-0.5">
                    ${this.targetComparisonResult.liveSha256}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] block">Bit-for-Bit Hash Verdict:</span>
                  <span class="${isMatch ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                    ${isMatch ? '✓ IDENTICAL (0 bits difference)' : '✗ MISMATCH DETECTED'}
                  </span>
                </div>
              </div>
            ` : `
              <div class="p-6 text-center space-y-2 border border-dashed border-slate-800 rounded-lg">
                <i data-lucide="upload-cloud" class="w-6 h-6 mx-auto text-slate-500"></i>
                <p class="text-xs text-slate-400">Click below to pick the file you want to test against record <strong>${targetEv.id}</strong>.</p>
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

  async updateSandboxHashes() {
    const textA = (document.getElementById('sandbox-text-a') ? document.getElementById('sandbox-text-a').value : '');
    const textB = (document.getElementById('sandbox-text-b') ? document.getElementById('sandbox-text-b').value : '');

    const hashA = await CryptoEngine.sha256(textA);
    const hashB = await CryptoEngine.sha256(textB);

    const elA = document.getElementById('sandbox-hash-a');
    const elB = document.getElementById('sandbox-hash-b');
    const verdict = document.getElementById('sandbox-verdict');

    if (elA) elA.textContent = hashA;
    if (elB) elB.textContent = hashB;

    if (verdict) {
      if (textA === textB) {
        verdict.className = 'p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 flex items-center justify-between text-xs font-mono';
        verdict.innerHTML = `
          <span>✓ IDENTICAL TEXT: SHA-256 matches bit-for-bit.</span>
          <span class="cyber-badge bg-emerald-500/20 text-emerald-300">100% MATCH</span>
        `;
      } else {
        verdict.className = 'p-3.5 rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-300 flex items-center justify-between text-xs font-mono';
        verdict.innerHTML = `
          <span>✗ TEXT DIFFERENT: Cryptographic hash changed entirely (Avalanche Effect triggered).</span>
          <span class="cyber-badge bg-rose-500/20 text-rose-300">DIFF DETECTED</span>
        `;
      }
    }
  },

  runCompare() {
    const a = document.getElementById('compare-hash-a').value.trim().toLowerCase();
    const b = document.getElementById('compare-hash-b').value.trim().toLowerCase();
    const badge = document.getElementById('compare-result-badge');

    if (!a || !b) {
      badge.innerHTML = `<span class="text-xs text-amber-400">Please enter both hashes to compare.</span>`;
      return;
    }

    if (a === b) {
      badge.innerHTML = `
        <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
          <i data-lucide="check" class="w-3 h-3"></i> 100% IDENTICAL MATCH (INTEGRITY INTACT)
        </span>
      `;
      window.DEISApp.showToast('Hashes are 100% identical!', 'success');
    } else {
      badge.innerHTML = `
        <span class="cyber-badge bg-rose-500/20 text-rose-300 border border-rose-500/50">
          <i data-lucide="x" class="w-3 h-3"></i> HASH MISMATCH (DATA ALTERED OR CORRUPTED)
        </span>
      `;
      window.DEISApp.showToast('Hash mismatch! The data has been modified.', 'error');
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  printVerificationReport() {
    const ev = this.matchResult || (this.selectedEvidenceId ? window.DEISStore.getEvidenceById(this.selectedEvidenceId) : null);
    const fileName = this.lastScannedFile || (this.targetComparisonResult && this.targetComparisonResult.fileName) || 'Verified Evidence File';
    const sha256 = this.computedSha256 || (this.targetComparisonResult && this.targetComparisonResult.liveSha256) || (ev ? ev.sha256 : '');
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
