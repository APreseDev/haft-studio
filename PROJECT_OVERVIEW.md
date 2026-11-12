# Haft Studio — Project Overview

Website for a digital studio: bilingual (Persian right-to-left and English), with a 3D background, scroll animations, dark/light mode and a contact form. The code is written in **JavaScript + React** (no TypeScript).

Persian version: [PROJECT_OVERVIEW.fa.md](PROJECT_OVERVIEW.fa.md)

## 1. Technologies

| Technology | Purpose |
| --- | --- |
| React 19 | UI |
| Vite 8 | Dev server and build |
| GSAP + ScrollTrigger | Scroll animations |
| Three.js | 3D background scene (lazy-loaded) |
| Lenis | Smooth scrolling |
| Vazirmatn (Fontsource) | Persian font |
| Web3Forms | Delivers contact-form messages to email |

Commands: `npm ci` install, `npm run dev` dev server, `npm run lint` lint, `npm run build` production build (Vite, then `scripts/postbuild.mjs`).

## 2. Folder structure

```
haft/
├── index.html            Base page + splash (intro logo) + tiny script that sets language/theme before React
├── vite.config.js        Vite config (base URL from VITE_BASE)
├── eslint.config.js      Lint rules
├── package.json          Dependencies and scripts
├── public/               Static files (see section 2b)
├── scripts/postbuild.mjs Builds a separate HTML file per language/page, plus sitemap and robots after the build
├── src/                  Application code (explained below)
├── docs/QA-CHECKLIST.md  Manual test checklist
├── .github/workflows/    ci.yml (lint + build) and deploy.yml (publishing)
└── *.md                  Documentation (README, DEPLOYMENT, OWNER-CONTENT, PROJECT_OVERVIEW)
```

### 2b. The `public/` folder

| File | Purpose |
| --- | --- |
| `logo-mark.png`, `logo-full.png` | Logo (triangle only / triangle + text); colored with a CSS mask |
| `favicon.png`, `apple-touch-icon.png` | Browser tab icon and iOS home-screen icon |
| `og.png` | 1200×630 link-preview image (PNG on purpose; set in `ogImage` in `data.js`, used once `siteUrl` is set) |
| `team/*.webp` | Team photos |
| `products/<project>/*.webp` | Project images (referenced from `database.js`) |
| `robots.txt`, `404.html`, `_headers` | Crawler rules, not-found page, security/cache headers |

Photos use WebP for smaller size. Logos and icons stay PNG (CSS mask, iOS and link previews need PNG).

## 3. The `src/` folder

### Entry point and overall structure
- **`main.jsx`**: applies language and theme before first paint, starts the splash, and renders the app as `ThemeProvider ← RouterProvider ← LangProvider ← App`.
- **`App.jsx`**: the page layout. Lazy 3D scene, Cursor, scroll progress bar, Nav, page content (based on `route.page`) and Footer. It also manages Lenis smooth scrolling and `ScrollTrigger.refresh`.
- **`splash.js`**: timing for the intro logo to leave (minimum 2.4 s, maximum 4.5 s).

### Data
- **`database.js`**: the "mock database". Projects, team members, services, process steps and marquee phrases, each text written as `{ fa, en }`. Edit only this file to add content.
- **`data.js`**: language-independent settings: accent colors, `siteUrl`, `ogImage`, menu links, contact details (`phone1` is the main number, `phone2` the backup; each has its own call link), Web3Forms key.
- **`projects.js`**: `getProjects()` builds the project list for one language (automatic slugs, placeholders removed). Used by both the site and postbuild.
- **`useProjects.js`**: React hook wrapping the above for the current language.

### Internationalization (`i18n/`)
- **`fa.js` / `en.js`**: fixed site texts (headings, form, menu, etc.).
- **`locales.js`**: language list (direction, label, dictionary) and `isLang`.
- **`LangProvider.jsx` + `context.js`**: `useLang()` returns `lang`, `dir`, `translations`, `setLang` and `num`. The language comes from the URL (`/` Persian, `/en/` English).
- **`localizeData.js`**: converts `{fa, en}` data into a single language's text.
- **`document.js`**: sets `lang`, `dir`, `<title>`, og meta, canonical and hreflang.
- **`format.js`**: Persian/Latin digits and splitting of *starred* words (for the accent color).

### Routing and theme
- **`routes.js`**: builds and parses URLs (`/`, `/works/`, `/works/<slug>/` and their `/en/` versions).
- **`router/RouterProvider.jsx` + `context.js`**: lightweight router with no extra library; `useRouter()` returns `pathname`, `route` and `navigate`. Internal links are real links but open without a full reload.
- **`theme/ThemeProvider.jsx` + `context.js`**: dark/light mode, stored in localStorage, `useTheme()`.

### Pages and sections
- **`pages/`**: `WorksPage.jsx` (all projects with a category filter) and `ProjectPage.jsx` (single project details).
- **`sections/`** (home page, in order): `Hero`, `Marquee`, `Services`, `Work`, `Process`, `Manifesto`, `Team`, `Contact`, and `Footer`.

### Components (`components/`)
`Nav` (menu, language and theme switch), `Scene` (3D canvas), `Cursor` (custom mouse cursor), `ProjectCard`, `Icons`, `Logo`, `StructuredData` (Organization structured data for SEO).

### 3D scene (`three/`)
- **`createScene.js`**: metallic 3D logo, rings, floating shapes and particles. It reacts to scroll and mouse, and automatically lowers quality on slow devices. It returns `{ dispose, setTheme }`.
- **`logoShapes.js`**: the point lists for each logo piece.

### Helpers
- **`hooks.js`**: `useMagnetic` (button pulled toward the mouse), `useTilt` (card tilt), `prefersReduced`, `isFinePointer`.
- **`reveal.js`**: scroll entrance animations (`fromStart`, `fromEnd`, `fromBottom`, `flipIn`, `wipeUp`, `alternateSides`).
- **`gsap.js`** and **`lenis.js`**: GSAP setup and the shared Lenis instance.
- **`api.js`**: `sendContact()` posts the form to Web3Forms and never throws (returns `{ ok }` or `{ ok: false, reason }`).
- **`formUtils.js`**: Persian/Arabic digit conversion, phone cleaning and validation, international format.
- **`usePageMeta.js`**: title and description for inner pages.
- **`styles.css`**: all styles (about 1,360 lines), including the dark/light color variables.

## 4. How the app runs

1. The browser opens `index.html`; the splash and the tiny early script immediately put the language and theme on `<html>`.
2. `main.jsx` boots the app. `RouterProvider` reads the URL and `LangProvider` takes the language from `route.lang`.
3. `App` shows a page based on `route.page` (`home`, `works` or `project`). When language or page changes, the content is rebuilt through a `key` so animations are created fresh.
4. Each section gets its text from `useLang().translations` and builds its animations inside `gsap.matchMedia()` so they do not run for users who prefer reduced motion.
5. When the browser is idle, `Scene.jsx` downloads and starts the 3D scene (skipped if the user enabled "data saver").
6. The 3D scene fails silently: if WebGL or the bloom bundle is unavailable, the site falls back to a plain background without console output.
7. Contact form: `Contact.jsx` validates input, sends it with `sendContact` and shows the status. A hidden `botcheck` field blocks bots.

## 5. Build and deployment

- `vite build` produces the main bundle; then **`scripts/postbuild.mjs`** creates a separate `index.html` for each language and page (good for SEO and static hosts). If `siteUrl` is set, it also generates canonical, hreflang, `sitemap.xml` and the Sitemap line in `robots.txt`.
- Publishing uses GitHub Actions (CI) and Cloudflare Pages; see `DEPLOYMENT.md`. Security headers are in `public/_headers`.

## 6. Common tasks

| I want to... | Where to change it |
| --- | --- |
| Add a project, team member, service or process step | `src/database.js` |
| Change heading, form or menu texts | `src/i18n/fa.js` and `en.js` |
| Change phone, email, Instagram or domain | `src/data.js` |
| Change the accent color | `ACCENT` and `ACCENT_LIGHT` in `data.js`, and `--accent` in `styles.css` |
| Tune the look or speed of the 3D scene | the `LOOK` object at the top of `three/createScene.js` |
| Add a new language | a new texts file + register it in `locales.js` (and the `index.html` script and `postbuild.mjs`) |
| Add a project image | folder `public/products/<name>/` and its path in `database.js` |

## 7. The `index.html` script hash

The tiny script inside `index.html` (sets language and theme before React) is allowed in the security policy in `public/_headers` by its SHA-256 hash. If you change the script's text, recompute the hash and put it in the `script-src` part of `public/_headers`. (The current hash matches the renamed version of the script.)

## 8. Other project documents

`README.md` (quick start), `DEPLOYMENT.md` (publishing and domain), `OWNER-CONTENT.md` (information needed from the site owner) and `docs/QA-CHECKLIST.md` (manual test checklist).
