# AI Context — `i-am-zain` Portfolio

**Audience**: any future AI coding assistant or engineer working on this repo. Read this file first. It captures the intent, architecture, and rules that aren't obvious from the code.

## 1. What this repo is

A personal research portfolio for **Md Zainul Ali** (Doctoral Research Scholar, Computational Neuroscience & Bioinformatics, University of Hyderabad). It is:

- **Static.** No backend, no database, no framework runtime.
- **JSON-driven.** Every word the visitor sees (except UI labels) comes from `data.json` at repo root. The non-technical client edits that one file to update the site.
- **Netlify-hosted** at `i-am-zain.netlify.app`. Auto-deploys on push to `main`.
- **Built for longevity.** Plain HTML5 + modern CSS + vanilla ES modules. No build step for dev. No bundler. No framework churn. When the client is still using this site in 2040, nothing is going to have broken.

## 2. Stack and why

| Layer      | Choice                           | Rationale                                                       |
| ---------- | -------------------------------- | --------------------------------------------------------------- |
| HTML       | Plain HTML5                      | Backward-compatible forever. Landmarks + skip-link.             |
| CSS        | Pure CSS with cascade `@layer`s  | No preprocessor. All tokens in `styles/tokens.css`. Zero `!important`. |
| JS         | Native ES modules (`type="module"`) | Deferred by spec. No bundler. Browser target is evergreen-12-months. |
| Icons      | Lucide SVG sprite                | MIT, stroke-consistent, one HTTP request. See §8.               |
| Hosting    | Netlify                          | Static publish, auto-SSL, forms, CDN. `publish = "."`.          |
| Build tool | Only `node scripts/*.mjs`        | `validate-data.mjs` (asset presence), `build-icons.mjs` (sprite). |
| Fonts      | Google Fonts (Inter + JetBrains Mono) | `preconnect` + `display=swap`. See §14 for self-host option.   |

**Rejected**: React/Vue/Svelte/Next/Astro/Vite/Webpack/Tailwind. Framework and bundler churn is the single biggest threat to longevity. For ~12 static sections the component-tree benefit doesn't pay for itself. Anyone considering changing this should first prove the current approach is failing — don't re-platform out of preference.

## 3. Project layout

```
i-am-zain/
├── index.html                  # Single entry point — semantic section shells
├── data.json                   # ALL content. Client edits this.
├── netlify.toml                # publish=".", cache headers, security (HSTS/CSP)
├── _redirects                  # SPA fallback + /resume alias
├── package.json                # Dev-only deps: live-server, lucide-static
│
├── styles/
│   ├── main.css                # ONLY file linked from index.html (imports the rest)
│   ├── tokens.css              # ⭐ Single source of design truth
│   ├── reset.css               # Modern minimal reset
│   ├── base.css                # html/body/typography defaults
│   ├── layout.css              # .container .section .grid .cluster etc.
│   ├── utilities.css           # .visually-hidden .skip-link .text-gradient .reveal
│   ├── print.css               # Resume-style print view
│   ├── components/             # One file per reusable component
│   │   ├── button.css          # Canonical state pattern (other components copy)
│   │   ├── card.css carousel.css chip.css badge.css input.css
│   │   ├── icon.css nav.css timeline.css theme-toggle.css
│   └── sections/               # Per-section composition (no new primitives)
│       └── hero.css about.css milestones.css experience.css projects.css
│          conferences.css articles.css testimonials.css writing.css
│          certifications.css contact.css footer.css
│
├── js/
│   ├── main.js                 # Boot: loadData → applyTheme → render each section
│   ├── data.js                 # fetch('/data.json'), validate, normalize (back-compat)
│   ├── dom.js                  # el(tag, attrs, children) helper. No innerHTML.
│   ├── icon.js                 # icon(name, {size,label}) → <svg><use href="sprite#name"/></svg>
│   ├── render/                 # One file per section — reads normalized data → DOM
│   │   └── meta.js hero.js about.js milestones.js experience.js projects.js
│   │      conferences.js articles.js testimonials.js writing.js
│   │      certifications.js contact.js footer.js
│   ├── components/
│   │   ├── nav.js              # Sticky nav + scroll-spy + mobile drawer
│   │   ├── theme-toggle.js     # system/light/dark persisted to localStorage
│   │   ├── reveal.js           # IntersectionObserver .reveal → .is-visible
│   │   ├── carousel.js         # Scroll-snap + keyboard + dots
│   │   └── form.js             # Netlify Forms submit + honeypot
│   └── utils/
│       ├── paths.js            # asset(path) — ONE path normalizer (see §7)
│       ├── format.js           # formatDate/Year, dateSortKey
│       └── validate.js         # Runtime required-field check
│
├── scripts/
│   ├── build-icons.mjs         # Build /icons/sprite.svg from lucide-static
│   └── validate-data.mjs       # Build-time: required fields + asset existence
│
├── images/                     # Single image folder
│   ├── profile/ projects/ conferences/ workshops/ articles/ testimonials/
├── documents/zain-resume.pdf
├── icons/sprite.svg            # Built — commit to repo
├── favicon/
└── (legacy) src/ public/       # OLD site — safe to delete after v2 verification
```

## 4. Data flow

```
┌──────────┐    fetch     ┌───────────┐    normalize    ┌──────────────┐
│ data.json│ ───────────▶ │  data.js  │ ──────────────▶ │ main.js      │
└──────────┘              └───────────┘                 │ (orchestrator)│
                                                         └──────┬───────┘
                                                                │ for each section
                                                                ▼
                                                         ┌──────────────┐    dom.js el()    ┌────┐
                                                         │ render/*.js  │ ────────────────▶ │DOM │
                                                         └──────────────┘                   └────┘
                                                                │
                                                    ┌───────────┴──────────┐
                                                    ▼                      ▼
                                             components/nav, carousel, theme-toggle, reveal, form
                                             (post-render interaction wiring)
```

**Key invariant**: `data.js` normalizes the JSON shape so renderers always see the same structure. If the client edits `data.json` with an older-shape value (e.g. a bare string where an object is expected), the normalizer converts it. This means **the site keeps working across schema evolutions** — old content doesn't break when the schema is refined.

## 5. `data.json` schema

The JSON is the source of truth the non-technical client will maintain for years. Schema (all fields optional unless marked `[required]`):

```jsonc
{
  "theme":   { "defaultMode": "dark"|"light", "accent": "#..."|null, "accent2": "#..."|null },
  "meta":    { "lastUpdated": "YYYY-MM-DD", "version": "..." },

  "personal": {                                          // [required]
    "name":      "string",                               // [required]
    "title":     "string",                               // [required]
    "tagline":   "string",
    "location":  "string",
    "email":     "string",                               // [required]
    "phone":     "string",
    "website":   "https://...",
    "profileImages": [{ "src": "/images/...", "alt": "...", "width": 1200, "height": 1600 }],
    "resumeUrl": "/documents/..."
  },

  "now":     { "text": "Current focus...", "asOf": "YYYY-MM-DD" },
  "summary": "Long bio paragraph.",                      // [required]

  "education": [{ "institution", "degree", "graduationYear", "gpa", "relevantCoursework": [] }],

  "skills": {
    "technical": { "programming": [], "backend": [], "tools": [], "concepts": [] },
    "soft": []
  },

  "milestones": [{
    "id": "m1",
    "date": "YYYY-MM"|"YYYY-MM-DD",
    "title": "...",
    "description": "...",
    "kind": "education"|"research"|"growth"|"recognition",
    "icon": "graduation-cap"|"award"|"microscope"|"mic"|"sparkles"|...
  }],

  "experience": [{
    "id", "company", "position", "duration", "location", "description",
    "achievements": [], "technologies": []
  }],

  "projects": [{
    "id", "title", "subtitle", "description",
    "image": { "src", "alt", "width", "height" },
    "technologies": [], "features": [],
    "links": [{ "label", "url", "kind": "github"|"external"|"paper"|"demo" }],
    "status": "active"|"completed"|"archived"|"draft",
    "year": "2023 — 2025"
  }],

  "social": { "github", "linkedin", "twitter", "researchgate", "orcid", "scholar" },

  "contact": {
    "availability", "preferredContact", "responseTime", "timezone",
    "form": { "enabled": true, "honeypot": true, "successMsg", "errorMsg" }
  },

  "conferences": [{ "id", "title", "description", "location", "date", "presentationType": "oral"|"poster", "image": {...} }],
  "workshops":   [{ "id", "title", "description", "location", "date", "mode": "online"|"offline", "image": {...} }],

  // One flat array. `type` groups the entry into its carousel.
  "articles": [{
    "id", "type": "research"|"review"|"bookChapter"|"abstract",
    "title", "summary", "year", "url",
    "venue": "Journal/Conference/Publisher",
    "impactFactor", "authorship", "publicationDate",
    "image": {...}
  }],

  "testimonials": [{ "id", "quote", "author", "role", "affiliation", "relationship", "avatar": {...} }],
  "writing":      [{ "id", "title", "date", "excerpt", "url", "kind": "external"|"internal", "tags": [] }],
  "certifications": [{ "id", "title", "year", "type": "Workshop"|"Internship", "issuer" }],

  "sections": {
    "order":  ["hero","about","milestones","experience","projects","conferences","articles","testimonials","writing","certifications","contact"],
    "hidden": []
  },
  "sectionOverrides": { "articles": { "title": "Publications" } },

  "seo": { "metaTitle", "metaDescription", "keywords": [], "ogImage": "/images/og.jpg" }
}
```

**Which renderer consumes which key:**

| data.json key        | Renderer                        | Notes                                           |
| -------------------- | ------------------------------- | ----------------------------------------------- |
| `seo`, `personal`, `social`, `summary` | `render/meta.js`  | Sets `<title>`, meta tags, JSON-LD Person.      |
| `personal`, `now`, `social`            | `render/hero.js`  | Hero + Now chip + primary CTAs + social icons.  |
| `summary`, `education`, `skills`       | `render/about.js` | Bio + education list + skills clusters.         |
| `milestones`                           | `render/milestones.js` | Sorted by `date` ascending. Hidden if empty.|
| `experience`                           | `render/experience.js` | Timeline. First item styled as current.     |
| `projects`                             | `render/projects.js`   | 3-col grid. Status → badge color.           |
| `conferences` + `workshops`            | `render/conferences.js` | Two carousels in one section.              |
| `articles`                             | `render/articles.js`    | Grouped by `type`, one carousel per group. |
| `testimonials`                         | `render/testimonials.js`| Grid. Auto-hides if empty.                 |
| `writing`                              | `render/writing.js`     | Year-grouped list. Auto-hides if empty.    |
| `certifications`                       | `render/certifications.js` | Year-grouped list.                      |
| `personal`, `contact`, `social`        | `render/contact.js`     | Info card + Netlify form.                  |
| `personal`, `social`, `meta`           | `render/footer.js`      | Footer.                                    |

## 6. Path strategy (⚠ single most important rule)

**All asset paths are root-absolute, starting with `/`.** No exceptions.

```
✅  /images/profile/profile_01.jpg
✅  /documents/zain-resume.pdf
✅  /icons/sprite.svg
❌  ./images/profile/profile_01.jpg    (broken on some Netlify routes)
❌  /public/images/profile_01.jpg      (the legacy bug — /public/ is not deployed)
❌  images/profile_01.jpg              (relative, breaks in nested routes)
```

Why this works identically locally and on Netlify:

| Env     | Serve command       | `/images/x.jpg` resolves to                |
| ------- | ------------------- | ------------------------------------------ |
| Local   | `live-server .`     | `./images/x.jpg` on disk                   |
| Netlify | `publish = "."`     | `<deploy-url>/images/x.jpg`                |

`js/utils/paths.js` exposes `asset(path)` which normalizes any form ( `"images/x"` → `"/images/x"`, passthrough for `http(s)://` ), so even if the client accidentally drops the leading slash, it still works.

## 7. Design system

### Token layers (`styles/tokens.css`)

```
primitives  →  --gray-*, --brand-*, --brand2-*, --success/warning/danger/info-500
semantic    →  --surface-page/card/elevated, --text-primary/secondary/muted/disabled,
               --border-subtle/default/strong/accent, --accent, --accent-2, --gradient-brand,
               --focus-ring, --shadow-xs/sm/md/lg/glow
component   →  scoped via `--_bg`, `--_fg`, `--_border` inside component rules
```

- Components reference **semantic** tokens only.
- Sections reference semantic tokens and compose components — no new color primitives.
- Theme switch (`[data-theme="light"]`) redefines semantic tokens only; component rules are untouched.

### Interaction states (canonical pattern — `styles/components/button.css`)

Every interactive component implements: `default`, `:hover:not(:disabled)`, `:active:not(:disabled)`, `:focus-visible`, `:disabled` / `[aria-disabled="true"]`, `[aria-busy="true"]`.

If you add a new interactive component, copy the state block from `button.css` and only adjust the tokens — not the structure.

### Contrast (verified at token-definition time)

| Pair                             | Dark    | Light   | WCAG        |
| -------------------------------- | ------- | ------- | ----------- |
| `--text-primary` / page          | ≥ 16:1  | ≥ 14:1  | AAA body    |
| `--text-secondary` / page        | ≥ 9:1   | ≥ 8:1   | AAA body    |
| `--text-muted` / page            | ≥ 4.8:1 | ≥ 4.6:1 | AA body     |
| `--accent` / page                | ≥ 5:1   | ≥ 5:1   | AA UI text  |
| `--text-on-brand` / `--brand-500`| ≥ 8:1   | ≥ 8:1   | AAA button  |
| Focus ring / adjacent            | ≥ 3:1   | ≥ 3:1   | AA non-text |

Any new color choice must be verified against this table. Use OKLCH lightness as the contrast proxy — `oklch()` values with the same L% match the ramp we built.

### Component library

Every styled element is one of these. New UI ideas should extend an existing component first:

- `Button` — `.btn .btn--primary/secondary/ghost/icon/link .btn--sm/lg`
- `Card` — `.card .card--compact .card--feature` with `.card__media/eyebrow/title/subtitle/body/meta/footer`
- `Chip` — `.chip .chip--accent .chip--solid` for tags/skills
- `Badge` — `.badge .badge--success/warning/danger/info/accent .badge--pulse`
- `Input` / `Textarea` — `.input .textarea` + `.field .field__label/hint/error`
- `Nav` — `.site-nav` with resting / scrolled / mobile-open states
- `Carousel` — `.carousel > .carousel__viewport > .carousel__item`, dots + arrows via JS
- `Timeline` — `.timeline > .timeline__item > .timeline__node/date/title/description`
- `Theme toggle` — three-state segmented (system/light/dark)
- `Icon` — `.icon .icon--sm/md/lg/xl`

## 8. Iconography

- **Source**: `lucide-static` npm package. Icon set defined in `scripts/build-icons.mjs` (`ICONS` array).
- **Delivery**: `/icons/sprite.svg` — one file, committed to the repo.
- **Usage**: `<svg class="icon icon--md"><use href="/icons/sprite.svg#name"/></svg>` (helpers in `js/icon.js`).
- **Color**: always `currentColor` — the sprite strokes inherit the parent's `color`.
- **Rebuild** when you add a new icon: add it to `ICONS` in `build-icons.mjs`, then `npm run icons`. Commit the updated sprite.

Current inventory is in the `ICONS` array. Link-kind → icon mapping is in `js/icon.js` (`ICON_FOR_LINK_KIND`).

## 9. Adding a new section

1. Add a `<section id="myNew" class="section" aria-labelledby="myNew-title"></section>` to `index.html`.
2. Create `js/render/myNew.js` exporting `renderMyNew(target, data)`. Compose using `el()` from `dom.js` and existing components. Mount with `mount(target, ...)`.
3. Create `styles/sections/myNew.css` inside `@layer sections { ... }`. Import it from `styles/main.css`.
4. Wire it in `js/main.js`: import `renderMyNew`, add `myNew: renderMyNew` to the `RENDERERS` map.
5. Add `"myNew"` to `data.sections.order` in `data.json`. Add any new content keys to `data.json`.
6. (Optional) Add normalization for the new keys in `js/data.js`.

**Don't** introduce new primitives — compose existing components. If you genuinely need a new primitive, put it in `styles/components/`.

## 10. Local dev & Netlify deploy

```bash
npm install
npm run icons      # once, or whenever the icon list changes
npm run dev        # live-server at http://localhost:3000
```

Netlify:

- `publish = "."` in `netlify.toml`. Same file tree the dev server serves.
- `command = "npm run build"` runs `validate-data.mjs` + `build-icons.mjs`. If either fails the deploy fails. Good.
- SSL auto-provisioned (Let's Encrypt).
- Forms: the `<form name="contact" data-netlify="true">` element is detected at build time; submissions appear in the Netlify Forms dashboard.

To preview a deploy locally: `npx netlify deploy --build`. For a production deploy: `npx netlify deploy --build --prod`.

## 11. Cache / SSL / security headers (`netlify.toml`)

| Path         | Cache-Control                                          | Why                          |
| ------------ | ------------------------------------------------------ | ---------------------------- |
| `/images/*`  | `public, max-age=31536000, immutable`                  | Content-addressed by filename. Rename to bust. |
| `/icons/*`   | `public, max-age=31536000, immutable`                  | Sprite is rebuilt + committed. |
| `/fonts/*`   | `public, max-age=31536000, immutable`                  | (If we self-host fonts.)     |
| `/documents/*` | `public, max-age=2592000`                            | Resume may update monthly.   |
| `/favicon/*` | `public, max-age=604800`                               | Weekly.                      |
| `/styles/*`  | `public, max-age=3600, stale-while-revalidate=86400`   | Unhashed filenames → revalidate. |
| `/js/*`      | `public, max-age=3600, stale-while-revalidate=86400`   | Same.                        |
| `*.html`     | `public, max-age=0, must-revalidate`                   | Always show latest.          |
| `/data.json` | `public, max-age=0, must-revalidate`                   | Client edits must appear immediately. |

Security: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a `Content-Security-Policy` allowing only self-hosted assets + Google Fonts.

## 12. Historical gotchas (do not reintroduce)

- 🚫 **`/public/...` paths.** The old `src/` + `public/` split caused favicons and some assets to 404 on Netlify. v2 has one folder per asset type at root, and deploy publishes root.
- 🚫 **`!important`.** The old `input.css` forced dozens of headings/paragraph colors with `!important`. v2 uses cascade `@layer`s; if you reach for `!important`, the layering is wrong.
- 🚫 **`console.log` at module scope.** Old code had 40+ debug prints in production. If you need debug output, gate it behind `if (new URLSearchParams(location.search).get("debug"))` or remove before commit.
- 🚫 **Tailwind / CSS preprocessors / build steps beyond the two `scripts/*.mjs`.** Any such addition must justify itself against the longevity goal.
- 🚫 **Duplicate image folders.** One `/images/` at root, full stop.
- 🚫 **Hardcoded values in components.** Always use tokens.

## 13. Accessibility & performance baseline

- WCAG AA contrast verified per §7.
- Every image in `data.json` has `alt`, `width`, `height` (prevents layout shift).
- Every icon-only button has `aria-label`; decorative icons are `aria-hidden="true"`.
- Semantic landmarks: `<header>` `<nav>` `<main>` `<section>` `<article>` `<footer>`, skip-link to `#about`.
- `prefers-reduced-motion` honored in `tokens.css` + `reveal.js` + `hero.css`.
- `<noscript>` fallback surfaces the client's email and resume link.
- Target Lighthouse ≥ 95 across Performance/Accessibility/Best Practices/SEO.
- Below-fold images: `loading="lazy" decoding="async"`. Hero profile image: `fetchpriority="high"`.
- All JS is `type="module"` so it's deferred by spec (never blocks paint).

## 14. What NOT to add

- Frameworks (React, Vue, Svelte, Astro, Next).
- Bundlers (Vite, Webpack, Rollup, esbuild-as-bundler).
- CSS preprocessors (Sass, Less, PostCSS plugins beyond zero).
- Tailwind or any utility-class framework.
- Inline `style=""` in renderers (except `showFatalError` — literal last-ditch fallback).
- `!important` anywhere in app CSS.
- CDN-loaded runtime JS libraries (jQuery, lodash, GSAP). If you need a new dep, justify it against longevity.
- Font loading from untrusted third parties. Google Fonts OK with `preconnect` + `swap`; self-hosting preferred long-term.
- Trackers, analytics scripts with cookies, fingerprinting. If the client later wants analytics, prefer a server-side log analysis via Netlify or a zero-cookie product like Plausible.
- Features "just in case." The client edits one JSON file once a quarter. Every line of code is a line they might pay a future dev to understand.

## 15. Who works on this

- Primary editor: the client (Md Zainul Ali) — edits `data.json`, uploads images into `/images/...`, commits, pushes. Netlify deploys.
- Occasional dev: anyone picking up this README. Start by reading `data.json` → `js/data.js` → `js/main.js` → one `js/render/*.js` of your choice. That's the full mental model.

If future work needs to extend the site, prefer:

1. Edit `data.json` (content).
2. Add to `tokens.css` or a component CSS file (style).
3. Add a new section per §9 (new content type).

Anything more invasive deserves a short RFC in the PR description before implementation.
