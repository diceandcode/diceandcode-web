# TapLuck App Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple single-screen landing page for the TapLuck app at `/apps/tapluck` (en/es/ca) that funnels visitors toward the (future) store download links.

**Architecture:** Thin localized pages (`src/pages/apps/tapluck.astro` + `es/` + `ca/`) render `MainLayout` plus a new `TapLuckHero.astro` component holding the whole screen (icon → name → tagline → subline → placeholder store badges → mode chips → studio link → footer). Store links are driven by two `null` constants that flip the badges from a disabled "Coming soon" state to active blue CTAs. All UI strings live in `src/i18n/{en,es,ca}.json`.

**Tech Stack:** Astro 6 (SSG), Tailwind CSS v4 (CSS-first), astro-icon (`simple-icons` + `mdi` sets), native Astro i18n. No SSR, no client JS.

**Spec:** `docs/superpowers/specs/2026-06-01-tapluck-app-page-design.md`

---

## Testing note (read first)

This project has **no test runner and no ESLint** (see `CLAUDE.md`). "Verify" steps therefore use the project's real quality gates:

- `npm run check` — type-checks `.astro`/`.ts` against `astro/tsconfigs/strict` (`@astrojs/check`).
- `npm run build` — static build to `dist/`; fails on bad icon names, broken imports, etc.
- `grep` over the built `dist/` HTML — asserts the rendered output contains the expected strings/attributes.

Commit after each task. Use Conventional Commits, no Claude co-author (per `CLAUDE.md`).

---

## File Structure

**Create:**
- `src/components/TapLuckHero.astro` — entire TapLuck screen (main + footer), analogous to `Hero.astro`.
- `src/pages/apps/tapluck.astro` — English page.
- `src/pages/es/apps/tapluck.astro` — Spanish page.
- `src/pages/ca/apps/tapluck.astro` — Catalan page.

**Modify:**
- `src/i18n/en.json`, `src/i18n/es.json`, `src/i18n/ca.json` — add `tapluck*` keys.
- `src/layouts/MainLayout.astro` — parametrize `hreflang` alternates via a new optional `alternates` prop (default = current home map).
- `docs/BRIEF.md`, `docs/DESIGN.md` — document the built page and the app-page pattern.

---

## Task 1: i18n strings

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/es.json`
- Modify: `src/i18n/ca.json`

- [ ] **Step 1: Add the TapLuck keys to `src/i18n/en.json`**

Replace the whole file with:

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps crafted with code & a little luck.",
  "ctaContact": "Get in touch",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Change language",
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

- [ ] **Step 2: Add the same keys to `src/i18n/es.json`**

Replace the whole file with:

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps creadas con código y un poco de suerte.",
  "ctaContact": "Hablemos",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Cambiar idioma",
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

- [ ] **Step 3: Add the same keys to `src/i18n/ca.json`**

Replace the whole file with:

```json
{
  "brandName": "Dice and Code",
  "heroTagline": "Apps fetes amb codi i una mica de sort.",
  "ctaContact": "Parlem-ne",
  "footerCopyright": "© 2026 Dice and Code",
  "langSwitcherLabel": "Canviar d'idioma",
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
Expected: 0 errors, 0 warnings. (`en.json` defines the `TranslationKey` union; es/ca must stay structurally compatible.)

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en.json src/i18n/es.json src/i18n/ca.json
git commit -m "feat: add TapLuck page i18n strings"
```

---

## Task 2: Parametrize MainLayout hreflang alternates

`MainLayout` currently hardcodes the home alternates in `localizedHome`. Make them an optional prop so the TapLuck pages can emit their own, defaulting to the home map (home pages keep working unchanged).

**Files:**
- Modify: `src/layouts/MainLayout.astro`

- [ ] **Step 1: Add the `alternates` prop and default**

In `src/layouts/MainLayout.astro`, change the `Props` interface from:

```astro
interface Props {
  title?: string;
  description?: string;
}
```

to:

```astro
interface Props {
  title?: string;
  description?: string;
  alternates?: Record<string, string>;
}
```

- [ ] **Step 2: Replace the destructure + `localizedHome` constant**

Change:

```astro
const { title = t('brandName'), description = t('heroTagline') } = Astro.props;

const localizedHome = { en: '/', es: '/es/', ca: '/ca/' };
```

to:

```astro
const {
  title = t('brandName'),
  description = t('heroTagline'),
  alternates = { en: '/', es: '/es/', ca: '/ca/' },
} = Astro.props;
```

- [ ] **Step 3: Point the alternate `<link>`s at the prop**

Change the alternates block from:

```astro
    {
      Object.entries(localizedHome).map(([code, path]) => (
        <link
          rel="alternate"
          hreflang={code}
          href={new URL(path, Astro.site)}
        />
      ))
    }
    <link
      rel="alternate"
      hreflang="x-default"
      href={new URL('/', Astro.site)}
    />
```

to:

```astro
    {
      Object.entries(alternates).map(([code, path]) => (
        <link
          rel="alternate"
          hreflang={code}
          href={new URL(path, Astro.site)}
        />
      ))
    }
    <link
      rel="alternate"
      hreflang="x-default"
      href={new URL(alternates.en, Astro.site)}
    />
```

- [ ] **Step 4: Build and confirm the home page is unchanged**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -o 'hreflang="[a-z-]*" href="[^"]*"' dist/index.html`
Expected: lines for `en` → `https://diceandcode.netlify.app/`, `es` → `.../es/`, `ca` → `.../ca/`, and `x-default` → `https://diceandcode.netlify.app/` (identical to before this task).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/MainLayout.astro
git commit -m "refactor: make MainLayout hreflang alternates configurable"
```

---

## Task 3: TapLuckHero component + English page

Build the screen component and the English route so it can render. The component shows two store badges: when a store URL constant is `null` it renders a disabled pill and shows a single "Coming soon" label below the pair; when a URL is set it renders an active blue CTA linking out.

**Files:**
- Create: `src/components/TapLuckHero.astro`
- Create: `src/pages/apps/tapluck.astro`

- [ ] **Step 1: Create `src/components/TapLuckHero.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

// Fill these in when the store listings go live — null renders a disabled
// "Coming soon" badge; a URL renders an active blue CTA.
const appStoreUrl: string | null = null;
const googlePlayUrl: string | null = null;

const stores = [
  { url: appStoreUrl, label: 'App Store', icon: 'simple-icons:appstore' },
  { url: googlePlayUrl, label: 'Google Play', icon: 'simple-icons:googleplay' },
];
const allLive = stores.every((store) => store.url);

const modes = [
  { icon: 'mdi:gesture-tap', label: t('tapluckModePick') },
  { icon: 'mdi:format-list-numbered', label: t('tapluckModeOrder') },
  { icon: 'mdi:account-group', label: t('tapluckModeTeams') },
  { icon: 'mdi:palette', label: t('tapluckModeThemes') },
];

const homeHref = getRelativeLocaleUrl(lang);
---

<main
  class="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center"
>
  <img
    src="/images/apps/tapluck/icon.webp"
    width="96"
    height="96"
    alt={t('tapluckName')}
    class="rounded-[22px]"
  />

  <h1
    class="text-[28px] font-semibold tracking-[-0.01em] text-brand sm:text-[34px]"
  >
    {t('tapluckName')}
  </h1>

  <p class="text-[15px] text-brand sm:text-[17px]">
    {t('tapluckTagline')}
  </p>

  <p
    class="max-w-[340px] text-[15px] leading-relaxed text-brand-secondary"
  >
    {t('tapluckSubline')}
  </p>

  <div class="flex flex-col items-center gap-3">
    <div class="flex flex-col gap-2.5">
      {
        stores.map((store) =>
          store.url ? (
            <a
              href={store.url}
              target="_blank"
              rel="noopener"
              class="inline-flex w-[200px] items-center justify-center gap-2 rounded-full bg-accent px-[26px] py-[11px] text-[15px] text-on-accent no-underline transition-colors duration-200 hover:bg-accent-hover"
            >
              <Icon name={store.icon} class="h-5 w-5" />
              {store.label}
            </a>
          ) : (
            <span
              aria-disabled="true"
              class="inline-flex w-[200px] cursor-default items-center justify-center gap-2 rounded-full border border-white/20 px-[26px] py-[11px] text-[15px] text-brand-secondary"
            >
              <Icon name={store.icon} class="h-5 w-5" />
              {store.label}
            </span>
          ),
        )
      }
    </div>
    {
      !allLive && (
        <span class="text-xs uppercase tracking-wide text-brand-muted">
          {t('tapluckComingSoon')}
        </span>
      )
    }
  </div>

  <ul class="flex max-w-[320px] flex-wrap justify-center gap-2">
    {
      modes.map((mode) => (
        <li class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[13px] text-brand-secondary">
          <Icon name={mode.icon} class="h-4 w-4" />
          {mode.label}
        </li>
      ))
    }
  </ul>

  <a
    href={homeHref}
    class="text-xs text-brand-muted no-underline transition-colors hover:text-brand-secondary"
  >
    {t('tapluckByStudio')}
  </a>
</main>

<footer class="p-6 text-center text-xs text-brand-muted">
  {t('footerCopyright')}
</footer>
```

- [ ] **Step 2: Create `src/pages/apps/tapluck.astro`**

```astro
---
import MainLayout from '../../layouts/MainLayout.astro';
import TapLuckHero from '../../components/TapLuckHero.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const alternates = {
  en: '/apps/tapluck',
  es: '/es/apps/tapluck',
  ca: '/ca/apps/tapluck',
};
---

<MainLayout
  title={t('tapluckName')}
  description={t('tapluckMetaDescription')}
  alternates={alternates}
>
  <TapLuckHero />
</MainLayout>
```

- [ ] **Step 3: Type-check**

Run: `npm run check`
Expected: 0 errors. (Confirms every `t('tapluck*')` key exists and the icon imports resolve.)

- [ ] **Step 4: Build and verify the English output**

Run: `npm run build`
Expected: build succeeds; `dist/apps/tapluck/index.html` is generated.

Run: `grep -c "Everyone taps. Luck picks." dist/apps/tapluck/index.html`
Expected: `1`

Run: `grep -o "Coming soon" dist/apps/tapluck/index.html`
Expected: `Coming soon` (placeholder state active, since both URLs are null)

Run: `grep -o "App Store" dist/apps/tapluck/index.html; grep -o "Google Play" dist/apps/tapluck/index.html`
Expected: `App Store` and `Google Play` each print.

- [ ] **Step 5: Format**

Run: `npm run format`
Expected: files formatted (Prettier with `prettier-plugin-astro`); re-run `npm run check` if anything changed.

- [ ] **Step 6: Commit**

```bash
git add src/components/TapLuckHero.astro src/pages/apps/tapluck.astro
git commit -m "feat: add TapLuck app page (en)"
```

---

## Task 4: Spanish and Catalan pages

Same page wired for the other two locales. The component reads the language from the URL, so these only differ by import depth and the (identical) alternates map.

**Files:**
- Create: `src/pages/es/apps/tapluck.astro`
- Create: `src/pages/ca/apps/tapluck.astro`

- [ ] **Step 1: Create `src/pages/es/apps/tapluck.astro`**

Note the import depth: this file is three levels under `src/pages/`, so imports use `../../../`.

```astro
---
import MainLayout from '../../../layouts/MainLayout.astro';
import TapLuckHero from '../../../components/TapLuckHero.astro';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const alternates = {
  en: '/apps/tapluck',
  es: '/es/apps/tapluck',
  ca: '/ca/apps/tapluck',
};
---

<MainLayout
  title={t('tapluckName')}
  description={t('tapluckMetaDescription')}
  alternates={alternates}
>
  <TapLuckHero />
</MainLayout>
```

- [ ] **Step 2: Create `src/pages/ca/apps/tapluck.astro`**

```astro
---
import MainLayout from '../../../layouts/MainLayout.astro';
import TapLuckHero from '../../../components/TapLuckHero.astro';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const alternates = {
  en: '/apps/tapluck',
  es: '/es/apps/tapluck',
  ca: '/ca/apps/tapluck',
};
---

<MainLayout
  title={t('tapluckName')}
  description={t('tapluckMetaDescription')}
  alternates={alternates}
>
  <TapLuckHero />
</MainLayout>
```

- [ ] **Step 3: Build and verify localized output**

Run: `npm run build`
Expected: build succeeds; `dist/es/apps/tapluck/index.html` and `dist/ca/apps/tapluck/index.html` generated.

Run: `grep -c "Todos ponen el dedo. La suerte elige." dist/es/apps/tapluck/index.html`
Expected: `1`

Run: `grep -c "Tots hi posen el dit. La sort tria." dist/ca/apps/tapluck/index.html`
Expected: `1`

Run: `grep -o 'hreflang="[a-z-]*" href="[^"]*tapluck[^"]*"' dist/es/apps/tapluck/index.html`
Expected: alternate links for `en` → `.../apps/tapluck`, `es` → `.../es/apps/tapluck`, `ca` → `.../ca/apps/tapluck`, plus `x-default` → `.../apps/tapluck`.

- [ ] **Step 4: Confirm the known language-switcher behavior (links to home)**

Run: `grep -o 'href="/es/"' dist/apps/tapluck/index.html; grep -o 'href="/ca/"' dist/apps/tapluck/index.html`
Expected: `href="/es/"` and `href="/ca/"` print.

> **Known limitation (per spec — header left unchanged):** `LanguageSwitcher.astro` calls `getRelativeLocaleUrl(code)` with **no path argument**, which returns each locale's *home* (`/es/`, `/ca/`), not the current page. So switching language from `/apps/tapluck` lands on the other language's **home**, not its TapLuck page. This matches the spec (`§4`: header from `MainLayout`, sin cambios) and is acceptable for this simple version. Making the switcher path-aware is a separate, sitewide enhancement — do **not** change it here. If the grep above instead shows `/es/apps/tapluck`, the switcher was already made path-aware elsewhere; note it and move on.

- [ ] **Step 5: Commit**

```bash
git add src/pages/es/apps/tapluck.astro src/pages/ca/apps/tapluck.astro
git commit -m "feat: add TapLuck app page (es, ca)"
```

---

## Task 5: Documentation

Keep `docs/` current (required by `CLAUDE.md`; docs are written in Spanish).

**Files:**
- Modify: `docs/BRIEF.md`
- Modify: `docs/DESIGN.md`

- [ ] **Step 1: Update `docs/BRIEF.md`**

In the "Páginas previstas" section, change the `/apps/[slug]` line to note TapLuck is built. Replace:

```markdown
## Páginas previstas
- Home: hero, lista de apps, links sociales
- /apps/[slug]: página individual de cada app
- /apps/[slug]/privacy: política de privacidad por app
- /apps/[slug]/terms: términos y condiciones por app
```

with:

```markdown
## Páginas previstas
- Home: hero, lista de apps, links sociales
- /apps/[slug]: página individual de cada app
  - **/apps/tapluck — construida** (versión simple pre-capturas: icono, tagline, modos y badges de stores como placeholder; se rehará para incluir capturas cuando las exijan las tiendas)
- /apps/[slug]/privacy: política de privacidad por app
- /apps/[slug]/terms: términos y condiciones por app
```

- [ ] **Step 2: Document the app-page pattern in `docs/DESIGN.md`**

Append this section at the end of `docs/DESIGN.md` (after section 10, before "Resumen en una frase" — i.e. insert it immediately above the `## Resumen en una frase` heading):

```markdown
## 11. Página de app (`/apps/[slug]`)

Patrón para la página de presentación de una app, estrenado con **TapLuck** (`/apps/tapluck`). Misma paleta y layout de una sola pantalla que el `Hero`: columna centrada `flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center`, dentro de `MainLayout`. El componente vive en `src/components/<App>Hero.astro` y las rutas son páginas finas por idioma (`src/pages/apps/<slug>.astro` + `es/` + `ca/`).

Orden vertical: icono de la app (`96×96`, `rounded-[22px]`, con `width`/`height`) → nombre (`h1`, tipografía de marca) → tagline (`text-brand`) → subline funcional (`text-brand-secondary`, `max-w-[340px]`) → badges de stores → modos como chips (`bg-white/5 text-brand-secondary rounded-full`) → enlace "Una app de Dice and Code" a la home → footer de copyright.

**Badges de stores (patrón de descarga):** dos constantes `appStoreUrl`/`googlePlayUrl` en el frontmatter del componente.
- `null` → píldora **deshabilitada** (`border border-white/20 text-brand-secondary`, sin `href`, `aria-disabled="true"`) y una microetiqueta "Próximamente" (`text-xs uppercase tracking-wide text-brand-muted`) bajo el par.
- URL definida → píldora **activa** estilo CTA (`bg-accent hover:bg-accent-hover text-on-accent rounded-full`), con `target="_blank" rel="noopener"`. Cuando ambas tienen URL, la etiqueta "Próximamente" desaparece.

Iconos de store con `astro-icon`: `simple-icons:appstore` y `simple-icons:googleplay` (heredan el color del texto). Los `hreflang` se emiten pasando una prop `alternates` (mapa code→path) a `MainLayout`.

**Sin capturas todavía:** esta primera versión se apoya en icono + copy + badges. Cuando existan capturas se ampliará la vista (probablemente con sección de scroll), fuera del patrón mínimo actual.
```

- [ ] **Step 3: Verify docs still build the site (no code touched, sanity only)**

Run: `npm run build`
Expected: build succeeds (docs are not part of the build, but this confirms the tree is still healthy before committing).

- [ ] **Step 4: Commit**

```bash
git add docs/BRIEF.md docs/DESIGN.md
git commit -m "docs: document TapLuck page and app-page pattern"
```

---

## Final verification

- [ ] **Build clean from scratch**

Run: `npm run build`
Expected: succeeds; these files exist: `dist/apps/tapluck/index.html`, `dist/es/apps/tapluck/index.html`, `dist/ca/apps/tapluck/index.html`.

- [ ] **Type-check and format check**

Run: `npm run check` (expected: 0 errors) and `npm run format:check` (expected: all files formatted).

- [ ] **Manual visual pass (optional but recommended)**

Run: `npm run preview`, open `http://localhost:4321/apps/tapluck`, `/es/apps/tapluck`, `/ca/apps/tapluck`. Confirm: icon renders, copy is localized, both badges show disabled with a single "Coming soon", four mode chips show with icons, language switcher in the header moves between the localized TapLuck pages, layout is centered and mobile-first.

---

## Notes for the implementer

- **Palette:** do not introduce colors outside `docs/DESIGN.md`. Only black, the grey scale, blue `#0071e3`, and white opacities (`white/5`, `white/20`) are used here.
- **No client JS.** Everything is static; the only interactive element (language switcher) is already a native `<details>` in `MainLayout`.
- **Activating downloads later:** set `appStoreUrl` / `googlePlayUrl` in `TapLuckHero.astro` to real URLs — the badges become active CTAs and "Coming soon" disappears automatically. No markup changes needed.
- **Icon name fallback:** all icon names are verified present in the installed sets (`simple-icons:appstore`, `simple-icons:googleplay`, `mdi:gesture-tap`, `mdi:format-list-numbered`, `mdi:account-group`, `mdi:palette`). If a build error reports an unknown icon, check the installed set version rather than guessing a new name.
