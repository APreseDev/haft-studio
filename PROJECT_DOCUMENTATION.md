# Haft Studio Website — Project Documentation

> Written from the actual source code of this repository. Items that could not be verified in the environment where the documentation was written are marked **Unverified**. The older Persian documents (`README.md`, `OWNER-CONTENT.md`, `DEPLOYMENT.md`, `PROJECT_STATUS.md`, `docs/QA-CHECKLIST.md`) remain the owner-facing guides; this file is the developer-facing reference and PRD.

## Table of contents

1. [Project overview](#1-project-overview)
2. [Technologies and dependencies](#2-technologies-and-dependencies)
3. [Architecture](#3-architecture)
4. [Folder and file structure](#4-folder-and-file-structure)
5. [Important files and folders](#5-important-files-and-folders)
6. [React components](#6-react-components)
7. [Component relationships](#7-component-relationships)
8. [CSS and styling](#8-css-and-styling)
9. [Scroll animations and interactions](#9-scroll-animations-and-interactions)
10. [Background number 7](#10-background-number-7)
11. [Cream section (marquee) performance](#11-cream-section-marquee-performance)
12. [Work Process section](#12-work-process-section)
13. [Logo implementation](#13-logo-implementation)
14. [Persian / English language system](#14-persian--english-language-system)
15. [RTL / LTR handling](#15-rtl--ltr-handling)
16. [Dark / Light mode](#16-dark--light-mode)
17. [Installation and setup](#17-installation-and-setup)
18. [Commands](#18-development-and-production-commands)
19. [Build and deployment](#19-build-and-deployment)
20. [Maintenance and future development](#20-maintenance-and-future-development)
21. [Known limitations and potential issues](#21-known-limitations-and-potential-issues)
22. [Product Requirements Document (PRD)](#22-product-requirements-document-prd)

---

## 1. Project overview

A single-page marketing website for **Haft Studio (هفت استودیو)**, a newly founded advertising and content studio. It presents the studio's services (web design, Instagram video/reels, page and content management, campaigns), a work-process section, a short brand statement, the team, and a contact form. The site is Persian-first (RTL) and also available in English (LTR). The visual language is a near-black page with cream text, a fixed Three.js background scene, GSAP scroll animations and Lenis smooth scrolling. A light theme is available in addition to the original dark look.

There is no backend. The contact form posts directly to the Web3Forms service, which forwards the message to the studio's e-mail.

## 2. Technologies and dependencies

From `package.json` (versions are the declared ranges):

| Package | Purpose |
| --- | --- |
| `react`, `react-dom` ^19.3.1 | UI |
| `gsap` ^3.15.0 | Animations and ScrollTrigger |
| `lenis` ^1.3.27 | Smooth scrolling |
| `three` ^0.187.0 | 3D background scene (+ `RoomEnvironment` and optional post-processing from `three/examples`) |
| `@fontsource/vazirmatn` ^5.3.0 | Self-hosted Persian font (weights 400, 700, 900; also used for Latin text) |
| `vite` ^8.3.5, `@vitejs/plugin-react` ^6.1.2 | Dev server and build |
| `eslint` ^10.13.0, `@eslint/js`, `eslint-plugin-react-hooks` ^7.1.1, `eslint-plugin-react-refresh`, `globals` | Linting |
| `@types/react`, `@types/react-dom` | Editor typings only (the project is plain JavaScript) |

Node: `^20.19.0 || >=22.12.0` (`engines`); `.nvmrc` pins `22`. External service: Web3Forms (`https://api.web3forms.com/submit`). No other runtime dependencies were added by the language/theme work.

## 3. Architecture

- **Single page, no router.** `src/main.jsx` mounts `<ThemeProvider><LangProvider><App/></LangProvider></ThemeProvider>`.
- **Sections** (`src/sections/*`) are self-contained: each owns its markup and, where needed, a `gsap.matchMedia()` block in `useLayoutEffect` that is only active under `prefers-reduced-motion: no-preference` and is reverted on unmount.
- **Content** is not in the components. Language-independent configuration lives in `src/data.js`; all translatable text lives in `src/i18n/fa.js` and `src/i18n/en.js`.
- **Global state** is limited to two React contexts: language (`src/i18n`) and theme (`src/theme`). Theme persists to `localStorage`; the language comes from the URL (`/` = Persian, `/en/` = English).
- **Background scene** is a lazily loaded `<Scene/>` (a fixed `<canvas>`) driven by `src/three/createScene.js`, outside the keyed `<main>` so it is not recreated when the language changes.
- **Styling** is one global stylesheet (`src/styles.css`) using CSS custom properties for colors and direction.
- **Build** is Vite; `scripts/postbuild.mjs` then generates domain-dependent SEO files.

## 4. Folder and file structure

```
.
├── index.html                  HTML shell, SEO/OG meta, noscript, language/theme bootstrap script
├── package.json, package-lock.json, vite.config.js, eslint.config.js, .nvmrc, .gitignore
├── README.md, OWNER-CONTENT.md, DEPLOYMENT.md, PROJECT_STATUS.md   (Persian owner docs)
├── PROJECT_DOCUMENTATION.md    this file
├── docs/QA-CHECKLIST.md        manual test checklist (Persian)
├── prompts/                    the phase prompts this work was executed from (README.md + phase-01..07)
├── scripts/postbuild.mjs       canonical / og:url / sitemap.xml / robots Sitemap line
├── .github/
│   ├── dependabot.yml
│   └── workflows/ci.yml, deploy.yml
├── public/
│   ├── logo-mark.png, logo-full.png, favicon.png   brand assets (see §13)
│   ├── favicon.svg             previous Vite default icon, no longer referenced by index.html
│   ├── 01.jpg, 02.jpg          team photos
│   ├── 404.html, robots.txt, _headers
├── src/
│   ├── main.jsx, App.jsx
│   ├── data.js                 language-independent config
│   ├── api.js, formUtils.js    contact form transport and helpers
│   ├── gsap.js, lenis.js       plugin registration / Lenis instance holder
│   ├── hooks.js, reveal.js     interaction hooks and scroll-reveal helpers
│   ├── styles.css
│   ├── components/             Cursor, Icons, Logo, Nav, Scene, StructuredData
│   ├── sections/               Hero, Marquee, Services, Work, Process, Manifesto, Team, Contact, Footer
│   ├── i18n/                   fa.js, en.js, locales.js, context.js, LangProvider.jsx, document.js, format.js
│   ├── theme/                  context.js, ThemeProvider.jsx
│   └── three/createScene.js
├── test/                       older snapshots (v0–v4, haft-studio-*) and zips from earlier work; not part of the build
└── seven-studio-ui-1.html      early static prototype; not part of the build
```

`node_modules/` and `dist/` are git-ignored.

## 5. Important files and folders

| Path | Role |
| --- | --- |
| `index.html` | Persian default `lang="fa" dir="rtl"`, title/description/Open Graph, favicon link, `<noscript>` text, and the inline **bootstrap script** (§14–16). |
| `src/data.js` | `ACCENT`, `ACCENT_LIGHT`, `siteUrl`, `ogImage`, `navHrefs`, `serviceIcons`, `contact` (phone, Instagram, e-mail), `formAccessKey`. `scripts/postbuild.mjs` imports this file for `siteUrl`/`ogImage`, so those exports must stay. |
| `src/i18n/*` | Translation dictionaries and the language provider (§14). |
| `src/theme/*` | Theme constants, storage and provider (§16). |
| `src/reveal.js` | Reusable scroll-reveal helpers: `fromStart`, `fromEnd`, `fromBottom`, `alternateSides`, `wipeUp`, `flipIn`, and `dirSign()`. |
| `src/hooks.js` | `prefersReduced()`, `isFinePointer()`, `useMagnetic()` (button pulled toward the pointer), `useTilt()` (card tilt). |
| `src/three/createScene.js` | Builds the background scene; returns `{ dispose, setTheme }`. |
| `src/api.js` | `sendContact()` → Web3Forms; never throws, returns `{ ok }` or `{ ok:false, reason }`. |
| `src/formUtils.js` | Digit normalisation (Persian/Arabic → Latin), phone cleaning/validation, international format for `tel:`. |
| `public/_headers` | Security headers incl. a **Report-Only** CSP whose `script-src` contains the SHA-256 of the inline bootstrap script. |
| `scripts/postbuild.mjs` | If `siteUrl` (or env `SITE_URL`) is a valid `https://` origin, writes canonical, `og:url`, `sitemap.xml` and the `Sitemap:` line; otherwise warns and exits 0. |

## 6. React components

**Shell**
- `App` — keeps the scene loading (lazy, on idle; skipped when `navigator.connection.saveData`), starts Lenis (unless reduced motion), runs the scroll-progress bar, refreshes ScrollTrigger on language change, renders everything. `<main key={lang}>` is remounted on language change so section animations are rebuilt with the correct direction.
- `Nav` — sticky header: logo, section links, CTA, **language button**, **theme button**, mobile menu toggle (closes on Escape). Becomes solid after 40 px of scroll.
- `Scene` — owns the `<canvas>`, falls back to a plain background if WebGL fails or `?noscene` is present; passes the current theme to the scene.
- `Cursor` — custom ring/dot, only for fine pointers without reduced motion.
- `Logo` — renders the logo PNG as a CSS mask (§13).
- `Icons` — inline SVG set (includes `sun`, `moon`, `arrow`, …).
- `StructuredData` — injects `Organization` JSON-LD from the current language and `data.js` contact info.

**Sections**: `Hero` (word-by-word title, pill, CTAs), `Marquee` (cream strip), `Services` (4 tilt cards), `Work` (project cards; placeholder titles in `[ ]` are hidden in production builds), `Process` (4 full-width steps), `Manifesto` (navy band, words light up on scroll), `Team`, `Contact` (form + contact list), `Footer` (full logo lockup + localized year).

## 7. Component relationships

```
main.jsx → ThemeProvider → LangProvider → App
App ├─ StructuredData (useLang)
    ├─ Scene (useTheme) → three/createScene.js
    ├─ Cursor, progress bar
    ├─ Nav (useLang, useTheme, Logo, data.navHrefs)
    ├─ <main key={lang}> Hero, Marquee, Services, Work, Process, Manifesto, Team, Contact
    └─ Footer (useLang, Logo)
Sections → useLang() for text/digits; reveal.js + gsap.js for animation; hooks.js for tilt/magnetic
Contact → api.js, formUtils.js, data.contact
```

Providers use the pattern "context in `context.js` (no components), provider component in its own file", which keeps `react-refresh/only-export-components` satisfied.

## 8. CSS and styling

`src/styles.css` is a single stylesheet. Key conventions:

- **Tokens on `:root`** — `--bg`, `--surface`, `--surface-2`, `--line`, `--line-strong`, `--fg`, `--muted`, `--accent`, `--on-accent`, plus channel triples `--bg-rgb`, `--card-rgb`, `--accent-rgb` (used as `rgba(var(--bg-rgb), .5)`), `--accent-hover`, `--cream` (constant, used by the navy band), `--work-from/--work-to`, `--error-border/--error-text`, and direction tokens `--start-origin`, `--marquee-shift`. Layout tokens: `--font`, `--gutter`, `--maxw`, `--nav-h`.
- **Themes** — the `:root` values are the dark (original) look; `:root[data-theme="light"]` overrides them. `html[dir="ltr"]` overrides direction tokens and sets `direction: ltr`.
- Sections clip their own horizontal overflow with `overflow-x: clip` (not `hidden`), so sticky positioning keeps working.
- `.scene` is a fixed full-viewport canvas at `z-index: 0`; `main`, nav, footer sit above it.
- Breakpoints in use: 420, 640, 720, 768 px (and a short-height rule for the hero). Reduced motion disables transitions and the marquee animation.
- Hard-coded colors outside `:root` should not be reintroduced; use tokens so both themes work.

## 9. Scroll animations and interactions

- **Lenis** smooth scroll (duration 0.9 s) is synchronised with ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, GSAP ticker drives `lenis.raf`). In-page `#hash` links are intercepted and scrolled with a −72 px offset.
- **Reveal helpers** (`reveal.js`, 0.8–0.9 s, transform/opacity only) start at `top 82%` of the trigger. `fromStart`/`fromEnd` choose the side from the page direction via `dirSign()` (`+1` RTL, `−1` LTR).
- **Hero**: intro timeline (pill, words, text, CTAs, scroll hint) and a scrubbed fade/rise of `.hero__inner` while the hero scrolls out.
- **Manifesto**: scrubbed per-word opacity `0.2 → 1`.
- **Process**: per-step scrubbed timelines (§12).
- **Work**: `wipeUp` card reveal; the large ghost numeral moves slower than its card (parallax).
- **Progress bar**: scales from the start side; rebuilt when direction changes.
- **Pointer effects**: `useTilt`, `useMagnetic`, `Cursor` — fine pointers only, disabled under reduced motion.
- **Reduced motion**: every GSAP block is inside `matchMedia('(prefers-reduced-motion: no-preference)')`; Lenis is not started; the 3D scene renders on scroll instead of in a loop.

## 10. Background number 7

The "7" is **not** a DOM/CSS element; it is a 3D extruded mesh (`seven`) plus a wireframe copy (`shell`) inside the hero group of the Three.js scene.

Scroll fade (added in this work), all inside `createScene.js`:

- `LOOK.fadeStart = 0.5` and `LOOK.fadeEnd = 1.1` are fractions of the hero height (`#top`, falling back to the viewport height). They are converted to pixels in `updateMax()`, which already runs on resize and body-size changes.
- Every frame, `applyFade(window.scrollY)` computes a smoothstep visibility, sets `seven` material opacity and `shell` material opacity (`base × visibility`), and sets `visible=false` on both when visibility ≈ 0 so they are not drawn. Because it is a pure function of `scrollY`, scrolling back up reverses it exactly. No React state or extra listeners are involved.
- The seven material is created with `transparent: true` from the start so the first fade does not trigger a shader recompile.
- `shellOff` stops the quality controller's "shell hidden" state from being undone by the fade.
- The orbit rings, floaters and particles are intentionally **not** faded.

Verified with a stubbed Three.js in Chromium (opacity 1 → 0 between scroll 400 and 880 px at an 800 px hero, exact reversal, no errors). **Unverified:** rendering with the real Three.js build.

## 11. Cream section (marquee) performance

The cream section is `.marquee` (`src/sections/Marquee.jsx`). Finding: the track is two identical rows translated by 50% for a seamless loop, but each row was only four short items (~1,100–1,300 px). On any viewport wider than a row, part of the bar was empty for part of every cycle (measured with the real CSS: up to ~770 px blank at 1920 px, blank from the start at 2560 px). That reads as the section "appearing late" on laptops and large screens.

Fix: each row now repeats the item list `REPEAT = 4` times, and the animation duration is `--marquee-duration: 120s` (four times the previous 30 s) so scroll speed is unchanged (measured 37.9 px/s before and after). Repeated copies are `aria-hidden`; only the first group is exposed to assistive technology. Measured uncovered width is 0 px for 390–3440 px viewports, in both languages. If `REPEAT` changes, update `--marquee-duration` proportionally.

**Unverified:** real-device frame rate/GPU behaviour and the real Vazirmatn text widths (a fallback font was used for measurement). If lag persists after this fix, the most likely remaining cost is the full-viewport WebGL canvas.

## 11b. Performance tuning (latest pass)

Symptoms reported: slow site, animations feel heavy. Causes found in the code, and what was changed:

| Area | Before | After |
| --- | --- | --- |
| 3D resolution | `devicePixelRatio` capped at 1.25 | capped at `LOOK.maxPixelRatio = 1` (~36% fewer pixels at 1440×900) |
| Bloom (several full-screen passes, ≥8-core devices) | on | off by default (`LOOK.bloom = false`) |
| Scene frame rate | ~60 fps all the time | `LOOK.fps = 60` while the 7 is visible; `LOOK.idleFps = 30` once the 7 has fully faded (rest of the page). Idle frames are excluded from the slow-device monitor, so this cannot trigger a false quality step-down (verified: loop stays alive when the page loads already scrolled down) |
| Scene objects | 14 floaters, 1200 particles | 10 floaters, 800 particles (`LOOK.floaters`, `LOOK.particles`; lite mode unchanged) |
| Card tilt / magnetic buttons | a new GSAP tween, a layout read and two style writes per pointer event | reusable `quickTo` setters, one layout read and one style write per animation frame (synthetic 300-event burst: 301→1 tweens, 300→1 layout reads, 600→2 style writes; real browsers already align mouse events to frames, so the real saving is smaller). Release no longer uses an elastic bounce |
| Scroll reveals | 1.1–1.2 s, 150 px travel, `clip-path` animation (repainted every frame), 80° flip with overshoot | 0.8–0.9 s, 90 px (32 px mobile), transform/opacity only, 50° flip, no overshoot |
| Hero intro | ~1.2 s words, 0.25 s delay | 0.9 s words, faster stagger, 0.1 s delay |
| Smooth scroll | Lenis duration 1.1 s | 0.9 s (less floaty); progress bar `scrub: true` instead of `0.2` |

All scene knobs live in the `LOOK` object at the top of `src/three/createScene.js`. To restore the previous richer look on strong hardware, set `maxPixelRatio: 1.25`, `bloom: true`, `idleFps: 60`.

Verification: scene frame rate and pixel ratio were measured with a stubbed Three.js in Chromium (60 fps → 30 fps after the hero, ratio 1 on a 2× display); event-cost counts were measured on the real hook code with a stubbed GSAP. **Unverified:** actual GPU frame times and subjective smoothness on real devices (no real Three.js/GSAP and no GPU in the authoring environment). If the site is still slow, test with `?noscene`; if that fixes it the 3D canvas is the remaining cost (try `?lite` or lower `LOOK.particles`/`floaters`).

## 12. Work Process section

`src/sections/Process.jsx` + `.steps/.step*` in `styles.css`.

- The section header stays inside `.wrap`; the four steps are rendered **outside** `.wrap` so each `.step` spans the full viewport width (measured equal to the viewport width from 320 to 2560 px, no horizontal overflow). Height is `clamp(340px, 68svh, 720px)` (`clamp(300px, 56svh, 520px)` ≤ 640 px). Inner content: large outlined numeral + title/text; stacks vertically ≤ 640 px.
- Animation: one scrubbed timeline per step (`start: 'top 80%'`, `end: 'bottom 20%'`): the step line draws, content fades/slides in from the reading-start side (`xPercent: 8 × dirSign()`), holds, then fades/slides out to the other side. Only opacity and transforms change; nothing is removed from the DOM. Reversible by construction. Only active without reduced motion; with reduced motion everything is simply visible.
- Numerals come from `num()` (Persian digits in Persian, Latin in English).

**Unverified:** the scroll animation itself was not executed (GSAP unavailable when written); layout was verified in Chromium with the real CSS.

## 13. Logo implementation

Source: the owner-supplied black-on-white image. Derived assets in `public/`:

- `logo-mark.png` (171×192) — the triangle mark only; used in the nav (40 px tall, 36 px ≤ 420 px).
- `logo-full.png` (212×288) — mark + "HAFT STUDIO" wordmark; used in the footer (104 px tall).
- `favicon.png` (128×128) — the mark in cream on the site's dark background; referenced by `index.html`. `index.html` and `public/404.html` both reference it. `favicon.svg` (the former Vite default icon) is no longer referenced but was not deleted.

The PNGs are transparent (alpha derived from the ink darkness; JPEG noise removed). `Logo.jsx` sets `--logo-src` and CSS (`.logo__img`) paints `background-color: var(--fg)` through `mask: var(--logo-src)`, so the artwork is cream in dark mode and near-black in light mode while keeping its exact aspect ratio. The asset URLs use `import.meta.env.BASE_URL`, so sub-path deployments work. The link/wrapper carries `aria-label` with the localized brand name.

Design choices to be aware of: the large "7" motifs that remain are intentional brand decoration, not the logo (the 3D background number, §10, and the faint ghost numeral behind work cards, rendered with `num(7)` in `Work.jsx`); the nav shows the mark only (the wordmark would be illegible at nav height); the footer uses the full lockup. No Open Graph image has been produced (`ogImage` in `data.js` is still empty).

## 14. Persian / English language system

- `src/i18n/locales.js` — registry: `fa` (`rtl`, "فارسی", `FA`) and `en` (`ltr`, "English", `EN`); `DEFAULT_LANG = 'fa'`; `langFromPath()` reads the language from the URL and `pathForLang(lang)` returns `/` or `/en/` (respecting `VITE_BASE`). The language switch in `Nav.jsx` is a real link to the other version whose label shows the language you will switch to ("English" on the Persian site, "فارسی" on the English site; "EN"/"FA" on narrow screens). A click switches client-side with `history.pushState`; back/forward is handled by a `popstate` listener in `LangProvider`.
- `src/i18n/fa.js` / `en.js` — dictionaries with identical structure: `brand`, `numerals`, `intl`, `meta`, `ui`, `nav`, `hero`, `marquee`, `services`, `work`, `process`, `manifesto`, `team`, `contact` (labels, options, errors, status), `footer`. Words wrapped in `*asterisks*` (hero title, manifesto) are rendered in the accent color via `parseAccentWords()`.
- `LangProvider` exposes `{ lang, dir, t, setLang, num }`; `useLang()` reads it. `setLang()` first updates the document (`applyLangToDocument`: `lang`, `dir`, `<title>`, description, `og:*`), stores the choice, then updates state.
- `num(n)` maps digits through the dictionary's `numerals`.
- `index.html` contains a small inline script that applies the stored language/theme **before first paint** (no flash). It must know the direction of each language (`{fa:'rtl', en:'ltr'}`). Its SHA-256 is whitelisted in the Report-Only CSP in `public/_headers`.
- Switching language remounts `<main>` (via `key={lang}`) and calls `ScrollTrigger.refresh()` on the next frame; the Nav, Scene and Footer persist.
- The contact `<select>` shows translated option text but **submits the Persian value** so e-mails to the team stay consistent. E-mail subject/sender in `api.js` stay Persian.
- Data that is not translated: phone, Instagram handle and e-mail (`data.js`); the phone number is rendered in `<bdi>`.

**Adding a language** — create `src/i18n/<code>.js` with the same keys, register it in `locales.js` (with `dir`), add its code/direction to the bootstrap script in `index.html` and recompute the CSP hash (below), and add language-specific CSS if needed (see the `html[lang="en"] .hero__title` rule for an example). The language button currently toggles between the two registered languages; with three or more it would need a menu.

**Recomputing the CSP hash** after editing the inline script: take the exact text between `<script>` and `</script>` in `index.html`, compute `base64(sha256(text))`, and replace the `'sha256-…'` token in `script-src` in `public/_headers`.

## 15. RTL / LTR handling

- `<html dir>` and `lang` are the source of truth. CSS: `html { direction: rtl }` plus `html[dir="ltr"] { direction: ltr }`.
- Layout uses flex/grid and logical properties, so the page mirrors naturally in LTR (logo and text on the left). Spacing, sizes and breakpoints are unchanged.
- Direction-dependent behaviours made explicit:
  - `--start-origin` (100% RTL / 0% LTR): transform origin for the scroll-progress bar and the step lines.
  - `--marquee-shift` (50% RTL / −50% LTR): marquee direction. Both verified gap-free.
  - `dirSign()` in `reveal.js`/`Process.jsx`: reveal sides.
  - `.work__ghost` uses `inset-inline-end`.
  - `html[dir="ltr"] .btn svg { transform: scaleX(-1) }` points arrows forward.
  - The phone input uses `dir={dir}`.
- `html[lang="en"] .hero__title` uses a smaller size because Latin glyphs are wider (the hero keeps the same footprint).
- GSAP caches `transform-origin`; because the progress bar persists across language changes, `App` sets its origin explicitly and rebuilds the tween when `dir` changes.

## 16. Dark / Light mode

- **The existing site was dark-only** (near-black `#0a0a0d`, cream text, `color-scheme: dark`). That look is preserved exactly as theme `dark` and remains the **default**; `light` is the new theme. (The system's `prefers-color-scheme` is deliberately not consulted so first-time visitors still see the original design. To follow the system instead, change `DEFAULT_THEME`/`readStoredTheme` in `src/theme/context.js` and the bootstrap script.)
- `ThemeProvider` stores the choice (`haft-theme`), sets `data-theme` on `<html>` and updates `<meta name="theme-color">` (`#0a0a0d` / `#f6f1e7`).
- Light palette: paper `#f6f1e7`, text `#1d1810`, muted `#5b513e`, accent bronze `#7a5c22`, on-accent `#fffaf0`. The navy statement band is intentionally identical in both themes (its emphasised words use the constant `--cream`).
- The 3D scene follows the theme without being recreated: `Scene` calls `handle.setTheme()`. In light mode the clear/fog color is the paper color, line/ring/particle color becomes `ACCENT_LIGHT`, particles switch from additive to normal blending, and bloom is disabled (bloom on a light background would glow the whole page). Bloom is not re-enabled when switching back to dark in the same session.
- `ACCENT`/`ACCENT_LIGHT` in `data.js` must match `--accent` in the dark/light CSS blocks.

**Unverified:** the real Three.js rendering in light mode (checked with a stub: clear color, fog, accent color and particle blending change and restore correctly).

## 17. Installation and setup

```bash
node -v          # must satisfy ^20.19.0 || >=22.12.0 (22 recommended, see .nvmrc)
npm ci
```

No environment variables are required. Optional: `VITE_BASE` (sub-path deployments, e.g. GitHub Pages) and `SITE_URL` (overrides `siteUrl` at build).

## 18. Development and production commands

| Command | Effect |
| --- | --- |
| `npm run dev` | Vite dev server (placeholder projects in `[ ]` are visible) |
| `npm run lint` | ESLint |
| `npm run build` | `vite build` then `scripts/postbuild.mjs` |
| `npm run preview` | Serve `dist/` locally (use this for final checks) |

Debug URL flags: `?noscene` (no 3D), `?lite` (light 3D).

## 19. Build and deployment

- `base` defaults to `/`; `VITE_BASE` sets a sub-path (used by `deploy.yml` for GitHub Pages).
- CI (`ci.yml`): `npm ci`, lint, build, non-blocking `npm audit` on pushes to non-`main` branches and PRs.
- Cloudflare Pages: build `npm run build`, output `dist`, Node from `.nvmrc`; do not set `VITE_BASE`. `public/_headers` supplies security headers. Full steps in `DEPLOYMENT.md`.
- After the domain is known, set `siteUrl` in `data.js` to enable canonical, `og:url`, `sitemap.xml` and the `Sitemap:` line.
- **Unverified:** no real deployment has been performed, and `npm ci`, `npm run lint` and `npm run build` have **not** been executed against the changes described here (no network access when they were made). Run them first.

## 20. Maintenance and future development

- Add or edit text in **both** dictionaries; keep keys identical. Persian digits in static strings (e.g. eyebrows) are written literally per language.
- New section: add the component under `src/sections`, read text from `useLang()`, add keys to both dictionaries, use `reveal.js` helpers (prefer `fromStart/fromEnd` over fixed sides), and use CSS tokens only.
- New project card: add the same object to `work.projects` in **both** dictionaries (`tag`, `title`, optional `hint`, `image`, `alt`). Images go in `public/projects/`.
- New team member: add to `team.members` in both dictionaries (optional `photo`).
- Changing the inline bootstrap script requires updating the CSP hash (§14).
- When the CSP has been observed clean on production, rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
- Before large dependency upgrades, rebuild and visually test the scene and ScrollTrigger sections.

## 21. Known limitations and potential issues

1. **Not built or linted in the authoring environment** (no network): run `npm ci && npm run lint && npm run build`. ESLint 10 with `react-hooks` 7 is strict; fix any warning in new files if reported.
2. **Real GSAP/Lenis/Three behaviour not exercised.** Layout, language/theme logic, direction handling and the 7-fade math were tested in Chromium with stubbed animation libraries; scroll animations and the real 3D render were not.
3. **Frozen frame on slow devices:** the scene's quality controller may stop the animation loop after repeated poor frame rates and keep the last frame as a static background. In that state nothing redraws on scroll, so the 7 will not fade (it stays as in the frozen frame). Bloom is also not re-enabled after being switched off.
4. **English static HTML** is produced at build time (see item 5); it was only tested against a fake `dist`, not a real `npm run build`.
5. **Per-language URLs:** `scripts/postbuild.mjs` generates `dist/en/index.html` (English `lang`/`dir`, title, description, OG tags, `<noscript>`) and, when `siteUrl` is set, canonical + `hreflang` (fa/en/x-default) in both pages and both URLs in `sitemap.xml`. Hosting must serve `/en/` as `en/index.html` (Cloudflare Pages and GitHub Pages do). The inline script in `index.html` picks `lang`/`dir` from the path; if you edit it, update its hash in `public/_headers`. `public/404.html` is still Persian only.
6. Team and project entries are placeholders ("Person One", `[Project one name]`, "Works in the team" is a literal translation of the Persian placeholder).
7. Form e-mails: subject and sender name are Persian; the service value is Persian; the visitor's language is not sent.
8. The light theme's 3D look has not been seen with the real renderer; a visual pass is recommended.
9. The CSP is report-only and the `style-src` still allows `'unsafe-inline'` (needed by inline `style` attributes such as the logo mask variable).
10. `public/favicon.svg`, `test/` and `seven-studio-ui-1.html` are unused leftovers.

---

## 22. Product Requirements Document (PRD)

### 22.1 Product overview
A bilingual (Persian/English), responsive, animated one-page website that introduces Haft Studio and converts visitors into contact-form enquiries.

### 22.2 Product goals
1. Present the studio's services and process clearly and memorably.
2. Let prospective clients reach the studio (form, phone, Instagram, e-mail).
3. Look premium without harming usability or performance.
4. Be maintainable by a small team without a backend.

### 22.3 Target users (as inferable from the content)
Persian-speaking companies and business owners wanting websites, Instagram video, page management and ad campaigns; secondary: English-speaking visitors.

### 22.4 Functional requirements
- FR1 Sections in order: hero, marquee, services, work, process, manifesto, team, contact, footer; sticky nav with section links and mobile menu.
- FR2 Contact form: name and phone required; phone validated (10–15 digits, optional `+`, Persian/Arabic digits accepted); service select; message; anti-spam honeypot; double-submit lock; online/offline and server-error messages; sent to Web3Forms.
- FR3 Language switch (FA/EN) available in the nav; choice persists across reloads and in-page navigation.
- FR4 Theme switch (dark/light) available in the nav; choice persists; the 3D background follows.
- FR5 Background "7" fades out smoothly as the hero scrolls away and returns when scrolling back.
- FR6 Work Process shows four full-width steps that animate in and out with scroll, reversibly.
- FR7 Marquee strip always fills the viewport width.
- FR8 Logo (nav, footer, favicon) uses the supplied artwork.
- FR9 Work section hides placeholder projects in production and shows an "added soon" message when none are real.
- FR10 SEO: title/description/OG, JSON-LD Organization, optional canonical/sitemap after `siteUrl` is set.

### 22.5 Non-functional requirements
Static hosting only; no secrets in the repo (the Web3Forms key is public by design); graceful degradation without WebGL, without JS animations (reduced motion), and with storage disabled; security headers via `_headers`.

### 22.6 Performance requirements
- The Three.js scene loads lazily after first paint and is skipped under data-saver; lite mode on ≤768 px or ≤4 cores; pixel ratio capped at 1; 60 fps cap while the 7 is visible and 30 fps after the hero; automatic quality step-down; bloom is off by default (`LOOK.bloom`) and, if enabled, only for ≥8 cores, non-lite, dark theme (see §11b).
- Marquee and step animations use transforms/opacity only.
- Scroll-driven fade must not add React re-renders or listeners.
- Targets are not numerically specified in the repository (**no Lighthouse/FPS target is defined**); `docs/QA-CHECKLIST.md` asks for a mobile Lighthouse run.

### 22.7 Responsive design requirements
Works without horizontal scroll from 320 px to ultra-wide; nav stays a single row at 320–390 px including the language and theme buttons; Process steps full-width at every size; hero fits the first screen in both languages (verified at 390, 768, 1440, 1920 px widths).

### 22.8 Accessibility requirements
Skip link; semantic landmarks and heading order; `aria-label`s on icon buttons, logo and nav; translated labels; `aria-hidden` on decorative/duplicated content; `role="status"` form messages with `aria-invalid`; keyboard-operable menu (Escape closes); visible focus ring; `prefers-reduced-motion` respected; text contrast: manifesto 11.3:1 and 12.2:1, other contrast was **not** systematically audited in either theme.

### 22.9 Language requirements
Persian (default, RTL) and English (LTR) with complete translations of all visible UI text; localized digits, year, title and meta; no Persian text visible in English mode except the contact phone number (verified programmatically); layout mirrors without rearranging components beyond direction.

### 22.10 Dark mode requirements
Original dark look unchanged and default; a visually consistent light theme; instant, flash-free application of the stored theme; 3D scene, logo, forms and the navy band readable in both themes; browser UI color (`theme-color`) follows.

### 22.11 Acceptance criteria
1. `npm ci`, `npm run lint`, `npm run build` pass.
2. In both languages and both themes: no console errors, no horizontal overflow at 320/390/768/1440/1920 px.
3. Scrolling past the hero fades the 7 out; scrolling back restores it.
4. The cream marquee has no empty gap at 1366, 1920, 2560 px.
5. Each Process step is full-width, animates in/out, and reverses on scroll-up.
6. Reloading keeps language and theme with no visible flash.
7. Logo appears in nav, footer and tab icon, undistorted, in both themes.
8. Form validation/sending behaves as in FR2 in both languages.
9. `docs/QA-CHECKLIST.md` completed on the preview build.

### 22.12 Project constraints
Static front-end only; no new dependencies for language/theme; keep the React/Vite architecture; Web3Forms for mail; fixed Vazirmatn font; hosting target Cloudflare Pages or GitHub Pages; content supplied by the owner (portfolio, team photos, domain).

### 22.13 Features outside the current scope
Backend/CMS, blog, per-language URLs and `hreflang`, more than two languages, an automatic OS-theme mode, an Open Graph image, privacy-policy page, testimonials, analytics, form CAPTCHA, server-side rendering/prerendering.
