/**
 * Digital Evidence Integrity System (DEIS)
 * View: Authentication Gateway & Administrator Login Portal
 */

const LoginView = {
  render(container) {
    if (!container) return;

    const store = window.DEISStore;
    const users = (store && typeof store.getUsers === 'function' ? store.getUsers() : []) || [];
    const provisionedOfficers = users.filter(u => u && !u.isAdmin);

    container.innerHTML = `
      <div class="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden" style="min-height: 100vh;">
        
        <!-- Cyber Background Grid & Lighting Effects -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-navy-950/80 to-navy-950 pointer-events-none"></div>
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Main Login Card Container -->
        <div class="w-full max-w-5xl z-10 space-y-6">
          
          <!-- Legal Security Disclaimer Notice -->
          <div class="p-3 rounded-lg bg-navy-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-lg">
            <div class="flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400 shrink-0"></i>
              <span>
                <strong>Digital Evidence Integrity System:</strong> Secure, tamper-proof evidence transfer between Police, Forensic Labs, Prosecution, and Courts.
              </span>
            </div>
            <span class="cyber-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline-flex">SYSTEM READY</span>
          </div>

          <!-- Main Auth Panel -->
          <div class="cyber-card rounded-2xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
            
            <!-- Left Column: Official Authentication Credentials Form (7 Cols) -->
            <div class="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800">
              <div>
                <!-- Brand Title -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-navy-950 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/25">
                    <i data-lucide="shield-check" class="w-7 h-7 text-slate-950"></i>
                  </div>
                  <div>
                    <h1 class="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span>DEIS SECURITY ACCESS</span>
                      <span class="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">v1.0</span>
                    </h1>
                    <p class="text-xs text-slate-400 font-mono">DIGITAL EVIDENCE INTEGRITY & CUSTODY PORTAL</p>
                  </div>
                </div>

                <!-- Admin Quick Login Banner -->
                <div class="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 mb-5 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <i data-lucide="key" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-cyan-200">System Administrator Account</div>
                      <div class="text-[10px] text-cyan-300/80 font-mono">ID: ADMIN-0001 • Pass: admin@0001</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onclick="LoginView.fillAdminCredentials()" 
                    class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow transition shrink-0"
                  >
                    Auto-Fill
                  </button>
                </div>

                <!-- Login Form -->
                <form onsubmit="LoginView.handleSubmit(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">
                      Officer ID or Badge ID:
                    </label>
                    <div class="relative">
                      <i data-lucide="badge-check" class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
                      <input 
                        type="text" 
                        id="login-badge-input" 
                        required 
                        placeholder="e.g. ADMIN-0001" 
                        value="ADMIN-0001"
                        class="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="text-xs font-semibold text-slate-300">
                        Password:
                      </label>
                    </div>
                    <div class="relative">
                      <i data-lucide="lock" class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
                      <input 
                        type="password" 
                        id="login-password-input" 
                        required 
                        placeholder="••••••••••••" 
                        value="admin@0001"
                        class="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500" 
                      />
                      <button 
                        type="button" 
                        onclick="LoginView.togglePasswordVisibility()" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        <i data-lucide="eye" id="toggle-pwd-icon" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>

                  <div id="login-error-msg" class="hidden p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
                    <i data-lucide="alert-triangle" class="w-4 h-4 shrink-0"></i>
                    <span id="login-error-text"></span>
                  </div>

                  <div class="pt-1 space-y-2.5">
                    <button 
                      type="submit" 
                      id="login-submit-btn"
                      class="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i data-lucide="log-in" class="w-4 h-4"></i>
                      <span>Log In to Evidence System</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Security Footer -->
              <div class="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span class="flex items-center gap-1.5 text-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>TLS 1.3 / AES-256-GCM Gateway</span>
                </span>
                <span>Access Control: Root Authority</span>
              </div>
            </div>

            <!-- Right Column: Role Provisioning Information (5 Cols) -->
            <div class="p-6 sm:p-8 lg:col-span-5 bg-slate-950/60 flex flex-col justify-between space-y-5">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i>
                    <span>Access & Identity Governance</span>
                  </h3>
                  <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[9px]">RESTRICTED</span>
                </div>
                
                <p class="text-xs text-slate-400 mb-4 leading-relaxed">
                  Only the <strong class="text-white">Administrator (ADMIN-0001)</strong> can provision new personnel and assign departmental roles (Police, Forensics Lab, Prosecution, Court, Defense).
                </p>

                <!-- Provisioned Users List -->
                <div class="space-y-2.5">
                  <div class="text-[11px] font-mono text-slate-500 uppercase">Registered Personnel Directory:</div>
                  
                  ${provisionedOfficers.length === 0 ? `
                    <div class="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-2">
                      <i data-lucide="user-x" class="w-6 h-6 mx-auto text-slate-600"></i>
                      <div class="text-xs text-slate-400 font-medium">No Department Officers Registered Yet</div>
                      <p class="text-[10px] text-slate-500">
                        Log in as <strong>ADMIN-0001</strong> to create your first police detective, forensic analyst, or prosecutor.
                      </p>
                    </div>
                  ` : `
                    <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
                      ${provisionedOfficers.map(u => `
                        <div 
                          onclick="LoginView.quickSelectUser('${u.badgeId}', '${u.password}')"
                          class="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between"
                        >
                          <div class="flex items-center gap-2.5 min-w-0">
                            <div class="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 shrink-0">
                              ${u.initials || 'OF'}
                            </div>
                            <div class="min-w-0">
                              <div class="text-xs font-bold text-white truncate">${u.name}</div>
                              <div class="text-[10px] text-slate-400 font-mono">${u.badgeId} • <span class="text-cyan-400">${(u.agencyId || '').toUpperCase()}</span></div>
                            </div>
                          </div>
                          <span class="text-[10px] text-cyan-400 font-mono shrink-0">Click to Fill</span>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>
              </div>

              <!-- Quick Reset Link -->
              <div class="pt-4 border-t border-slate-800/80 text-center">
                <button onclick="window.DEISStore.resetFactoryData(); location.reload();" class="text-[10px] text-slate-500 hover:text-rose-400 font-mono transition cursor-pointer">
                  Reset System State to Clean Root Admin
                </button>
              </div>
            </div>

          </div>

          <!-- Compliance Footer Badges -->
          <div class="flex items-center justify-center gap-6 text-[10px] text-slate-500 font-mono flex-wrap">
            <span class="flex items-center gap-1"><i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> ISO/IEC 27037:2012</span>
            <span class="flex items-center gap-1"><i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> FRE Rule 902(14)</span>
            <span class="flex items-center gap-1"><i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> NIST SP 800-86</span>
            <span class="flex items-center gap-1"><i data-lucide="check" class="w-3 h-3 text-emerald-400"></i> CJIS Security Policy 5.9</span>
          </div>

        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) { console.warn('lucide error', e); }
    }
  },

  fillAdminCredentials() {
    const badgeInput = document.getElementById('login-badge-input');
    const passInput = document.getElementById('login-password-input');
    if (badgeInput) badgeInput.value = 'ADMIN-0001';
    if (passInput) passInput.value = 'admin@0001';
  },

  quickSelectUser(badgeId, password) {
    const badgeInput = document.getElementById('login-badge-input');
    const passInput = document.getElementById('login-password-input');
    if (badgeInput) badgeInput.value = badgeId;
    if (passInput) passInput.value = password;
  },

  togglePasswordVisibility() {
    const input = document.getElementById('login-password-input');
    const icon = document.getElementById('toggle-pwd-icon');
    if (input) {
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.setAttribute('data-lucide', 'eye-off');
      } else {
        input.type = 'password';
        if (icon) icon.setAttribute('data-lucide', 'eye');
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }
  },

  handleSubmit(event) {
    if (event) event.preventDefault();
    const badge = document.getElementById('login-badge-input').value;
    const pass = document.getElementById('login-password-input').value;
    const errorEl = document.getElementById('login-error-msg');
    const errorText = document.getElementById('login-error-text');

    try {
      const user = window.DEISStore.login(badge, pass);
      window.DEISApp.handleSuccessfulLogin(user);
    } catch (err) {
      if (errorEl && errorText) {
        errorText.textContent = err.message;
        errorEl.classList.remove('hidden');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          try { window.lucide.createIcons(); } catch (e) {}
        }
      }
    }
  }
};

window.LoginView = LoginView;
