<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MoveYourBody Website

The landing page for **MoveYourBody** ([move.aossie.org](https://move.aossie.org)), AOSSIE's privacy-first, open-source fitness app: personalized 5–7 minute micro-workouts, on-device AI (quantized all-MiniLM-L6-v2 on ONNX Runtime), voice control, fully offline. The app itself lives in [AOSSIE-Org/MoveYourBody](https://github.com/AOSSIE-Org/MoveYourBody) (Flutter); this repository is only the website.

- **Play Store:** `https://play.google.com/store/apps/details?id=org.aossie.move`
- **Facts about the app** (features, stack, privacy claims) must come from the app repo's README, `PRIVACY_POLICY.md` or maintainers. Do not invent capabilities, numbers or claims.

## 🛠️ Stack & Commands

- **Stack:** Next.js 16.2.11 App Router (Turbopack), React 19, Tailwind CSS v4, `next-intl` (i18n), `next-themes` (light/dark state manager), `lenis` (smooth scroll), `lucide-react` (icons). No animation library: motion is CSS plus small hooks.
- **Output:** static export (`output: "export"`) to `out/`, deployed to GitHub Pages with the custom domain in `public/CNAME`.
- **Develop:** `npm run dev` · **Lint:** `npm run lint` · **Build:** `npm run build`

---

## 🧱 Layout of the code

- `src/app/[locale]/page.tsx` composes the page: `DockNavbar` → `Hero` → `Manifesto` → `Features` → `HowItWorks` → `Privacy` → `OpenSource` → `DownloadCta` → `SiteFooter`.
- `src/components/sections/`: one file per landing section. Section ids (`features`, `how-it-works`, `privacy`, `open-source`, `download`) are the nav anchors.
- `src/components/hero/`: hero stage with pointer parallax and the liquid-metal download button (`LiquidMetalButton`, a reusable WebGL2 component).
- `src/components/dock/`: floating dock navbar, language switcher, theme toggle.
- `src/components/mockups/AppScreens.tsx`: the app's screens rebuilt in code, sized in `cqw` inside `PhoneFrame`.
- `src/components/ui/`: shared primitives. Reuse them rather than re-inventing:
  - `styles.ts`: `section`, `card`, `buttonPrimary`, `buttonSecondary`, `eyebrow`, `chip()` class recipes.
  - `SectionHeading` (+ `highlight` for `t.rich(..., { hl: highlight })`), `Reveal`, `CountUp`, `SpotlightGroup`, `PhoneFrame`, `BrandIcon`, `useInView`, `LiquidMetalButton`.
- `src/config/links.ts`: `SITE_URL` and every external URL. Never hard-code links elsewhere.

---

## 🎨 Styles & Theme System

- **Class-Based Dark Mode:** Tailwind CSS v4 is configured for class-based overrides using `@custom-variant dark (&:where(.dark, .dark *))` in [`globals.css`](src/app/[locale]/globals.css). Dark is the default theme; light is fully supported.
- **Semantic Tokens:** Do **not** write inline dark utilities (e.g., `dark:bg-black` or `dark:text-zinc-50`) or raw hex colours. Use the semantic classes bound to the theme variables (e.g., `bg-background-primary`, `text-foreground-primary`, `text-highlight`, `bg-surface`, `border-border-subtle`). Add a token in `globals.css` (both `:root` and `.dark`) when a new role is needed.
- **App mockup palette:** `app-*` and `figure-*` tokens mirror the Flutter app's own (always dark) theme and are intentionally not theme-switched.
- **Typography:** The default font family is **Lexend** (self-hosted via `next/font/local` from `src/app/fonts/`), with **Noto Sans Devanagari** leading on Hindi pages. Both are mapped to `--font-sans` in globals.css. Letter-spacing is disabled on Hindi pages because it breaks Devanagari.
- **Responsive Layout:** Build mobile-first with standard Tailwind breakpoints (`sm`/`md`/`lg`) and normal flow (flex/grid). Use the shared `container` class from [`src/components/container.ts`](src/components/container.ts) for page width so sections line up. Avoid viewport-scaled `calc()` sizing.

---

## ⚡ Motion & Performance

Performance comes first; every effect must stay cheap.

- Animate only `transform`/`translate`/`scale`/`rotate` and `opacity`. Keyframes live in the `@theme inline` block of `globals.css` as `--animate-*` tokens.
- Gate motion behind `motion-safe:` (or check `prefers-reduced-motion` in JS). Content must be fully visible with reduced motion and without JavaScript.
- Scroll-in reveals use `<Reveal>`; the manifesto uses CSS scroll-driven animations with a static fallback.
- Pause work that is off screen (`useInView`, IntersectionObserver). The hero parallax loop sleeps once it settles; the liquid-metal shader parks when scrolled away.
- Do not add Framer Motion, GSAP or similar unless a need cannot be met with CSS and a few lines of JS.
- Images are served unoptimized (static export), so compress assets before adding them to `public/` (WebP for photos).

---

## 🌐 i18n & l10n Routing

- **Dynamic segment:** All localized pages and layouts must be nested inside [`src/app/[locale]/`](src/app/[locale]/).
- **Awaiting params:** Layout and Page `params` props are Promises in Next.js 15/16. Always `await params` and narrow with `hasLocale(routing.locales, locale)` before use.
- **Static Export:** Call `setRequestLocale(locale)` in layout and page server components, and export `generateStaticParams()` to support static HTML export (`output: 'export'`).
- **Navigation:** Never import `Link`, `useRouter`, or `usePathname` from standard `next/link` or `next/navigation`. Always import them from local configuration helpers in [`src/i18n/navigation.ts`](src/i18n/navigation.ts). In-page section links are plain `#anchor` hrefs (Lenis handles the smooth scroll).
- **Catalogs:** Every user-visible string goes in both `src/messages/en.json` and `src/messages/hi.json`. Keys are type-checked (`src/i18n/global.d.ts`), and `hi.json` must match the shape of `en.json` or `tsc` fails.

---

## 📦 Project Boundaries

- **Config Alias Map:** Turbopack and Webpack alias resolvers map `"next-intl/config"` to our local request setup inside [`next.config.ts`](next.config.ts) using `createNextIntlPlugin("./src/i18n/request.ts")`.
- **Branding Assets:** The official logo, favicon, icons, Open Graph image and style specifications reside inside [`public/brand/`](public/brand/) (see [`Brand.md`](public/brand/Brand.md)).
- **Machine-readable files:** `public/llms.txt`, `public/openapi.json`, `public/api/`, `public/.well-known/` and `src/app/api/info/route.ts` describe the project; keep them in sync when facts change.
