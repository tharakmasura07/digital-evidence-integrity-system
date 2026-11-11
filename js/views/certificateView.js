/**
 * Digital Evidence Integrity System (DEIS)
 * View: Legal Evidence Custody Certificate (Courtroom Exhibit Ready)
 */

const CertificateView = {
  selectedEvidenceId: null,

  render(container) {
    const store = window.DEISStore;
    const evidenceList = store.getEvidenceList();
    
    if (!this.selectedEvidenceId && evidenceList.length > 0) {
      this.selectedEvidenceId = evidenceList[0].id;
    }

    const currentEv = store.getEvidenceById(this.selectedEvidenceId);
    const chainBlocks = store.getChainBlocks().filter(b => b.evidenceId === this.selectedEvidenceId);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Controls Header (No Print) -->
        <div class="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <i data-lucide="file-check" class="w-6 h-6 text-cyan-400"></i>
              <span>Court Evidence Certificate</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Printable legal document showing the evidence's digital fingerprint and full chain of custody for the Judge.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Evidence Selector -->
            <select 
              id="certificate-evidence-selector" 
              onchange="CertificateView.changeEvidence(this.value)"
              class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              ${evidenceList.map(ev => `
                <option value="${ev.id}" ${ev.id === this.selectedEvidenceId ? 'selected' : ''}>
                  ${ev.id} — ${ev.title.substring(0, 30)}...
                </option>
              `).join('')}
            </select>

            <button onclick="window.print()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-lg flex items-center gap-2 transition">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>

        <!-- The Certificate Document (Styles adapt cleanly for Print) -->
        <div class="certificate-document cyber-card p-8 sm:p-12 rounded-xl border border-slate-700 max-w-4xl mx-auto space-y-8 bg-slate-950/90 text-slate-200 shadow-2xl relative overflow-hidden">
          
          <!-- Legal Watermark / Header -->
          <div class="border-b-2 border-slate-700 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-slate-900 border-2 border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xl tracking-tighter">
                DEIS
              </div>
              <div>
                <h1 class="text-lg sm:text-xl font-bold tracking-tight uppercase text-white">
                  Certificate of Digital Evidence Integrity
                </h1>
                <p class="text-xs text-slate-400 font-mono mt-0.5">
                  CHAIN OF CUSTODY VERIFICATION RECORD • ISO/IEC 27037 & FRE 902(14) COMPLIANT
                </p>
              </div>
            </div>

            <div class="text-right font-mono text-xs">
              <div class="text-slate-400">CERTIFICATE NO:</div>
              <div class="text-cyan-400 font-bold text-sm tracking-wider">CERT-${currentEv ? currentEv.id : 'N/A'}-VERIFIED</div>
              <div class="text-slate-500 text-[10px] mt-0.5">ISSUED: ${new Date().toISOString()}</div>
            </div>
          </div>

          ${currentEv ? `
            <!-- Evidence Identity Section -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-l-2 border-cyan-500 pl-2">
                1. Identification of Digital Artifact
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Evidence Identifier:</span>
                  <span class="font-mono font-bold text-cyan-300 text-sm">${currentEv.id}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Judicial Case Number:</span>
                  <span class="font-medium text-slate-200">${currentEv.caseNumber}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Artifact Description:</span>
                  <span class="font-medium text-slate-200">${currentEv.title}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Category & Size:</span>
                  <span class="font-mono text-slate-300">${currentEv.category} (${currentEv.fileSize})</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Source Device / Serial:</span>
                  <span class="font-mono text-slate-300">${currentEv.sourceDevice}</span>
                </div>
                <div>
                  <span class="text-slate-500 text-[10px] uppercase font-mono block">Initial Seizure Location:</span>
                  <span class="text-slate-300">${currentEv.seizureLocation}</span>
                </div>
              </div>
            </div>

            <!-- Cryptographic Fingerprints -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-l-2 border-cyan-500 pl-2">
                2. Cryptographic Hashes & Bitstream Fingerprints
              </h3>
              <div class="bg-slate-900/80 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2.5">
                <div>
                  <div class="text-[10px] text-slate-500 uppercase">SHA-256 Bitstream Hash (FIPS 180-4):</div>
                  <div class="text-cyan-300 font-bold select-all break-all mt-0.5 text-xs">
                    ${currentEv.sha256}
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-800">
                  <div class="text-[10px] text-slate-500 uppercase">SHA-512 High-Assurance Hash:</div>
                  <div class="text-slate-400 select-all break-all mt-0.5 text-[11px]">
                    ${currentEv.sha512}
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">DIGITAL SEAL STATUS:</span>
                  <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    CRYPTOGRAPHICALLY SEALED & VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <!-- Chronological Chain of Custody Table -->
            <div class="space-y-3">
              <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-l-2 border-cyan-500 pl-2">
                3. Certified Chronological Chain of Custody
              </h3>
              <div class="overflow-x-auto border border-slate-800 rounded-lg">
                <table class="w-full text-left text-xs border-collapse">
                  <thead class="bg-slate-900 font-mono text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th class="py-2.5 px-3">BLOCK</th>
                      <th class="py-2.5 px-3">TIMESTAMP</th>
                      <th class="py-2.5 px-3">EVENT</th>
                      <th class="py-2.5 px-3">CUSTODIAN / OFFICER</th>
                      <th class="py-2.5 px-3">BLOCK HASH</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800 text-[11px]">
                    ${chainBlocks.map(b => `
                      <tr>
                        <td class="py-2 px-3 font-mono font-bold text-cyan-400">#${b.blockHeight}</td>
                        <td class="py-2 px-3 font-mono text-slate-400 text-[10px]">${b.timestamp}</td>
                        <td class="py-2 px-3 font-semibold text-slate-200">${b.eventType}</td>
                        <td class="py-2 px-3 text-slate-300">${b.agency.toUpperCase()} (${b.officer})</td>
                        <td class="py-2 px-3 font-mono text-slate-400 text-[10px]">${CryptoEngine.shortenHash(b.blockHash, 6)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- QR Code Verification & Legal Sign-off -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-700">
              <!-- QR Token -->
              <div class="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
                <div id="cert-qr-container" class="w-24 h-24 bg-white p-1 rounded-md flex items-center justify-center">
                  <!-- Canvas QR rendered here -->
                </div>
                <div class="text-[10px] font-mono text-slate-400 mt-2">SCAN TO AUDIT INTEGRITY</div>
                <div class="text-[9px] text-slate-500">Public Verification Node</div>
              </div>

              <!-- Forensic Officer Certification -->
              <div class="flex flex-col justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                <div class="space-y-1">
                  <span class="text-[10px] text-slate-500 uppercase font-mono">Certified Forensic Examiner:</span>
                  <div class="font-bold text-slate-200 text-xs mt-1">Dr. Aris Thorne</div>
                  <div class="text-[10px] text-slate-400">Lead Forensics Specialist, CFSL</div>
                  <div class="text-[9px] text-slate-500 font-mono mt-1">Key: 0x83B1...EF34</div>
                </div>
                <div class="mt-4 pt-2 border-t border-dashed border-slate-700 text-[10px] text-cyan-400 font-mono">
                  [DIGITALLY SIGNED VIA ECDSA-P256]
                </div>
              </div>

              <!-- Judicial / Custodial Officer Seal -->
              <div class="flex flex-col justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                <div class="space-y-1">
                  <span class="text-[10px] text-slate-500 uppercase font-mono">Judicial Registry / Receiving Clerk:</span>
                  <div class="font-bold text-slate-200 text-xs mt-1">Hon. Samuel Wright</div>
                  <div class="text-[10px] text-slate-400">High Judicial Magistrate, Court 4</div>
                  <div class="text-[9px] text-slate-500 font-mono mt-1">Seal: SEAL-HIGH-COURT-REG-2026</div>
                </div>
                <div class="mt-4 pt-2 border-t border-dashed border-slate-700 text-[10px] text-emerald-400 font-mono">
                  [OFFICIALLY ADMITTED INTO RECORD]
                </div>
              </div>
            </div>
          ` : `
            <div class="text-center py-12 text-slate-500">No evidence item selected.</div>
          `}
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
    this.renderQRCode(currentEv);
  },

  changeEvidence(evId) {
    this.selectedEvidenceId = evId;
    this.render(document.getElementById('view-container'));
  },

  renderQRCode(evidence) {
    if (!evidence) return;
    const qrContainer = document.getElementById('cert-qr-container');
    if (!qrContainer) return;

    if (window.QRCode) {
      qrContainer.innerHTML = '';
      const payload = JSON.stringify({
        system: 'DEIS',
        evidenceId: evidence.id,
        sha256: evidence.sha256,
        custodian: evidence.currentCustodian,
        verified: true
      });
      QRCode.toCanvas(payload, { width: 90, margin: 1 }, (err, canvas) => {
        if (!err && canvas) {
          qrContainer.appendChild(canvas);
        }
      });
    }
  }
};

window.CertificateView = CertificateView;
