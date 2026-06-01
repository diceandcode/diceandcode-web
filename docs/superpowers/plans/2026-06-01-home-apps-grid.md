# Home Apps Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the home page into an apps showcase: a compact brand hero followed by a grid of app cards (one per published app), each linking to its `/apps/[slug]` page, with a de-emphasised contact link at the bottom.

**Architecture:** A small typed data module (`src/data/apps.ts`) lists published apps. `AppsGrid.astro` maps it to `AppCard.astro` link-cards. The existing monolithic `Hero.astro` is renamed to `Home.astro` and restructured to compose: compact hero → `AppsGrid` → ghost contact → footer. The three thin `index` pages import `Home` instead of `Hero`.

**Tech Stack:** Astro 6 (SSG), Tailwind CSS v4 (CSS-first), native Astro i18n (`getRelativeLocaleUrl`). No SSR, no client JS.

**Spec:** `docs/superpowers/specs/2026-06-01-home-apps-grid-design.md`

---

## Testing note (read first)

No test runner / ESLint in this project (see `CLAUDE.md`). "Verify" steps use the real gates:
- `npm run check` — type-checks `.astro`/`.ts` (`@astrojs/check`).
- `npm run build` — static build to `dist/`; fails on broken imports/icons.
- `grep` over built `dist/` HTML — asserts rendered output.

Commit after each task (Conventional Commits, **no** Claude co-author trailer). Do not commit `dist/` (gitignored).

---

## File Structure

**Create:**
- `src/data/apps.ts` — typed list of published apps (slug, icon path, i18n key refs).
- `src/components/AppCard.astro` — one app as a link-card to `/apps/[slug]`.
- `src/components/AppsGrid.astro` — section label + grid mapping over `apps`.
- `src/components/Home.astro` — home body (compact hero + AppsGrid + contact + footer); replaces `Hero.astro`.

**Modify:**
- `src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/ca/index.astro` — import `Home` instead of `Hero`.
- `src/i18n/en.json`, `src/i18n/es.json`, `src/i18n/ca.json` — add `appsSectionLabel`.
- `docs/BRIEF.md`, `docs/DESIGN.md` — document the showcase home.

**Delete:**
- `src/components/Hero.astro` — superseded by `Home.astro`.

---

## Task 1: i18n — appsSectionLabel

**Files:**
- Modify: `src/i18n/en.json`, `src/i18n/es.json`, `src/i18n/ca.json`

- [ ] **Step 1: Add `appsSectionLabel` to `src/i18n/en.json`**

Add the key after `langSwitcherLabel` (keep all existing keys). The file must become:

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps crafted with code & a little luck.",
  "ctaContact": "Get in touch",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Change language",
  "appsSectionLabel": "Our apps",
  "tapluckName": "TapLuck",
  "tapluckTagline": "Everyone taps. Luck picks.",
  "tapluckSubline": "The fairest way to pick someone, set an order, or split into teams — right on your phone.",
  "tapluckModePick": "Pick one",
  "tapluckModeOrder": "Order",
  "tapluckModeTeams": "Teams",
  "tapluckModeThemes": "Themes",
  "tapluckComingSoon": "Coming soon",
  "tapluckByStudio": "An app by Dice and Code",
  "tapluckMetaDescription": "TapLuck — the finger chooser to pick someone, set an order or split into teams."
}
```

- [ ] **Step 2: Add `appsSectionLabel` to `src/i18n/es.json`**

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps creadas con código y un poco de suerte.",
  "ctaContact": "Hablemos",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Cambiar idioma",
  "appsSectionLabel": "Nuestras apps",
  "tapluckName": "TapLuck",
  "tapluckTagline": "Todos ponen el dedo. La suerte elige.",
  "tapluckSubline": "La forma más justa de elegir a alguien, ordenar el grupo o repartir equipos — en tu móvil.",
  "tapluckModePick": "Elige uno",
  "tapluckModeOrder": "Ordena",
  "tapluckModeTeams": "Equipos",
  "tapluckModeThemes": "Temas",
  "tapluckComingSoon": "Próximamente",
  "tapluckByStudio": "Una app de Dice and Code",
  "tapluckMetaDescription": "TapLuck — el finger chooser para elegir a alguien, ordenar o hacer equipos."
}
```

- [ ] **Step 3: Add `appsSectionLabel` to `src/i18n/ca.json`**

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps fetes amb codi i una mica de sort.",
  "ctaContact": "Parlem-ne",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Canviar d'idioma",
  "appsSectionLabel": "Les nostres apps",
  "tapluckName": "TapLuck",
  "tapluckTagline": "Tots hi posen el dit. La sort tria.",
  "tapluckSubline": "La manera més justa de triar algú, ordenar el grup o fer equips — al teu mòbil.",
  "tapluckModePick": "Tria un",
  "tapluckModeOrder": "Ordena",
  "tapluckModeTeams": "Equips",
  "tapluckModeThemes": "Temes",
  "tapluckComingSoon": "Aviat",
  "tapluckByStudio": "Una app de Dice and Code",
  "tapluckMetaDescription": "TapLuck — el finger chooser per triar algú, ordenar o fer equips."
}
```

- [ ] **Step 4: Type-check**

Run: `npm run check`
Expected: 0 errors, 0 warnings. (`en.json` defines the `TranslationKey` union; all three stay structurally identical.)

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en.json src/i18n/es.json src/i18n/ca.json
git commit -m "feat: add appsSectionLabel i18n string"
```

---

## Task 2: Apps data module

**Files:**
- Create: `src/data/apps.ts`

- [ ] **Step 1: Create `src/data/apps.ts`**

```ts
import type { TranslationKey } from '../i18n/utils';

export interface App {
  slug: string;
  icon: string;
  nameKey: TranslationKey;
  taglineKey: TranslationKey;
}

export const apps: App[] = [
  {
    slug: 'tapluck',
    icon: '/images/apps/tapluck/icon.webp',
    nameKey: 'tapluckName',
    taglineKey: 'tapluckTagline',
  },
];
```

- [ ] **Step 2: Type-check**

Run: `npm run check`
Expected: 0 errors. (`nameKey`/`taglineKey` are constrained to `TranslationKey`, so a typo'd key would fail here. `TranslationKey` is exported from `src/i18n/utils.ts`.)

- [ ] **Step 3: Commit**

```bash
git add src/data/apps.ts
git commit -m "feat: add apps data module"
```

---

## Task 3: AppCard and AppsGrid components

`AppCard` renders one app as a full-card link to its localized `/apps/[slug]` page. `AppsGrid` renders the section label and maps the `apps` array to cards. Both read the language from the URL.

**Files:**
- Create: `src/components/AppCard.astro`
- Create: `src/components/AppsGrid.astro`

- [ ] **Step 1: Create `src/components/AppCard.astro`**

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '../i18n/utils';
import type { App } from '../data/apps';

interface Props {
  app: App;
}

const { app } = Astro.props;

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const href = getRelativeLocaleUrl(lang, `apps/${app.slug}`);
---

<a
  href={href}
  class="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left no-underline transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.07] sm:w-[300px]"
>
  <img
    src={app.icon}
    width="44"
    height="44"
    alt={t(app.nameKey)}
    class="rounded-[11px]"
  />
  <span class="flex flex-col">
    <span class="text-[15px] font-semibold text-brand">{t(app.nameKey)}</span>
    <span class="text-[13px] text-brand-secondary">{t(app.taglineKey)}</span>
  </span>
  <span class="ml-auto text-brand-muted" aria-hidden="true">→</span>
</a>
```

- [ ] **Step 2: Create `src/components/AppsGrid.astro`**

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';
import { apps } from '../data/apps';
import AppCard from './AppCard.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<section class="flex w-full max-w-[640px] flex-col items-center gap-3">
  <h2 class="text-xs uppercase tracking-[0.14em] text-brand-muted">
    {t('appsSectionLabel')}
  </h2>
  <div class="flex w-full flex-wrap justify-center gap-3">
    {apps.map((app) => <AppCard app={app} />)}
  </div>
</section>
```

- [ ] **Step 3: Type-check**

Run: `npm run check`
Expected: 0 errors. (Astro check type-checks all `.astro` files, including these not-yet-wired components — confirms props typing and the `t(app.nameKey)` calls.)

- [ ] **Step 4: Format**

Run: `npm run format` then `npm run check` again if anything reformatted (expected 0 errors).

- [ ] **Step 5: Commit**

```bash
git add src/components/AppCard.astro src/components/AppsGrid.astro
git commit -m "feat: add AppCard and AppsGrid components"
```

---

## Task 4: Home component + wire the index pages

Replace the monolithic `Hero.astro` with `Home.astro` (compact hero → AppsGrid → ghost contact → footer), point the three `index` pages at it, and delete `Hero.astro`.

**Files:**
- Create: `src/components/Home.astro`
- Modify: `src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/ca/index.astro`
- Delete: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Home.astro`**

The contact email is carried over verbatim from `Hero.astro` (`hello.diceandcode@gmail.com`).

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';
import AppsGrid from './AppsGrid.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const contactEmail = 'hello.diceandcode@gmail.com';
---

<main
  class="flex flex-1 flex-col items-center justify-center gap-8 p-6 text-center"
>
  <div class="flex flex-col items-center gap-3">
    <img
      src="/images/logo/logo_dice_and_code_white.svg"
      width="40"
      height="40"
      alt={t('brandName')}
    />
    <h1 class="text-[22px] font-semibold tracking-[-0.01em] text-brand">
      {t('brandName')}
    </h1>
    <p class="max-w-[340px] text-[14px] leading-relaxed text-brand-secondary">
      {t('heroTagline')}
    </p>
  </div>

  <AppsGrid />
</main>

<footer class="flex flex-col items-center gap-4 p-6">
  <a
    href={`mailto:${contactEmail}`}
    class="rounded-full border border-white/20 px-[22px] py-[9px] text-[14px] text-brand-secondary no-underline transition-colors duration-200 hover:text-brand"
  >
    {t('ctaContact')}
  </a>
  <span class="text-xs text-brand-muted">{t('footerCopyright')}</span>
</footer>
```

- [ ] **Step 2: Point `src/pages/index.astro` at `Home`**

Replace the whole file with:

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import Home from '../components/Home.astro';
---

<MainLayout>
  <Home />
</MainLayout>
```

- [ ] **Step 3: Point `src/pages/es/index.astro` at `Home`**

Replace the whole file with:

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import Home from '../../components/Home.astro';
---

<MainLayout>
  <Home />
</MainLayout>
```

- [ ] **Step 4: Point `src/pages/ca/index.astro` at `Home`**

Replace the whole file with:

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import Home from '../../components/Home.astro';
---

<MainLayout>
  <Home />
</MainLayout>
```

- [ ] **Step 5: Delete the old `Hero.astro`**

Run: `git rm src/components/Hero.astro`
Expected: file removed. Confirm nothing else imports it:

Run: `grep -rn "components/Hero" src` (PowerShell: `Select-String -Path src -Pattern "components/Hero" -Recurse` — or use the Grep tool)
Expected: no matches.

- [ ] **Step 6: Type-check and build**

Run: `npm run check`
Expected: 0 errors.

Run: `npm run build`
Expected: build succeeds; 6 pages built (`dist/index.html`, `dist/es/index.html`, `dist/ca/index.html`, plus the three tapluck pages).

- [ ] **Step 7: Verify rendered output**

Run: `grep -c "Our apps" dist/index.html`
Expected: `1`

Run: `grep -o "Everyone taps. Luck picks." dist/index.html`
Expected: prints once (the TapLuck card tagline renders on the home).

Run: `grep -o 'href="[^"]*apps/tapluck[^"]*"' dist/index.html`
Expected: a link whose href contains `/apps/tapluck` (en home → en app page).

Run: `grep -o "Nuestras apps" dist/es/index.html; grep -o 'href="/es/apps/tapluck' dist/es/index.html`
Expected: `Nuestras apps` prints, and the es card links to `/es/apps/tapluck`.

Run: `grep -o "Les nostres apps" dist/ca/index.html; grep -o 'href="/ca/apps/tapluck' dist/ca/index.html`
Expected: `Les nostres apps` prints, and the ca card links to `/ca/apps/tapluck`.

Run: `grep -o 'href="mailto:hello.diceandcode@gmail.com"' dist/index.html`
Expected: the ghost contact link is present.

- [ ] **Step 8: Format**

Run: `npm run format` then `npm run check` again if anything reformatted (expected 0 errors).

- [ ] **Step 9: Commit**

```bash
git add src/components/Home.astro src/pages/index.astro src/pages/es/index.astro src/pages/ca/index.astro src/components/Hero.astro
git commit -m "feat: turn home into apps showcase"
```

(`git add` of the deleted `Hero.astro` stages its removal.)

---

## Task 5: Documentation

Docs are in Spanish; Prettier ignores Markdown (format by hand).

**Files:**
- Modify: `docs/BRIEF.md`
- Modify: `docs/DESIGN.md`

- [ ] **Step 1: Update `docs/BRIEF.md`**

In the "Páginas previstas" section, mark the home apps list as built. Replace:

```markdown
## Páginas previstas
- Home: hero, lista de apps, links sociales
- /apps/[slug]: página individual de cada app
  - **/apps/tapluck — construida** (versión simple pre-capturas: icono, tagline, modos y badges de stores como placeholder; se rehará para incluir capturas cuando las exijan las tiendas)
- /apps/[slug]/privacy: política de privacidad por app
- /apps/[slug]/terms: términos y condiciones por app
```

with:

```markdown
## Páginas previstas
- Home: **construida como escaparate de apps** (hero compacto + grid de apps que enlazan a su página; contacto discreto). Pendiente: links a redes sociales.
- /apps/[slug]: página individual de cada app
  - **/apps/tapluck — construida** (versión simple pre-capturas: icono, tagline, modos y badges de stores como placeholder; se rehará para incluir capturas cuando las exijan las tiendas)
- /apps/[slug]/privacy: política de privacidad por app
- /apps/[slug]/terms: términos y condiciones por app
```

- [ ] **Step 2: Update the home description in `docs/DESIGN.md` section 6**

In `docs/DESIGN.md`, find the "### Hero" subsection inside "## 6. Componentes recurrentes":

```markdown
### Hero
Bloque central único: logo → marca → tagline → CTA, en columna centrada con `flex flex-col items-center gap-6`. Patrón base para cualquier sección futura.
```

Replace it with:

```markdown
### Home (escaparate de apps)
El cuerpo de la home vive en `src/components/Home.astro` (antes `Hero.astro`). Composición en columna centrada: **hero compacto** (logo 40×40 → marca → tagline) → **`AppsGrid`** → **contacto fantasma** → footer. El contacto dejó de ser el botón azul: es un botón de borde (`border border-white/20 text-brand-secondary`, hover a `text-brand`) anclado abajo, porque el protagonismo es de las apps.

### AppCard / AppsGrid
`AppsGrid.astro` recorre `src/data/apps.ts` (lista tipada de apps publicadas: `slug`, icono, claves i18n de nombre y tagline) y pinta una `AppCard` por app bajo la etiqueta `appsSectionLabel`. `AppCard.astro` es una tarjeta-enlace (`bg-white/5 border border-white/10 rounded-2xl`, hover sutil) con icono + nombre + tagline + flecha, que lleva a `/apps/[slug]` localizado (`getRelativeLocaleUrl(lang, \`apps/${slug}\`)`). El grid usa `flex flex-wrap justify-center` para que una sola app quede centrada y varias formen filas. Añadir una app = añadir una entrada en `src/data/apps.ts` (+ su página).
```

- [ ] **Step 3: Update the layout diagram note in `docs/DESIGN.md` section 5**

In "## 5. Espaciado y grid", the ASCII diagram and surrounding text describe the old single-CTA hero. Immediately **after** the closing ``` of that diagram block, add this note paragraph (do not delete the existing diagram — it still documents the per-app page hero pattern):

```markdown
> **Nota (home actual):** desde que la home es un escaparate de apps, su cuerpo es `Home.astro` (hero compacto → `AppsGrid` → contacto fantasma → footer), no el hero de CTA único que ilustra el diagrama. El diagrama sigue siendo válido como patrón de pantalla centrada para las páginas de app (`/apps/[slug]`).
```

- [ ] **Step 4: Sanity build**

Run: `npm run build`
Expected: succeeds (docs aren't in the build; confirms the tree is healthy).

- [ ] **Step 5: Commit**

```bash
git add docs/BRIEF.md docs/DESIGN.md
git commit -m "docs: document apps-showcase home and AppCard/AppsGrid"
```

---

## Final verification

- [ ] **Clean build from scratch**

Run: `npm run build`
Expected: 6 pages built; `dist/index.html`, `dist/es/index.html`, `dist/ca/index.html` all contain the apps section and the TapLuck card link.

- [ ] **Type-check and format check**

Run: `npm run check` (0 errors) and `npm run format:check` (all formatted).

- [ ] **Manual visual pass (recommended)**

Run: `npm run preview`, open `http://localhost:4321/`, `/es/`, `/ca/`. Confirm: compact hero (logo + brand + tagline), "Our apps" label, a centered TapLuck card that links to the app page, a ghost "Get in touch" link near the bottom, footer copyright. Click the card → lands on `/apps/tapluck` (localized). Mobile-first centered layout.

---

## Notes for the implementer

- **Palette:** only black, grey scale, blue `#0071e3`, and white opacities (`white/5`, `white/10`, `white/20`, `white/[0.07]`). No new colors.
- **No client JS.** Cards are plain `<a>` links.
- **Scaling to more apps:** add an entry to `src/data/apps.ts` and create its `/apps/[slug]` page; the grid and home need no changes.
- **Rename, not duplicate:** `Home.astro` supersedes `Hero.astro`; make sure `Hero.astro` is deleted and nothing imports `components/Hero`. The per-app component `TapLuckHero.astro` is unrelated and stays.
- **Localized hrefs:** `getRelativeLocaleUrl(lang, \`apps/${slug}\`)` yields `/apps/tapluck` (en), `/es/apps/tapluck` (es), `/ca/apps/tapluck` (ca). If an assertion about a trailing slash fails, match on the path substring rather than an exact trailing slash.
