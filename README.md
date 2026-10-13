<!-- Don't delete it -->
<div id="readme-top"></div>

<!-- Organization Logo -->
<p align="center">
  <img src="public/brand/icons/aossie_logo.svg" width="175" alt="AOSSIE logo" />
  &nbsp;&nbsp;
  <img src="public/brand/icons/MoveYourBody_logo.svg" width="160" alt="MoveYourBody logo" />
</p>

<p align="center">
  <a href="https://move.aossie.org">
    <img src="https://img.shields.io/badge/MoveYourBody-move.aossie.org-228B22?style=for-the-badge&labelColor=FFC517" alt="MoveYourBody website badge" />
  </a>
  &nbsp;
  <a href="https://play.google.com/store/apps/details?id=org.aossie.move">
    <img src="https://img.shields.io/badge/Google_Play-Download-00843D?style=for-the-badge&logo=googleplay&logoColor=white" alt="Get it on Google Play" />
  </a>
</p>

<!-- Organization/Project Social Handles -->
<p align="center">
  <a href="https://t.me/+bMWGzaMTMa8xN2Ex"><img src="https://img.shields.io/badge/Telegram_AOSSIE-black?style=flat&logo=telegram&logoColor=white&color=24A1DE" alt="Telegram Badge"/></a>
  &nbsp;
  <a href="https://x.com/aossie_org"><img src="https://img.shields.io/twitter/follow/aossie_org" alt="X Badge"/></a>
  &nbsp;
  <a href="https://discord.gg/hjUhu33uAn"><img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&label=Discord%20AOSSIE&labelColor=5865F2&color=57F287" alt="Discord AOSSIE"/></a>
  &nbsp;
  <a href="https://discord.gg/YzDKeEfWtS"><img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&label=Discord%20Stability%20Nexus&labelColor=5865F2&color=57F287" alt="Discord Stability Nexus"/></a>
  &nbsp;
  <a href="https://www.linkedin.com/company/aossie/"><img src="https://img.shields.io/badge/LinkedIn_AOSSIE-black?style=flat&logo=LinkedIn&logoColor=white&color=0A66C2" alt="LinkedIn Badge"/></a>
  &nbsp;
  <a href="https://www.youtube.com/@AOSSIE-Org"><img src="https://img.shields.io/badge/Subscribe_to_AOSSIE-red?style=flat&logo=youtube&logoColor=white" alt="Subscribe to AOSSIE"/></a>
  &nbsp;
  <a href="https://www.youtube.com/@StabilityNexus"><img src="https://img.shields.io/badge/Subscribe_to_Stability_Nexus-red?style=flat&logo=youtube&logoColor=white" alt="Subscribe to Stability Nexus"/></a>
</p>

---

<div align="center">
<h1>MoveYourBody Website</h1>
</div>

The official website of **MoveYourBody**, live at **[move.aossie.org](https://move.aossie.org)**.

MoveYourBody is AOSSIE's privacy-first, open-source fitness app. It builds personalized 5–7 minute micro-workouts around your goals, equipment and injuries, adapts after every session from your feedback, and runs entirely offline with on-device AI and hands-free voice control. The app itself is developed in [AOSSIE-Org/MoveYourBody](https://github.com/AOSSIE-Org/MoveYourBody); this repository contains its landing page.

<!-- Project Badges -->
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/AOSSIE-Org/MoveYourBody-Website/badge)](https://securityscorecards.dev/viewer/?url=github.com/AOSSIE-Org/MoveYourBody-Website)
[![NHS Agentic Readiness Score](https://nothumansearch.ai/badge/move.aossie.org.svg)](https://nothumansearch.ai/site/move.aossie.org)

---

## 🚀 Project's Features

What the landing page presents, taken from the app repository and its contributors:

- **Personalized workouts**: sessions built from goals, fitness level, preferences, equipment and target body region.
- **Short sessions**: quick 5–7 minute micro-workouts of three exercises.
- **Smart, adaptive recommendations**: post-workout feedback on difficulty and intensity gradually tunes future sessions.
- **Variety engine**: recently performed exercises are avoided to keep workouts fresh.
- **Safety-aware**: exercises that could aggravate a stated injury are never recommended.
- **Offline, on-device AI**: a quantized `all-MiniLM-L6-v2` model on ONNX Runtime; data stays on the phone.
- **Voice control**: start, pause, skip or repeat hands-free.
- **Plus**: daily reminders, progress statistics, custom workouts, exercise search and body-focus sessions.

---

## 💻 Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 with semantic CSS-variable tokens |
| Localization | `next-intl` - English (`en`) and Hindi (`hi`), type-checked catalogs |
| Theming | `next-themes` - dark (default) and light |
| Motion | CSS keyframes, scroll-driven animations and small IntersectionObserver hooks; `lenis` smooth scroll; a WebGL button |
| Icons | `lucide-react` plus inline brand marks |
| Hosting | Static export (`out/`) on GitHub Pages, custom domain `move.aossie.org` |

---

## 📋 Project Maturity Checklist

* [x] The project has a logo (`public/brand/icons/MoveYourBody_logo.svg`).
* [x] The project has a favicon (`public/brand/icons/favicon.ico`) and app icons.
* [x] The web frontend:
   - [x] Has proper title and metadata (localized per language).
   - [x] Has proper Open Graph metadata (`public/brand/og-image.jpg`), to ensure that it is shown well when shared in social media.
   - [x] Has a footer and header with AOSSIE logos and social handles.
   - [x] Uses React Server Components by default, introducing Client Components (`"use client"`) only when interactivity or client hooks are required.
   - [x] Is deployed to GitHub Pages via a GitHub Workflow (`.github/workflows/nextjs.yml`).
   - [x] Has automated CI build and lint validation (`.github/workflows/ci.yml`).
   - [x] Has automated unit and component test suite with Vitest and React Testing Library (`npm test`).
   - [x] Has CodeRabbit automated AI code review (`.coderabbit.yml`).
   - [x] Has open-source legal compliance (`DCO.md`, `COPYRIGHT.md`, `MAINTAINERS.md`).
   - [x] Supports light and dark themes, English and Hindi, and reduced-motion preferences.

---

## 🚀 Website's Features

- **Award-style landing page:** pointer-parallax hero with a liquid-metal WebGL download button, a scroll-lit manifesto, a bento grid of *interactive* feature demos (build a session, simulate voice commands, rate a workout, toggle injuries), a sticky phone that walks through the recommendation pipeline, an orbiting privacy "vault", and an open-source section with the team and contributors.
- **App screens built in code:** the phone mockups recreate the app's UI in its own palette, so they stay crisp, themeable and translatable at any size.
- **Performance first:** only compositor-friendly animations, off-screen work paused, no animation libraries, pre-compressed WebP/JPEG assets, and a tiny favicon.
- **Accessible:** semantic landmarks, skip link, keyboard-operable demos, `aria-pressed`/`aria-live` state, and full content with reduced motion or without JavaScript.
- **Robust i18n & l10n:** subpath routing (`/en`, `/hi`), Devanagari typography, and compile-time checks that every locale has every key.
- **SEO & AI readiness:** per-locale canonical/alternate links, sitemap, JSON-LD (`MobileApplication`), web manifest, `llms.txt`, OpenAPI and `.well-known` manifests.

---

## 📂 Project Structure

```text
├── .github/workflows/          # CI (lint + build), GitHub Pages deployment, merge-conflict labels
├── next.config.ts              # Static export + next-intl plugin
├── public/
│   ├── CNAME                   # Custom domain for GitHub Pages (move.aossie.org)
│   ├── .well-known/            # assetlinks.json, ai-plugin.json, mcp.json
│   ├── api/, openapi.json      # Machine-readable project metadata
│   ├── llms.txt, robots.txt
│   └── brand/
│       ├── Brand.md            # Brand guidelines (colours, type, assets)
│       ├── og-image.jpg        # Social share card (1200×630)
│       ├── assets/             # hero-model.webp
│       └── icons/              # Logos, favicon, app icons
└── src/
    ├── app/
    │   ├── page.tsx            # Redirects / to the default locale
    │   ├── sitemap.ts, manifest.ts, api/info/route.ts
    │   ├── fonts/              # Self-hosted Lexend
    │   └── [locale]/           # layout.tsx, page.tsx, globals.css, error.tsx, not-found.tsx
    ├── components/
    │   ├── hero/               # Hero (parallax) + HeroStage
    │   ├── dock/               # Dock navbar, language switcher, theme toggle
    │   ├── sections/           # Manifesto, Features, HowItWorks, Privacy, OpenSource, DownloadCta, SiteFooter
    │   ├── mockups/            # AppScreens: the app's screens rebuilt in code
    │   ├── ui/                 # Reveal, CountUp, SpotlightGroup, PhoneFrame, SectionHeading, LiquidMetalButton, styles.ts
    │   └── providers/          # Theme and Lenis providers
    ├── config/                 # languages.ts, links.ts (site URL + all external links)
    ├── i18n/                   # routing, request, navigation, metadata, typed messages
    └── messages/               # en.json, hi.json
```

---

## 🛠️ Usage Guide

### 1. Editing copy

All visible text lives in [`src/messages/en.json`](src/messages/en.json) and [`src/messages/hi.json`](src/messages/hi.json). Keys are type-checked: a missing Hindi key or a typo in `t("...")` fails `npm run build`.

Headlines use a `<hl>` tag for the accent word:

```json
"title": "A personal coach that fits in <hl>five minutes</hl>"
```

```tsx
t.rich("title", { hl: highlight })
```

### 2. Adding a new language

1. Register it in [`src/config/languages.ts`](src/config/languages.ts):
   ```typescript
   { code: 'fr', name: 'French', localName: 'Français' },
   ```
2. Copy `src/messages/en.json` to `src/messages/fr.json` and translate every value.
3. Add it to `messagesMap` in [`src/i18n/messages.ts`](src/i18n/messages.ts) (typed as `Messages`, so the compiler checks it is complete) and add its Open Graph locale in [`src/i18n/metadata.ts`](src/i18n/metadata.ts).

### 3. Navigation

Use the locale-aware helpers from [`src/i18n/navigation.ts`](src/i18n/navigation.ts) instead of `next/link` / `next/navigation`. In-page links are plain anchors (`href="#features"`); Lenis turns them into smooth scrolls that clear the fixed dock.

### 4. Theme tokens

Colours are CSS variables in [`globals.css`](src/app/[locale]/globals.css), defined for `:root` (light) and `.dark`, and exposed to Tailwind through `@theme`:

```tsx
<div className="bg-surface text-foreground-primary border border-border-subtle">
  <span className="text-highlight">Adapts to both themes</span>
</div>
```

Never use inline `dark:` utilities; add a token instead. See [`public/brand/Brand.md`](public/brand/Brand.md) for the palette.

### 5. Motion

Keyframes are `--animate-*` tokens in `globals.css`. Wrap content in `<Reveal>` for scroll-in entrances, use `motion-safe:` for loops, and pause anything off screen with `useInView`. Read the *Motion & Performance* rules in [`AGENTS.md`](AGENTS.md) before adding effects.

---

## ⚡ Development and Deployment

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You are redirected to `/en` (English); `/hi` serves Hindi.

### Running Tests

```bash
npm test
```

### Building for Production (Static Export)

```bash
npm run build
```

This writes the static site to `./out`. Pushing to `main` builds and deploys it to GitHub Pages via [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml), with `NEXT_PUBLIC_SITE_URL=https://move.aossie.org`.

### Custom domain

`public/CNAME` contains `move.aossie.org`. Point a DNS `CNAME` record for `move` at `aossie-org.github.io` and set the custom domain under **Settings → Pages** of this repository.

### Android App Links

[`public/.well-known/assetlinks.json`](public/.well-known/assetlinks.json) declares `org.aossie.move`. Replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT` with the SHA-256 fingerprint from Play Console (**Setup → App integrity → App signing key certificate**) to enable verified links.

---

## 🤝 Contributing

We welcome contributions of all kinds! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md), then:

1. Fork the repository and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`).
3. Ensure code quality:
   - `npm run lint`
   - `npm test`
   - `npm run build`
4. Push your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

To contribute to the app itself, visit [AOSSIE-Org/MoveYourBody](https://github.com/AOSSIE-Org/MoveYourBody).

© 2026 AOSSIE. See [`COPYRIGHT.md`](COPYRIGHT.md).
