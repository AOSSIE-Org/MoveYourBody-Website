# Contributing to the MoveYourBody Website

We welcome contributions of all kinds! Whether you are fixing a bug, adding a feature, improving documentation, translating, or optimizing performance, your help is appreciated.

> This repository is the **website** ([move.aossie.org](https://move.aossie.org)). To work on the Flutter app itself, head to [AOSSIE-Org/MoveYourBody](https://github.com/AOSSIE-Org/MoveYourBody).

---

## 💬 Join our Discord Community

If you have questions, feedback, or want to discuss ideas before building:
- **AOSSIE Discord Server:** [https://discord.gg/hjUhu33uAn](https://discord.gg/hjUhu33uAn)
- **MoveYourBody channel:** [#MoveYourBody on the Stability Nexus Discord](https://discord.com/channels/1022871757289422898/1500966300782956634)

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: `v22.0.0` or higher
- **npm**: `v9` or higher

### 2. Fork & Clone
```bash
git clone https://github.com/AOSSIE-Org/MoveYourBody-Website.git
cd MoveYourBody-Website
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📜 Pull Request Guidelines

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Quality Checks:**
   Run lint, tests, and build before submitting (the build also type-checks translation keys):
   ```bash
   npm run lint
   npm run test:coverage   # Vitest; CI fails below 90% coverage
   npm run build
   ```
3. **Tests are required for new logic:** changes to `src/config/`, `src/i18n/`, `src/app/sitemap.ts`, `src/app/manifest.ts`, hooks or class-recipe helpers must add or update tests in `tests/`. Prefer [fast-check](https://fast-check.dev) property tests for functions with many input combinations.
4. **Check both themes and both languages:** switch dark/light and English/हिन्दी in the dock, and try a phone-width viewport.
5. **Commit Messages:**
   Use clear, descriptive commit messages following Conventional Commits (e.g., `feat: add social share buttons`, `fix: header logo alignment`).
6. **Developer Certificate of Origin (DCO):**
   Ensure your commits adhere to our [`DCO.md`](DCO.md).

---

## 📋 Code Style & Architecture

- **Next.js 16 App Router:** Use React Server Components by default. Use `"use client"` only for interactive stateful components.
- **Tailwind CSS v4:** Use the semantic theme tokens (`bg-background-primary`, `text-foreground-primary`, `text-highlight`, …) and the shared recipes in `src/components/ui/styles.ts`. Avoid ad-hoc inline `dark:` classes and raw hex colours.
- **Motion:** Keep animations on `transform`/`opacity`, gate them with `motion-safe:`, and pause work that is off screen. See the *Motion & Performance* section of [`AGENTS.md`](AGENTS.md).
- **Internationalization (i18n):** User-visible strings belong in both `src/messages/en.json` and `src/messages/hi.json`. Use navigation helpers from `src/i18n/navigation.ts`.
- **Accurate content:** Claims about the app must match the app repository's README and privacy policy.
- **Branding:** Follow [`public/brand/Brand.md`](public/brand/Brand.md).
- **Zero TODOs Policy:** Ensure all code, documentation, and metadata files contain no remaining `TODO` placeholders.

Thank you for contributing to AOSSIE & MoveYourBody!
