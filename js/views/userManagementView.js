/**
 * Digital Evidence Integrity System (DEIS)
 * View: User Provisioning & Role Assignment Governance (Admin Only)
 */

const UserManagementView = {
  render(container) {
    const store = window.DEISStore;
    const currentUser = store.getCurrentUser();
    const users = store.getUsers();
    const agencies = store.state.agencies;

    // Check if Administrator
    if (!currentUser || !currentUser.isAdmin) {
      container.innerHTML = `
        <div class="cyber-card p-12 text-center rounded-xl border border-rose-500/40 bg-rose-950/20 max-w-lg mx-auto space-y-4">
          <div class="w-16 h-16 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <i data-lucide="shield-x" class="w-8 h-8"></i>
          </div>
          <h2 class="text-lg font-bold text-rose-200">RESTRICTED ACCESS: ADMINISTRATOR CLEARANCE REQUIRED</h2>
          <p class="text-xs text-rose-300/80 leading-relaxed">
            Only the Root Security Administrator (<strong>ADMIN-0001</strong>) has cryptographic clearance to provision personnel and assign departmental roles.
          </p>
          <button onclick="window.DEISApp.navigate('dashboard')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition">
            Return to Command Console
          </button>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
      return;
    }

    const nonAdminCount = users.filter(u => !u.isAdmin).length;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Action Row -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <i data-lucide="users" class="w-6 h-6 text-cyan-400"></i>
                <span>Manage Officers & Users</span>
              </h2>
              <span class="cyber-badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">
                ADMINISTRATOR
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Create and manage logins for Police Detectives, Lab Analysts, Lawyers, and Court Judges.
            </p>
          </div>

          <button onclick="UserManagementView.openCreateUserModal()" class="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition">
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            <span>+ Add New Officer</span>
          </button>
        </div>

        <!-- Metrics Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Registered Personnel</div>
            <div class="mt-1 text-2xl font-bold text-white font-mono">${users.length} <span class="text-xs text-slate-400 font-sans font-normal">(${nonAdminCount} active officers)</span></div>
            <div class="text-[10px] text-cyan-400 mt-1 font-mono">Zero dummy accounts</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Operating Bodies Configured</div>
            <div class="mt-1 text-2xl font-bold text-emerald-400 font-mono">5 Departments</div>
            <div class="text-[10px] text-slate-400 mt-1">Police • Lab • Prosecution • Court • Defense</div>
          </div>

          <div class="cyber-card p-4 rounded-xl border border-slate-800">
            <div class="text-[10px] font-mono text-slate-400 uppercase">Current Administrator</div>
            <div class="mt-1 text-base font-bold text-cyan-300 font-mono">${currentUser.badgeId}</div>
            <div class="text-[10px] text-emerald-400 mt-1 font-mono">${currentUser.clearanceLevel}</div>
          </div>
        </div>

        <!-- Personnel Table -->
        <div class="cyber-card p-5 rounded-xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="shield" class="w-5 h-5 text-cyan-400"></i>
              <h3 class="font-bold text-slate-100 text-sm">Active Officers & Users (${users.length})</h3>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">Role-Based Access</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th class="py-3 px-3">OFFICER / IDENTITY</th>
                  <th class="py-3 px-3">BADGE / ID</th>
                  <th class="py-3 px-3">DEPARTMENT & BODY</th>
                  <th class="py-3 px-3">ROLE & CLEARANCE</th>
                  <th class="py-3 px-3">PASSWORD</th>
                  <th class="py-3 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 font-sans">
                ${users.map(u => `
                  <tr class="hover:bg-slate-800/40 transition">
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-${u.color}-400 shrink-0">
                          ${u.initials}
                        </div>
                        <div>
                          <div class="font-bold text-white flex items-center gap-1.5">
                            <span>${u.name}</span>
                            ${u.isAdmin ? '<span class="cyber-badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px]">ROOT ADMIN</span>' : ''}
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono">${u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td class="py-3 px-3 font-mono font-bold text-cyan-300">
                      ${u.badgeId}
                    </td>

                    <td class="py-3 px-3">
                      <div class="text-slate-200 font-medium">${u.agencyName}</div>
                      <div class="text-[10px] text-slate-500 font-mono">${u.department || 'Main HQ'}</div>
                    </td>

                    <td class="py-3 px-3">
                      <div class="text-slate-300">${u.jobTitle}</div>
                      <span class="cyber-badge bg-slate-800 text-emerald-400 border border-slate-700 text-[9px] mt-0.5 inline-block">
                        ${u.clearanceLevel}
                      </span>
                    </td>

                    <td class="py-3 px-3 font-mono text-[11px] text-slate-400">
                      <span class="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 select-all">${u.password}</span>
                    </td>

                    <td class="py-3 px-3 text-right space-x-1.5">
                      ${!u.isAdmin ? `
                        <button onclick="UserManagementView.testLoginAs('${u.id}')" class="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-semibold transition" title="Log in as this user to test handoff">
                          Test Login
                        </button>
                        <button onclick="UserManagementView.deleteUser('${u.id}', '${u.name}')" class="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded text-[11px] transition" title="Revoke User Access">
                          Revoke
                        </button>
                      ` : `
                        <span class="text-[10px] text-slate-500 font-mono">Protected Root</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  },

  openCreateUserModal() {
    window.DEISApp.openModal('create-user-modal');
  },

  handleCreateUserSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('new-user-name').value.trim();
    const badgeId = document.getElementById('new-user-badge').value.trim();
    const agencyId = document.getElementById('new-user-agency').value;
    const jobTitle = document.getElementById('new-user-title').value.trim();
    const clearanceLevel = document.getElementById('new-user-clearance').value;
    const email = document.getElementById('new-user-email').value.trim();
    const password = document.getElementById('new-user-password').value.trim() || 'password123';

    try {
      const newUser = window.DEISStore.createUser({
        name,
        badgeId,
        agencyId,
        jobTitle,
        clearanceLevel,
        email,
        password
      });

      window.DEISApp.closeModal('create-user-modal');
      document.getElementById('create-user-form').reset();
      window.DEISApp.showToast(`Personnel ${newUser.name} (#${newUser.badgeId}) successfully registered!`, 'success');
      
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }

      this.render(document.getElementById('view-container'));
    } catch (err) {
      alert(err.message);
    }
  },

  deleteUser(userId, userName) {
    if (confirm(`Are you sure you want to revoke and delete access for ${userName}?`)) {
      try {
        window.DEISStore.deleteUser(userId);
        window.DEISApp.showToast(`Personnel access revoked for ${userName}.`, 'info');
        this.render(document.getElementById('view-container'));
      } catch (err) {
        alert(err.message);
      }
    }
  },

  testLoginAs(userId) {
    const user = window.DEISStore.getUserById(userId);
    if (!user) return;

    window.DEISStore.setCurrentUser(user);
    window.DEISApp.showToast(`Logged in as ${user.name} (${user.badgeId})`, 'success');
    window.DEISApp.navigate('dashboard');
  }
};

window.UserManagementView = UserManagementView;
