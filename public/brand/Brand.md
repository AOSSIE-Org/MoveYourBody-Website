# MoveYourBody Brand Guidelines

This document details the visual identity of the **MoveYourBody** website under the parent **AOSSIE** organization. The app's own guidelines live in the app repository's [`brand/brand.md`](https://github.com/AOSSIE-Org/MoveYourBody/blob/main/brand/brand.md).

---

## 🎨 MoveYourBody Color Palette (Extracted from Logo)

| Color Name | Color Sample | HEX Code | RGB Code | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Golden Spark** | 🟡 | `#FFCD00` | `rgb(255, 205, 0)` | Primary highlight (dark theme accent, CTAs) |
| **Vibrant Fitness Green** | 🟢 | `#00843D` | `rgb(0, 132, 61)` | Secondary brand colour (light theme accent, CTAs) |
| **Deep Forest Green** | 🌲 | `#02542D` | `rgb(2, 84, 45)` | Deep base, hover states & shadows |
| **Night Forest** | ⬛ | `#0D1F15` | `rgb(13, 31, 21)` | Dark theme page background |
| **Warm Neutral Light** | ⬜ | `#F4F7F2` | `rgb(244, 247, 242)` | Light theme page background |

### Semantic tokens

Components never use these hex values directly. They use the semantic tokens defined in [`src/app/[locale]/globals.css`](../../src/app/[locale]/globals.css), which switch between themes:

| Token (Tailwind class) | Light | Dark | Use |
| :--- | :--- | :--- | :--- |
| `highlight` (`text-highlight`) | `#00843D` | `#FFCD00` | Headline accent words, active states, icons |
| `highlight-contrast` | `#FFFFFF` | `#0D1F15` | Text on a `highlight` fill |
| `surface` / `surface-raised` | translucent white / `#FFFFFF` | translucent white / `#14281C` | Cards and inset panels |
| `section-alt` | `#EBF1E7` | `#0A1911` | Alternating section background |
| `foreground-primary` … `foreground-faint` | `#1B1E18` at 100/85/65/40% | `#FFFFFF` at 100/85/65/45% | Text hierarchy |
| `danger` | `#C2410C` | `#FB923C` | "Excluded" states in the safety demo |

### App mockup palette

The phone mockups mirror the Flutter app, which always uses its dark theme, so these `app-*` tokens do not switch with the site theme:

| Token | HEX | App role |
| :--- | :--- | :--- |
| `app-bg` | `#0A1A0A` | Background |
| `app-surface` | `#122412` | Surface |
| `app-card` / `app-card-selected` | `#1A2E1A` / `#254025` | Cards |
| `app-primary` / `app-primary-light` | `#4CAF50` / `#81C784` | Primary green |
| `app-border` / `app-divider` | `#2E7D32` / `#1B3A1B` | Structure |
| `app-text-secondary` | `#B0BEC5` | Secondary text |

---

## 👁️ Visual Assets

### 1. Official MoveYourBody Logo

- **Branding Asset:** [MoveYourBody_logo.svg](icons/MoveYourBody_logo.svg)
- **Web App Asset Path:** `/brand/icons/MoveYourBody_logo.svg`

### 2. Icons

| Asset | Path | Use |
| :--- | :--- | :--- |
| Favicon (16/32/48 px) | `/brand/icons/favicon.ico` (copied to `/favicon.ico`) | Browser tab |
| Apple touch icon (180 px) | `/brand/icons/apple-touch-icon.png` | iOS home screen |
| App icons (192/512 px) | `/brand/icons/icon-192.png`, `/brand/icons/icon-512.png` | Web manifest |

### 3. Imagery & effects

| Asset | Path | Notes |
| :--- | :--- | :--- |
| Social share card | `/brand/og-image.jpg` | 1200×630, used for Open Graph and X cards |
| Hero model | `/brand/assets/hero-model.webp` | 1036×1518 WebP with transparency (~110 KB) |
| Liquid-metal download button | `src/components/ui/LiquidMetalButton.tsx` | Reusable WebGL2 component with dispersion shader, chromatic rim lighting, interactive press ripples, trailing cursor well, and bloom; pauses when scrolled off screen |

### 4. Organization Assets

- **AOSSIE Logo:** `/brand/icons/aossie_logo.svg`
- **Stability Nexus Logo:** `/brand/icons/stability_nexus_logo.svg`

---

## ✍️ Typography

- **Default Font Family:** **Lexend** (self-hosted variable font, weights 100–900)
- **Hindi:** **Noto Sans Devanagari** leads on `/hi` pages. Letter-spacing is never applied to Devanagari.
- **Fallback Stack:** `ui-sans-serif, system-ui, sans-serif`
- **Headlines:** light weight (300), tight tracking, with one accent phrase in `highlight` at weight 400.
- **Labels / eyebrows:** 10 px, semibold, uppercase, `0.2em` tracking (Latin scripts only).

---

## 🌀 Motion

- One easing family: `--ease-fluid` for entrances, `--ease-spring` for hover lifts, `--ease-smooth` for loops.
- Entrances rise and fade in; nothing slides in from the sides.
- Every loop is `motion-safe:` only and animates transform or opacity alone.
