# Persistent Brand Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clickable brand header (logo + "Dice and Code") to interior pages that links back to the localized home, hidden on the home pages themselves.

**Architecture:** A new `BrandLink.astro` component renders the logo + wordmark as a link to the localized home. `MainLayout` gains a `showBrand` prop (default `true`) that places `BrandLink` in the left of the header; the three home pages opt out with `showBrand={false}`. No client JS, no new colors.

**Tech Stack:** Astro 6 (SSG), Tailwind CSS v4, astro i18n (`getRelativeLocaleUrl`), self-hosted i18n JSON.

**Verification note:** This project has no test runner (see `CLAUDE.md`). The verification gate for each task is `npm run check` (type-check) + `npm run build`, plus manual visual checks in `npm run dev`. Steps reflect this instead of unit tests.

---

### Task 1: Add the `navHome` i18n key (all three languages)

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/ca.json`

- [ ] **Step 1: Add `navHome` to `en.json`**

Add this key (e.g. right after `"langSwitcherLabel"`):

```json
"navHome": "Dice and Code — home",
```

- [ ] **Step 2: Add `navHome` to `es.json`**

```json
"navHome": "Dice and Code — inicio",
```

- [ ] **Step 3: Add `navHome` to `ca.json`**

```json
"navHome": "Dice and Code — inici",
```

- [ ] **Step 4: Verify JSON is valid**

Run: `npm run check`
Expected: PASS (no JSON parse errors, no type errors).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en.json src/i18n/es.json src/i18n/ca.json
git commit -m "feat: add navHome i18n key for brand link"
```

---

### Task 2: Create the `BrandLink` component

**Files:**
- Create: `src/components/BrandLink.astro`

- [ ] **Step 1: Write the component**

Create `src/components/BrandLink.astro` with exactly this content:

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const homeHref = getRelativeLocaleUrl(lang);
---

<a
  href={homeHref}
  aria-label={t('navHome')}
  class="flex items-center gap-2 text-brand-secondary no-underline transition-colors duration-200 hover:text-brand"
>
  <img
    src="/images/logo/logo_dice_and_code_white.svg"
    width="28"
    height="28"
    alt=""
  />
  <span class="text-sm font-semibold tracking-[-0.01em]">{t('brandName')}</span>
</a>
```

Notes: the logo is decorative (`alt=""`) because the visible wordmark already names
the brand; the link's accessible name comes from `aria-label={t('navHome')}`.

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: PASS. (The component is not yet imported anywhere, so this only confirms it
compiles.)

- [ ] **Step 3: Commit**

```bash
git add src/components/BrandLink.astro
git commit -m "feat: add BrandLink component linking to localized home"
```

---

### Task 3: Wire `showBrand` into `MainLayout`

**Files:**
- Modify: `src/layouts/MainLayout.astro`

- [ ] **Step 1: Import `BrandLink`**

In the frontmatter of `src/layouts/MainLayout.astro`, add the import next to the existing
`LanguageSwitcher` import:

```astro
import LanguageSwitcher from '../components/LanguageSwitcher.astro';
import BrandLink from '../components/BrandLink.astro';
```

- [ ] **Step 2: Add `showBrand` to `Props` and destructure it**

Change the `Props` interface to add the field:

```astro
interface Props {
  title?: string;
  description?: string;
  alternates?: Record<string, string>;
  showBrand?: boolean;
}
```

And add `showBrand = true` to the destructured defaults:

```astro
const {
  title = t('brandName'),
  description = t('heroTagline'),
  alternates = { en: '/', es: '/es/', ca: '/ca/' },
  showBrand = true,
} = Astro.props;
```

- [ ] **Step 3: Update the `<header>` markup**

Replace the existing header block:

```astro
    <header class="absolute inset-x-0 top-0 z-10 flex justify-end p-6">
      <LanguageSwitcher />
    </header>
```

with:

```astro
    <header
      class="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6"
    >
      {showBrand ? <BrandLink /> : <span></span>}
      <LanguageSwitcher />
    </header>
```

The empty `<span>` keeps the language switcher pushed to the right when the brand is
hidden (so `justify-between` still works on the home).

- [ ] **Step 4: Verify type-check and build**

Run: `npm run check`
Expected: PASS.

Run: `npm run build`
Expected: PASS, `dist/` generated with no errors.

- [ ] **Step 5: Manual visual check (interior pages still default to showing the brand)**

Run: `npm run dev`, then open:
- `http://localhost:4321/apps/tapluck`
- `http://localhost:4321/apps/tapluck/privacy`

Expected: each shows the logo + "Dice and Code" top-left and the language globe top-right.
Clicking the brand returns to `/`. (At this point the home pages ALSO show the brand —
that is fixed in Task 4.)

- [ ] **Step 6: Commit**

```bash
git add src/layouts/MainLayout.astro
git commit -m "feat: render BrandLink in MainLayout via showBrand prop"
```

---

### Task 4: Hide the brand on the three home pages

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/es/index.astro`
- Modify: `src/pages/ca/index.astro`

- [ ] **Step 1: Opt out in `src/pages/index.astro`**

Change `<MainLayout>` to `<MainLayout showBrand={false}>`. Full file becomes:

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import Home from '../components/Home.astro';
---

<MainLayout showBrand={false}>
  <Home />
</MainLayout>
```

- [ ] **Step 2: Opt out in `src/pages/es/index.astro`**

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import Home from '../../components/Home.astro';
---

<MainLayout showBrand={false}>
  <Home />
</MainLayout>
```

- [ ] **Step 3: Opt out in `src/pages/ca/index.astro`**

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import Home from '../../components/Home.astro';
---

<MainLayout showBrand={false}>
  <Home />
</MainLayout>
```

- [ ] **Step 4: Manual visual check (home hides brand, interior keeps it)**

Run: `npm run dev`, then open:
- `http://localhost:4321/` , `/es/` , `/ca/` → only the language globe top-right, NO
  brand header (the large hero logo is the only logo).
- `http://localhost:4321/apps/tapluck` and `/apps/tapluck/privacy` → brand header still
  present and links home.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/es/index.astro src/pages/ca/index.astro
git commit -m "feat: hide brand header on home pages"
```

---

### Task 5: Update documentation

**Files:**
- Modify: `docs/BRIEF.md`
- Modify: `docs/DESIGN.md`
- Modify: `CLAUDE.md`

Docs in `docs/` are written in **Spanish** (per `CLAUDE.md`). `CLAUDE.md` itself is English.
Prettier ignores Markdown, so format manually.

- [ ] **Step 1: Update `docs/BRIEF.md`**

In the architecture/conventions section, add a Spanish note describing the persistent brand
header and the `showBrand` convention. Suggested text:

```markdown
- `BrandLink` (logo + nombre) actúa como cabecera de marca en las páginas interiores y
  enlaza a la home del idioma actual. Se controla con la prop `showBrand` de `MainLayout`
  (por defecto `true`); las páginas home la desactivan con `showBrand={false}`.
```

- [ ] **Step 2: Update `docs/DESIGN.md`**

In the components section, document `BrandLink` in Spanish. Suggested text:

```markdown
### BrandLink
Enlace de marca para páginas interiores: logo (`logo_dice_and_code_white.svg`, ~28px) +
nombre "Dice and Code", alineado a la izquierda en la cabecera. Texto en
`text-brand-secondary` con hover a `text-brand`. El logo es decorativo (`alt=""`) y el
enlace usa `aria-label` con la clave `navHome`. No aparece en la home (el logo del héroe
ya cumple esa función).
```

- [ ] **Step 3: Update the "Current state" section of `CLAUDE.md`**

Update the `MainLayout.astro` bullet so it reflects that the header now holds `BrandLink`
on interior pages plus the `LanguageSwitcher`, toggled by `showBrand` (default `true`).
Suggested replacement for that bullet:

```markdown
- `src/layouts/MainLayout.astro` — html/head shell (font preloads, `astro-seo`, `hreflang`
  alternates) plus a top `<header>` (absolute) with `BrandLink` on the left (interior pages
  only, via the `showBrand` prop — default `true`; home pages pass `showBrand={false}`) and
  the `LanguageSwitcher` on the right. `<body class="flex min-h-screen flex-col">`.
```

Also add a one-line mention of `src/components/BrandLink.astro` to the components list in
that section.

- [ ] **Step 4: Verify build still passes**

Run: `npm run build`
Expected: PASS (docs changes don't affect the build, but confirm nothing broke).

- [ ] **Step 5: Commit**

```bash
git add docs/BRIEF.md docs/DESIGN.md CLAUDE.md
git commit -m "docs: document persistent brand header and showBrand prop"
```

---

## Self-Review

**Spec coverage:**
- Persistent brand on interior pages → Tasks 2 + 3. ✓
- Hidden on home → Task 4. ✓
- `showBrand` prop, default `true` → Task 3. ✓
- `BrandLink` component (logo + wordmark, localized home, decorative logo, aria-label) →
  Task 2. ✓
- `navHome` i18n key in en/es/ca → Task 1. ✓
- Docs (BRIEF, DESIGN, CLAUDE) → Task 5. ✓
- Constraints (SSG, no JS, palette, all UI text in i18n) → honored; no JS added, only
  existing palette tokens used, new string is in i18n. ✓

**Placeholder scan:** No TBD/TODO; every code/markup step shows the full content. ✓

**Type consistency:** `showBrand` prop name and `navHome` key name used consistently across
Tasks 1–5; `BrandLink` import path (`../components/BrandLink.astro`) matches the created
file. ✓
