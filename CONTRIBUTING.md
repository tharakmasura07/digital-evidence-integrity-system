# Contributing to the Digital Evidence Integrity System (DEIS)

Thank you for your interest in contributing to **DEIS**! This project provides a zero-dependency, cryptographically verifiable digital forensics and evidence chain of custody platform.

---

## 🛠️ Guiding Principles

1. **Zero External Dependencies / Air-Gapped Compatibility:**
   - DEIS is designed to run in standalone and air-gapped forensic environments without requiring internet connections or node build pipelines.
   - Core cryptography must rely on native browser standards (`SubtleCrypto` / Web Crypto API, FIPS 180-4 SHA-256 and SHA-512).
2. **Forensic Integrity First:**
   - Hashing, digital signatures, and Merkle tree calculations must be deterministic and verifiable.
   - No mock hashes for live ingestion; all digests must represent genuine bitstream evaluations.
3. **Simplicity & Clean UI:**
   - The user interface must remain clear, fast, and accessible to non-technical legal clerks as well as technical forensic specialists.

---

## 📋 How to Contribute

### Reporting Bugs & Issues
- Check existing issues to see if the problem has already been reported.
- When opening a new issue, include:
  - Browser type and version (Chrome, Brave, Edge, Firefox).
  - Clear steps to reproduce the issue.
  - Expected behavior vs. actual behavior.
  - Screenshots or console logs if applicable.

### Submitting Pull Requests (PRs)
1. **Fork the Repository** on GitHub.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/digital-evidence-integrity-system.git
   cd digital-evidence-integrity-system
   ```
3. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes:**
   - Keep code vanilla ES6+ (no external bundle dependencies).
   - Ensure all braces and syntax are clean and well-commented.
5. **Test Your Changes:**
   - Open `index.html` or run `start.bat`.
   - Verify login with `ADMIN-0001` / `admin@0001`.
   - Test Evidence Files, Case Dossiers, Transfers, Ledger History, Verifier, and Court Certificate.
6. **Commit and Push:**
   ```bash
   git add .
   git commit -m "feat: add descriptive message"
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch.

---

## ⚖️ License
By contributing to DEIS, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
