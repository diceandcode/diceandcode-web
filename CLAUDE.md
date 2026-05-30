# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context
Static brand website for "Dice and Code" mobile app studio.
Built with Astro + Tailwind CSS, deployed on Netlify.
Purpose: present the brand and its published apps, link to social media, and host per-app legal pages (privacy policy / terms) required by Google AdMob, Play Store and App Store.

## Current state (read this first)
The localized home (hero) is built and working. What exists in `src/`:
- `src/pages/index.astro` (en), `src/pages/es/index.astro`, `src/pages/ca/index.astro` — thin pages that render `MainLayout` + `Hero`. Lang is inferred from the URL.
- `src/layouts/MainLayout.astro` — html/head shell: font preloads, `astro-seo` (title/description), `hreflang` alternates, `<body class="flex min-h-screen flex-col">`.
- `src/components/Hero.astro` — the whole hero (logo → brand → tagline → mailto CTA) + footer. Contact email lives here.
- `src/i18n/{en,es,ca}.json` + `src/i18n/utils.ts` (`getLangFromUrl`, `useTranslations`).
- `src/styles/global.css` — Tailwind v4 `@theme` tokens (palette + Inter `--font-sans`) and base `body` styles.

**Still aspirational** (in `docs/`, not built yet): the `/apps/[slug]` routes, the per-app legal pages, `LegalLayout`, and a visible language switcher. Build these as features land; keep treating `docs/` as the target design.

## Documentation
All documentation lives in `docs/`. Always read before starting any task:
- `docs/BRIEF.md` — architecture, stack, pages and conventions
- `docs/DESIGN.md` — full design system: palette, typography, components

Documentation files are always written in **Spanish**.
Keep all docs up to date after every relevant change. If a new decision or pattern is introduced that is not covered by existing docs, create a new file in `docs/` and reference it here.

## Stack
- **Astro 6** (`astro@^6`) — SSG
- **Tailwind CSS v4** — configured CSS-first via the `@tailwindcss/vite` plugin (in `astro.config.mjs`) and `@import "tailwindcss";` in `src/styles/global.css`. There is **no `tailwind.config.mjs`**; theme tokens and customization go in CSS using `@theme`, not a JS config file.
- **Netlify** — deployed as a pure static site (no adapter). Build settings live in `netlify.toml` (`command = "npm run build"`, `publish = "dist"`). Do not add `@astrojs/netlify`; an adapter would introduce serverless functions, which the SSG-only rule forbids.
- **astro-seo** — meta tags and Open Graph (installed)
- **@astrojs/sitemap** — sitemap generated on every build (configured; needs `site` in `astro.config.mjs`)
- **astro-icon** — Iconify SVG icons (`icon()` integration configured). Icon sets: `@iconify-json/simple-icons` (brand/social: GitHub, X, Instagram…) and `@iconify-json/mdi` (general UI). Usage: `import { Icon } from 'astro-icon/components'` → `<Icon name="simple-icons:github" />`. Icons inherit text color; don't add their own.
- **Fonts** — Inter is self-hosted (no Google/Bunny). woff2 in `public/fonts/inter/` (weights 400/600, `latin` + `latin-ext`), `@font-face` in `src/styles/global.css`, registered as `--font-sans` in `@theme`.
- **i18n / content / images** — use Astro built-ins, no extra packages: native i18n routing, Content Collections (`astro:content`) for `/apps/[slug]` and legal text, and `astro:assets` `<Image>` for screenshots.

## Architecture rules
- SSG only — no SSR, no server endpoints, no serverless functions. There is no adapter; keep it that way. Do not add `prerender = false` / on-demand routes.
- Mobile-first always
- No client-side JS unless strictly necessary and justified
- Never hardcode UI strings — all text goes in `src/i18n/` JSON files
- Legal pages always use `LegalLayout`
- Never introduce colors outside the palette defined in `docs/DESIGN.md`

## i18n
- Supported languages: `en` (default), `es`, `ca`
- Translation files in `src/i18n/en.json`, `src/i18n/es.json`, `src/i18n/ca.json`
- Always add all three translations when creating or modifying any UI text
- If an exact translation is uncertain, provide a best-effort translation — never leave a key missing or empty

## Code style
- All code, variable names, component names, and file names in **English**
- Comments only for non-obvious logic — avoid obvious or redundant comments
- Astro components in PascalCase (`AppCard.astro`, `MainLayout.astro`)
- i18n keys in camelCase (`heroTagline`, `ctaContact`)
- Tailwind classes preferred over custom CSS — only add custom CSS when Tailwind cannot handle it

## Commits
Use Conventional Commits with standard prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`.
Group commits by feature or view — not one commit per file.
Format:
```
<prefix>: brief one-line description

- Short bullet list
- of what was done
- kept generic and concise
```
Do not include Claude Code as co-author.

## Commands
- `npm run dev` — local dev server with hot reload (http://localhost:4321)
- `npm run build` — static build to `dist/`
- `npm run preview` — preview the build locally before deploying
- `npm run check` — type-check `.astro`/`.ts` against `astro/tsconfigs/strict` (`@astrojs/check`)
- `npm run format` / `npm run format:check` — Prettier write / verify (`prettier-plugin-astro`; config in `.prettierrc.json`, `singleQuote`)
- `npm run astro -- <cmd>` — run Astro CLI commands (e.g. `npm run astro -- add <integration>`)

Prettier **ignores Markdown** (`*.md` in `.prettierignore`) — the Spanish docs in `docs/` have hand-aligned tables/diagrams; format them manually. No ESLint and no test runner are configured. Requires Node `>=22.12.0`.
