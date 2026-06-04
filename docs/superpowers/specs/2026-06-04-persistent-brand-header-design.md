# Persistent brand header — design

> Spec language: English (code-facing). Project docs in `docs/` remain Spanish; this
> spec lives under `docs/superpowers/specs/` and follows the brainstorming convention.

## Goal

Give every interior page an easy, always-visible way back to the home — which, on this
site, **is** the apps list. A persistent brand header (logo + "Dice and Code") in the
top-left links to the localized home. The home itself does not show it (its hero logo
already serves that role). Keep the minimalist aesthetic intact: no new JS, no new colors.

## Decisions

- **Pattern:** persistent brand in the header (chosen over a text "← Home" link or a global
  footer nav). Most recognizable — a clickable logo/wordmark is universally understood as
  "back to home".
- **Where it shows:** interior pages only (app pages, legal pages). Hidden on the three
  home pages, where the large hero logo would make it redundant.
- **Toggle mechanism:** a `showBrand` prop on `MainLayout` defaulting to `true`. Only the
  home pages opt out (`showBrand={false}`). Chosen over URL auto-detection (fragile with
  trailing-slash normalization) and over passing the prop on every page (scales poorly).
  With a `true` default, future interior pages get the header automatically.

## Components

### `src/components/BrandLink.astro` (new)

- Renders an `<a>` to `getRelativeLocaleUrl(lang)` (localized home).
- Contents: the brand symbol `/images/logo/logo_dice_and_code_white.svg` at ~24–28px,
  followed by the wordmark text `t('brandName')`.
- Logo `<img>` is decorative (`alt=""`) to avoid double-announcing alongside the visible
  wordmark; the link carries `aria-label={t('navHome')}`.
- Style: understated and consistent with existing nav — `text-brand-secondary` with a
  `hover:text-brand` transition, `no-underline`, small gap between logo and text. Mirrors
  the logo + brand composition already used in `Home.astro` (separate symbol + text).

### `src/layouts/MainLayout.astro` (edit)

- Add `showBrand?: boolean` to `Props`, default `true`.
- `<header>` changes from `justify-end` to `justify-between`.
- Left slot: `<BrandLink />` when `showBrand`, otherwise an empty `<span>` (or equivalent)
  so the switcher stays pushed to the right.
- Right slot: existing `<LanguageSwitcher />`, unchanged.
- Header stays `absolute` — no layout shift; `LegalLayout`'s `pt-24` and `TapLuckHero`'s
  centered content already accommodate it.

### Pages

- `src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/ca/index.astro` — pass
  `showBrand={false}` to `MainLayout`.
- `src/pages/{,es/,ca/}apps/tapluck.astro` and `src/layouts/LegalLayout.astro` — **no
  change**; they inherit the `true` default.

## i18n

Add `navHome` to `src/i18n/en.json`, `es.json`, `ca.json` (aria-label for the brand link):

- en: `"navHome": "Dice and Code — home"`
- es: `"navHome": "Dice and Code — inicio"`
- ca: `"navHome": "Dice and Code — inici"`

Visible wordmark reuses the existing `brandName` key. No other strings.

## Constraints honored

- SSG only, no client JS, mobile-first.
- No colors outside the palette in `docs/DESIGN.md`.
- All UI text via `src/i18n/` (new `navHome` key in all three languages).

## Docs to update after implementation

- `docs/BRIEF.md` — note the persistent brand header and the `showBrand` prop convention.
- `docs/DESIGN.md` — document `BrandLink` and the interior-page header treatment.
- `CLAUDE.md` "Current state" — the header now holds `BrandLink` (interior pages) +
  `LanguageSwitcher`; mention the `showBrand` default.

## Out of scope

- Any navigation beyond "back to home" (no breadcrumbs, no per-app cross-links).
- Changes to the home layout, the language switcher, or the footers.
