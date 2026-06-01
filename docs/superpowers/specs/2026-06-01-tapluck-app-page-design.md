# Spec — Página de TapLuck

**Fecha:** 2026-06-01
**Estado:** aprobado, pendiente de implementación
**Tipo:** primera página `/apps/[slug]` del sitio

---

## 1. Objetivo

Crear una página de presentación para la app **TapLuck** que sirva de antesala a los enlaces de descarga (iOS y Android). Debe ser compartible, atractiva y empujar al visitante hacia las stores. Es una versión **sencilla y pre-lanzamiento**: todavía no hay enlaces reales ni capturas. Cuando existan capturas (las que exijan App Store / Play Store), se rehará la vista para incluirlas — fuera del alcance de este spec.

## 2. Qué es TapLuck

App tipo *finger chooser* para grupos. Cada jugador pone un dedo en la pantalla y:
- **Elige uno** — selecciona uno al azar.
- **Ordena** — genera un orden aleatorio de todos en vez de elegir a uno.
- **Equipos** — eliges cuántos equipos y reparte a los jugadores.
- **Temas** — selector de apariencia para personalizar el look.

## 3. Decisiones de diseño (validadas con mockups)

| Decisión | Elección | Descartado |
|----------|----------|-----------|
| Dirección visual | **A · Estudio minimal**: negro + azul Apple `#0071e3`, 100 % fiel a Dice and Code; el icono de la app es el único color | B (acento neón de la app), C (vibrante/festivo) — chocan con el "serio, no juguetón" del estudio |
| Estructura | **1 · Una sola pantalla**, sin scroll, patrón del `Hero` actual | Página con scroll y sección "Cómo funciona" (se valorará al rehacer con capturas) |
| Enlaces de stores | **Placeholders** deshabilitados con "Coming soon" | Badges activos (no hay URLs todavía) |

**Razón de A + 1:** sin capturas y con una app desconocida, la página se apoya en icono + copy + badges. Mantener la coherencia de marca del estudio prima; la personalidad festiva de TapLuck ya la aporta su icono. Se mantiene el principio "una pantalla, un mensaje".

## 4. Estructura de la página

Columna única centrada vertical y horizontalmente (mismo patrón que `Hero.astro`: `flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center`), de arriba a abajo:

1. **Icono** de TapLuck — `96×96`, `rounded-[22px]`, con `width`/`height` explícitos (CLS). `src="/images/apps/tapluck/icon.webp"`.
2. **Nombre** — `TapLuck`, `h1`, mismo tratamiento tipográfico que la marca en el Hero (`text-[28px] sm:text-[34px] font-semibold tracking-[-0.01em] text-brand`).
3. **Tagline** (gancho) — texto `text-brand`, tamaño tagline (`text-[15px] sm:text-[17px]`).
4. **Subline** (funcional) — `text-brand-secondary`, `max-w-[340px]`, explica qué hace para un visitante frío.
5. **Badges de stores** — App Store y Google Play apilados; estado placeholder (ver §6) + microetiqueta "Coming soon".
6. **Modos** — los 4 modos como chips/píldoras discretas: Elige uno · Ordena · Equipos · Temas. Estilo `bg-white/5 text-brand-secondary rounded-full`, opcional icono `astro-icon` mdi heredando color.
7. **Atribución** — "An app by Dice and Code", enlace a la home localizada (`getRelativeLocaleUrl(lang)`), `text-brand-muted`.
8. **Footer** — `© 2026 Dice and Code` reutilizando la clave `footerCopyright` existente (vive en el componente, igual que en `Hero.astro`).

El header con `LanguageSwitcher` lo aporta `MainLayout` (absoluto, arriba a la derecha) — sin cambios.

## 5. Rutas e i18n

Sigue el patrón de **páginas finas** actual (como `src/pages/index.astro` y sus variantes), no Content Collections (YAGNI: una sola app, datos mínimos; se introducirá la colección al rehacer con capturas).

Ficheros nuevos:
- `src/pages/apps/tapluck.astro` (en)
- `src/pages/es/apps/tapluck.astro`
- `src/pages/ca/apps/tapluck.astro`

Cada uno renderiza `MainLayout` + un componente nuevo `src/components/TapLuckHero.astro` (toda la pantalla: icono → footer), análogo a cómo `index.astro` usa `Hero.astro`. El idioma se infiere de la URL con `getLangFromUrl`.

`MainLayout` ya acepta props `title`/`description`; las páginas de TapLuck pasan las suyas propias para SEO/OG.

**Alternates `hreflang`:** `MainLayout` hoy tiene los alternates de la home hardcodeados (`localizedHome`). Para que TapLuck emita sus propios alternates, hay que parametrizarlo:
- Añadir una prop opcional `alternates?: Record<string,string>` (mapa code→path) a `MainLayout`, con default al mapa de la home actual.
- Las páginas de TapLuck pasan `{ en: '/apps/tapluck', es: '/es/apps/tapluck', ca: '/ca/apps/tapluck' }`.

Todas las cadenas nuevas van a `src/i18n/{en,es,ca}.json` con prefijo `tapluck`. Claves (camelCase):

| Clave | EN | ES | CA |
|-------|----|----|----|
| `tapluckName` | TapLuck | TapLuck | TapLuck |
| `tapluckTagline` | Everyone taps. Luck picks. | Todos ponen el dedo. La suerte elige. | Tots hi posen el dit. La sort tria. |
| `tapluckSubline` | The fairest way to pick someone, set an order, or split into teams — right on your phone. | La forma más justa de elegir a alguien, ordenar el grupo o repartir equipos — en tu móvil. | La manera més justa de triar algú, ordenar el grup o fer equips — al teu mòbil. |
| `tapluckModePick` | Pick one | Elige uno | Tria un |
| `tapluckModeOrder` | Order | Ordena | Ordena |
| `tapluckModeTeams` | Teams | Equipos | Equips |
| `tapluckModeThemes` | Themes | Temas | Temes |
| `tapluckComingSoon` | Coming soon | Próximamente | Aviat |
| `tapluckByStudio` | An app by Dice and Code | Una app de Dice and Code | Una app de Dice and Code |
| `tapluckMetaDescription` | TapLuck — the finger chooser to pick someone, set an order or split into teams. | TapLuck — el finger chooser para elegir a alguien, ordenar o hacer equipos. | TapLuck — el finger chooser per triar algú, ordenar o fer equips. |

"App Store" y "Google Play" son nombres propios: literales en el componente, no se traducen.

## 6. Badges placeholder (patrón de enlaces)

En `TapLuckHero.astro`, dos constantes en el frontmatter:

```js
const appStoreUrl: string | null = null;
const googlePlayUrl: string | null = null;
```

Renderizado por badge:
- **`null`** → píldora **deshabilitada**: borde `border-white/20`, texto `text-brand-secondary`, sin `href`, `aria-disabled="true"`, no clicable. Debajo del par, la microetiqueta `tapluckComingSoon` (`text-xs text-brand-muted uppercase tracking-wide`).
- **URL definida** → píldora **activa** estilo CTA del sistema (`bg-accent hover:bg-accent-hover text-on-accent rounded-full transition-colors duration-200`), `href` a la store, `target="_blank" rel="noopener"`. Si ambas tienen URL, no se muestra "Coming soon".

Así, activar las descargas es cambiar un valor — sin tocar markup.

Iconos de store: `astro-icon` — `simple-icons:appstore` y `simple-icons:googleplay` (o equivalentes disponibles en los sets instalados; verificar el nombre exacto al implementar). Heredan el color del texto.

## 7. Restricciones (heredadas de CLAUDE.md / DESIGN.md)

- **SSG only** — sin SSR, sin adapter, sin `prerender = false`.
- **Sin JS de cliente** — todo estático; el único interactivo (idioma) ya es `<details>` nativo en el header.
- **Mobile-first**, paleta cerrada (negro/grises/azul `#0071e3`) — no introducir colores nuevos.
- **Nada de strings hardcodeados** en UI — todo vía i18n (las tres lenguas siempre).
- Imágenes con `width`/`height` explícitos. `alt` descriptivo en el icono.
- Código/nombres en inglés; componente en PascalCase (`TapLuckHero.astro`); claves i18n en camelCase.

## 8. Documentación a actualizar tras implementar

- `docs/BRIEF.md` — marcar `/apps/tapluck` como construida (deja de ser "prevista"); nota de que es página simple pre-capturas.
- `docs/DESIGN.md` — documentar el patrón de página de app (estructura de una pantalla, badges placeholder con estado activo/deshabilitado) como componente recurrente para futuras apps.

## 9. Fuera de alcance

- Capturas de pantalla y la vista ampliada que las acompañará.
- Páginas legales `/apps/tapluck/privacy` y `/apps/tapluck/terms` (van en su propio ciclo con `LegalLayout`).
- Content Collection de apps y la ruta dinámica `/apps/[slug]`.
- Enlaces reales de descarga (se rellenan las constantes cuando existan).
