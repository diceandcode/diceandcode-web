# Dice and Code — Brand site

Static brand website for **Dice and Code**, an independent mobile app studio.
It presents the brand and its published apps, links to social profiles, and
hosts the per-app legal pages (privacy policy / terms) required by Google AdMob,
the Play Store and the App Store.

🔗 **Live:** https://diceandcode.netlify.app

Available in **English** (default), **Spanish** and **Catalan** — served at `/`,
`/es/` and `/ca/`.

## Tech stack

- [Astro 6](https://astro.build) — static site generation (no SSR)
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first, configured via `@theme`
- Self-hosted [Inter](https://rsms.me/inter/) font (no third-party requests)
- `astro-icon`, `astro-seo`, `@astrojs/sitemap`
- Deployed as a pure static site on [Netlify](https://www.netlify.com)

## Getting started

Requires **Node >= 22.12.0**.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
```

### Scripts

| Command                | Action                                          |
| :--------------------- | :---------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload            |
| `npm run build`        | Build the static site to `dist/`                |
| `npm run preview`      | Preview the production build locally            |
| `npm run check`        | Type-check `.astro` / `.ts` files               |
| `npm run format`       | Format the codebase with Prettier               |

## Project structure

```text
src/
├── pages/        # routes — index.astro (en), es/, ca/
├── layouts/      # MainLayout (page shell, SEO, fonts)
├── components/   # UI components (Hero, …)
├── i18n/         # translations (en/es/ca) + helpers
└── styles/       # global.css — Tailwind v4 theme tokens
public/           # fonts, images, favicons
docs/             # internal docs (Spanish): BRIEF.md, DESIGN.md
```

Project conventions and architecture notes for contributors live in
[`CLAUDE.md`](./CLAUDE.md); the design system is documented in
[`docs/DESIGN.md`](./docs/DESIGN.md).

---

© 2026 Dice and Code
