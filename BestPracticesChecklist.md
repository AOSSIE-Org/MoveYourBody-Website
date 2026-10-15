# AOSSIE Best Practices Checklist

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.

> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.
>
> **How to use:**
> 1. Fill in checkboxes below - tick `[x]` for Met, leave `[ ]` for Unmet, use `[~]` for N/A
> 2. Add a brief note or URL after each item as evidence
> 3. Run the checklist-score workflow to update the badge automatically
>
> **Legend:**
> - 🔴 MUST - Required for passing
> - 🟡 SHOULD - Required unless documented rationale given
> - 🔵 SUGGESTED - Optional but recommended
> - ⚪ N/A - Mark `[~]` if not applicable, add justification

---

## Score Summary

<!-- Auto-updated by checklist-score.yml workflow - do not edit manually -->
| Category           | Met | Total | Status |
|--------------------|-----|-------|--------|
| Basics             | 8   | 8     | 🟢     |
| Change Control     | 5   | 6     | 🟢     |
| Reporting          | 8   | 8     | 🟢     |
| Quality            | 11  | 11    | 🟢     |
| Security           | 9   | 9     | 🟢     |
| Analysis           | 7   | 7     | 🟢     |
| **Total**          | **48** | **49** | **98%** |
---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** - The project README/website clearly describes what the software does and what problem it solves.
  - *Evidence URL:* [`README.md`](README.md) and live site at [https://move.aossie.org](https://move.aossie.org)

- [x] 🔴 **interact** - The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`README.md#contributing`](README.md)

- [x] 🔴 **contribution** - `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - *Evidence URL:* [`CONTRIBUTING.md`](CONTRIBUTING.md)

- [x] 🟡 **contribution_requirements** - `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - *Evidence URL:* [`CONTRIBUTING.md#pull-request-guidelines`](CONTRIBUTING.md)

- [x] 🔴 **documentation_basics** - Basic documentation exists for the software (README, Wiki, or docs folder).
  - *Evidence URL:* [`README.md`](README.md), [`AGENTS.md`](AGENTS.md), and [`public/brand/Brand.md`](public/brand/Brand.md)

- [x] 🔴 **documentation_interface** - Reference documentation describes the external interface (API inputs/outputs, CLI flags, config schema, etc.).
  - *Evidence URL:* [`public/openapi.json`](public/openapi.json), [`src/app/api/info/route.ts`](src/app/api/info/route.ts), and [`public/.well-known/`](public/.well-known/)

### Other Basics

- [x] 🔴 **discussion** - Project has a searchable, URL-addressable discussion mechanism (GitHub Issues, Discord with archive, mailing list, etc.) that doesn't require proprietary client software.
  - *Evidence URL:* [GitHub Issues](https://github.com/AOSSIE-Org/MoveYourBody-Website/issues) and [MoveYourBody Discord Channel](https://discord.com/channels/1022871757289422898/1500966300782956634)

- [x] 🟡 **english** - Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* All documentation, commit messages, and issue tracking are maintained in English.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** - Project uses a distributed VCS (e.g., git). *(SUGGESTED)*
  - *Evidence URL:* [https://github.com/AOSSIE-Org/MoveYourBody-Website](https://github.com/AOSSIE-Org/MoveYourBody-Website)

### Version Numbering

- [x] 🔴 **version_unique** - Each release has a unique version identifier (e.g., v1.0.0).
  - *Evidence URL:* Managed in [`package.json`](package.json) and tagged releases on GitHub.

- [x] 🔵 **version_semver** - Project uses [SemVer](https://semver.org) or [CalVer](https://calver.org/) format. *(SUGGESTED)*
  - *Note:* Follows Semantic Versioning (`vMAJOR.MINOR.PATCH`).

- [x] 🔵 **version_tags** - Releases are tagged in the VCS (e.g., `git tag v1.0.0`). *(SUGGESTED)*
  - *Evidence URL:* [GitHub Repository Releases & Tags](https://github.com/AOSSIE-Org/MoveYourBody-Website/tags)

### Release Notes

- [ ] 🔴 **release_notes** - Each release includes human-readable release notes summarizing major changes. Raw `git log` output is NOT acceptable.
  - *Status:* Unmet until first formal release with human-readable notes is published on GitHub Releases.

- [~] 🔴 **release_notes_vulns** - Release notes identify every publicly known vulnerability (with CVE) fixed in that release.
  - *Evidence URL:* `[~]` N/A - *Justification (no publicly known vulns / users can't self-update):* Static frontend website with no server state or vulnerabilities published.

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** - A bug-reporting process exists (e.g., GitHub Issues link in README).
  - *Evidence URL:* [https://github.com/AOSSIE-Org/MoveYourBody-Website/issues](https://github.com/AOSSIE-Org/MoveYourBody-Website/issues) and [`CONTRIBUTING.md`](CONTRIBUTING.md)

- [x] 🟡 **report_tracker** - An issue tracker (e.g., GitHub Issues) is used to track individual bugs.
  - *Evidence URL:* [GitHub Issues](https://github.com/AOSSIE-Org/MoveYourBody-Website/issues)

- [x] 🔴 **report_responses** - A majority of bug reports submitted in the last 2–12 months have been acknowledged (response ≠ fix).
  - *Self-certification note:* Maintainers and mentors regularly acknowledge and triage incoming issues.

- [x] 🟡 **enhancement_responses** - More than 50% of enhancement requests in the last 2–12 months have received a response.
  - *Self-certification note:* All feature requests and enhancements are actively reviewed on GitHub and Discord.

- [x] 🔴 **report_archive** - Reports and responses are publicly archived and searchable (GitHub Issues satisfies this).
  - *Evidence URL:* [GitHub Issues Archive](https://github.com/AOSSIE-Org/MoveYourBody-Website/issues?q=is%3Aissue)

### Vulnerability Reporting

- [x] 🔴 **vulnerability_report_process** - A vulnerability reporting process is documented (e.g., `SECURITY.md`).
  - *Evidence URL:* Maintainer contacts listed in [`MAINTAINERS.md`](MAINTAINERS.md) and GitHub Security Advisories.

- [x] 🟡 **vulnerability_report_private** - If private vulnerability reporting is supported, the method for private submission is documented.
  - *Evidence URL:* GitHub Private Vulnerability Reporting is enabled for this repository.

- [~] 🔴 **vulnerability_report_response** - Initial response to any vulnerability report received in the last 6 months was within 14 days.
  - *Self-certification note:* `[~]` N/A - *Justification (no reports received):* No vulnerability reports received to date.

---

## ✅ Quality

### Build System

- [x] 🔴 **build** - If the project requires building, a working build system exists that can auto-rebuild from source.
  - *Evidence URL:* Automated Next.js static build in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and [`package.json`](package.json) (`npm run build`).

- [x] 🔵 **build_common_tools** - Common build tools are used (npm, pip, cargo, make, gradle, etc.). *(SUGGESTED)*
  - *Evidence URL:* Node.js and standard `npm` package manager.

- [x] 🟡 **build_floss_tools** - The project can be built using only FLOSS tools.
  - *Note:* Fully open-source build chain (Node.js, npm, Next.js, TypeScript, Tailwind CSS, Turbopack).

### Automated Testing

- [x] 🔵 **test_invocation** - The test suite can be invoked in a standard way for the language (e.g., `npm test`, `pytest`, `cargo test`). *(SUGGESTED)*
  - *Evidence URL:* Standard `npm test` script invoking Vitest in [`package.json`](package.json).

- [x] 🔵 **test_most** - The test suite covers most code branches, input fields, and functionality. *(SUGGESTED)*
  - *Estimated coverage %:* Comprehensive unit & component tests covering routing, config, i18n catalogs, sitemap, and UI primitives in [`tests/`](tests/).

### New Functionality Testing Policy

- [x] 🔴 **test_policy** - The project has a general policy that new functionality must include tests in the automated test suite.
  - *Evidence (CONTRIBUTING reference or informal policy):* Required in [`CONTRIBUTING.md#pull-request-guidelines`](CONTRIBUTING.md) and [`README.md#contributing`](README.md).

- [x] 🔴 **tests_are_added** - Evidence exists that the test policy has been followed in recent major changes (e.g., PRs include tests).
  - *Evidence URL (recent PR with tests):* Automated test suite provided in `tests/` and integrated into [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

- [x] 🔵 **tests_documented_added** - The test policy is documented in contribution instructions. *(SUGGESTED)*
  - *Evidence URL:* Documented in [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Linting / Warning Flags

- [x] 🔴 **warnings** - At least one linter or compiler warning flag is enabled (ESLint, Pylint, clippy, golangci-lint, Slither for Solidity, etc.).
  - *Tool used:* ESLint 9 (`eslint.config.mjs`) and TypeScript compiler (`tsconfig.json`).

- [x] 🔴 **warnings_fixed** - Warnings from the linter are addressed (not suppressed without reason).
  - *Note:* Zero linting warnings or compilation errors in `npm run lint` and `npm run build`.

- [x] 🔵 **warnings_strict** - Project uses maximum strictness in linter config where practical. *(SUGGESTED)*
  - *Note:* TypeScript strict mode enabled (`"strict": true`) and Next.js Core Web Vitals ESLint ruleset.

---

## 🔐 Security

### Secure Development Knowledge

- [x] 🔴 **know_secure_design** - At least one primary developer knows how to design secure software (familiar with OWASP, threat modeling, secure-by-default principles).
  - *Self-certification note:* Maintainers adhere to privacy-by-design, zero client data persistence on server, and static export architecture.

- [x] 🔴 **know_common_errors** - At least one primary developer knows common vulnerability types for this software's category and how to mitigate them (e.g., injection, XSS, reentrancy for Solidity, prompt injection for AI).
  - *Self-certification note:* React auto-escaping, safe URL protocols, dependency auditing (`npm audit`), and static HTML generation without dynamic server-side template injection.

### Cryptography (mark N/A if project does not handle cryptography)

- [~] 🔴 **crypto_published** - Only publicly reviewed cryptographic protocols/algorithms are used by default.
  - *Note:* `[~]` N/A - Static website landing page; does not implement or use custom cryptography.

- [~] 🟡 **crypto_call** - Project calls an established crypto library rather than reimplementing crypto functions.
  - *Library used:* `[~]` N/A - No custom cryptography functions used.

- [~] 🔴 **crypto_working** - No broken algorithms (MD4, MD5, single DES, RC4, Dual_EC_DRBG) used unless required for interoperability (must be documented).
  - *Note:* `[~]` N/A - No cryptographic algorithms used.

- [~] 🔴 **crypto_keylength** - Key lengths meet [NIST 2030 minimums](https://www.keylength.com/en/4/) by default.
  - *Note:* `[~]` N/A - No cryptographic key generation or storage.

- [~] 🔴 **crypto_password_storage** - Passwords for external users are stored as iterated salted hashes (Argon2id, bcrypt, scrypt, PBKDF2).
  - *Note:* `[~]` N/A - *Justification (project doesn't store passwords):* The site has no user accounts, authentication, or password storage.

- [~] 🔴 **crypto_random** - Cryptographic keys and nonces are generated using a CSPRNG; insecure generators (Math.random, rand()) are NOT used for security purposes.
  - *Note:* `[~]` N/A - No cryptographic keys or security nonces generated.

- [x] 🟡 **delivery_unsigned** - Cryptographic hashes are NOT retrieved over plain HTTP without a signature check.
  - *Note:* All assets, packages, and communications use strict HTTPS.

---

## 🔬 Analysis

### Static Code Analysis

- [x] 🔴 **static_analysis_fixed** - All medium+ severity vulnerabilities found by static analysis are fixed in a timely manner after confirmation.
  - *Note:* CodeRabbit AI review, ESLint, and dependabot alerts are remediated immediately.

- [x] 🔵 **static_analysis_common_vulnerabilities** - The static analysis tool includes checks for common vulnerabilities in the language/environment (e.g., eslint-plugin-security, bandit, Slither). *(SUGGESTED)*
  - *Tool + ruleset:* ESLint, TypeScript compiler, CodeRabbit security rules in [`.coderabbit.yml`](.coderabbit.yml).

- [x] 🔵 **static_analysis_often** - Static analysis runs on every commit or at least daily (CI integration). *(SUGGESTED)*
  - *Evidence URL:* [`.github/workflows/ci.yml`](.github/workflows/ci.yml) triggers on every push and pull request.

### Dynamic Code Analysis

- [~] 🔵 **dynamic_analysis** - At least one dynamic analysis tool is applied before major releases (fuzzer, web app scanner like OWASP ZAP, etc.). *(SUGGESTED)*
  - *Tool used:* `[~]` N/A - *Justification:* Static export marketing website; Google Lighthouse and browser devtools dynamic auditing applied.

- [x] 🔵 **dynamic_analysis_enable_assertions** - Dynamic analysis / testing runs with assertions enabled (not just production mode). *(SUGGESTED)*
  - *Note:* Vitest runs in development/test environment with full assertions enabled.

- [~] 🔴 **dynamic_analysis_fixed** - Medium+ severity vulnerabilities found by dynamic analysis are fixed in a timely manner.
  - *Note:* `[~]` N/A - No dynamic vulnerabilities found on static export frontend.

- [~] 🔵 **dynamic_analysis_unsafe** - If the project uses memory-unsafe languages (C/C++), memory safety tools (Valgrind, AddressSanitizer) are used. *(SUGGESTED)*
  - *Note:* `[~]` N/A - *Justification (project uses memory-safe languages):* Uses TypeScript, React, and CSS (memory-safe).

---

## 📎 Project-Specific Notes

### Full-Stack / Next.js Notes
- The site is configured for static export (`output: 'export'`) with Next.js 16 App Router, deployed to GitHub Pages with custom domain `move.aossie.org`.
- No backend servers, dynamic API routes, or databases are deployed in this repository.

---

*This checklist complements [OpenSSF Scorecard](https://scorecard.dev/) (auto-detected checks) and is
inspired by the [OpenSSF Best Practices Badge](https://www.bestpractices.dev/en/criteria/0) passing criteria.*