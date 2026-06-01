# DESIGN.md — Dice and Code

Guía de diseño del sitio. Documenta el aspecto **actual** de la web y la dirección que queremos mantener.

La web es un sitio estático generado con **Astro + Tailwind CSS**, desplegado en Netlify.
La fuente de verdad del estilo son los **theme tokens de Tailwind v4**, declarados con la directiva `@theme` en `src/styles/global.css`. Tailwind v4 es **CSS-first**: no existe `tailwind.config.mjs`. Este documento los describe y fija las reglas.

---

## 1. Tono visual de la marca

- **Estética:** Apple. Limpia, minimalista, mucho aire, sin ruido.
- **Modo:** **oscuro únicamente** (fondo negro puro). No hay modo claro.
- **Carácter:** serio y premium, no juguetón. La personalidad (el "& un poco de suerte" del dado) se transmite con el logo y el copy, no con colores llamativos ni ilustraciones.
- **Prioridad:** **mobile-first**. Todo debe verse perfecto en móvil; en escritorio el contenido se centra y respira. Nunca al revés.
- **Menos es más:** una sola pantalla, un solo mensaje, una sola acción (CTA). Si algo no aporta, fuera.

---

## 2. Paleta de colores

Negro puro de fondo, escala de grises de Apple para texto, azul Apple como único acento.

| Token (`@theme`)          | Valor       | Utilidades generadas          | Dónde se usa                          |
|---------------------------|-------------|-------------------------------|---------------------------------------|
| `--color-brand-bg`        | `#000000`   | `bg-brand-bg`                 | Fondo de página (`body`)              |
| `--color-brand`           | `#f5f5f7`   | `text-brand`                  | Texto principal, marca (`h1`)         |
| `--color-brand-secondary` | `#86868b`   | `text-brand-secondary`        | Tagline / texto de apoyo              |
| `--color-brand-muted`     | `#56565a`   | `text-brand-muted`            | Footer / texto terciario              |
| `--color-accent`          | `#0071e3`   | `bg-accent` / `text-accent`   | CTA (fondo), color de marca           |
| `--color-accent-hover`    | `#0077ed`   | `hover:bg-accent-hover`       | CTA en `:hover`                       |
| `--color-on-accent`       | `#ffffff`   | `text-on-accent`              | Texto sobre el acento (botón CTA)     |

**Regla:** el azul `#0071e3` es el **único** color de acento. No introducir otros colores de marca; cualquier énfasis nuevo se resuelve con la escala de grises o con el azul.

### Definición en `src/styles/global.css`

Tailwind v4 es **CSS-first**: los tokens se declaran con la directiva `@theme` y Tailwind genera automáticamente las utilidades correspondientes (`bg-brand-bg`, `text-brand`, `hover:bg-accent-hover`…). No hay `tailwind.config.mjs`.

```css
@import "tailwindcss";

@theme {
  --color-brand-bg: #000000;
  --color-brand: #f5f5f7;
  --color-brand-secondary: #86868b;
  --color-brand-muted: #56565a;
  --color-accent: #0071e3;
  --color-accent-hover: #0077ed;
  --color-on-accent: #ffffff;
}

@layer base {
  body {
    background-color: var(--color-brand-bg);
    color: var(--color-brand);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

Cada token bajo el namespace `--color-*` queda disponible de dos formas: como **utilidad de Tailwind** (`bg-brand-bg`, `text-brand-secondary`…) y como **CSS custom property** (`var(--color-brand-bg)`) para estilos manuales como el `body`. No hace falta duplicar los colores en un config JS.

---

## 3. Tipografía

- **Familia única: Inter**, **auto-alojada** (woff2 en `public/fonts/inter/`, declarada con `@font-face` en `src/styles/global.css`). No se carga desde Google Fonts ni Bunny Fonts: cero peticiones a terceros, máxima privacidad. Registrada como `--font-sans` en el `@theme`, por lo que es la familia por defecto de toda la web.
- **Fallback stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- **Pesos cargados:** solo **400 (Regular)** y **600 (Semibold)**. No usar otros pesos: si hace falta jerarquía, se resuelve con tamaño y color.
- **Suavizado:** activado globalmente en `body` (ver sección 2).

### Escala tipográfica

| Rol                  | Tamaño (desktop) | Tamaño (móvil) | Peso | Color                    | Notas                          |
|----------------------|------------------|----------------|------|--------------------------|--------------------------------|
| Marca (`h1`)         | `34px`           | `28px`         | 600  | `--color-text`           | `letter-spacing: -0.01em`      |
| Tagline              | `17px`           | `15px`         | 400  | `--color-text-secondary` | `line-height: 1.5`, `max-width: 340px` |
| CTA                  | `15px`           | `15px`         | 400  | `--color-on-accent`      | —                              |
| Footer               | `12px`           | `12px`         | 400  | `--color-text-muted`     | —                              |

**Reglas tipográficas:**
- Titulares grandes llevan **tracking negativo** (`-0.01em`) — detalle clave del look Apple.
- El cuerpo/tagline se limita en ancho (`max-width: 340px`) para mantener líneas cortas y legibles.
- Interlineado generoso en texto de apoyo (`leading-relaxed` en Tailwind).

### Carga de fuente (auto-alojada)

Los archivos viven en `public/fonts/inter/` y se sirven desde nuestro propio dominio. Subconjuntos `latin` y `latin-ext` (cubren acentos de es/ca) para cada peso:

```
public/fonts/inter/
├── inter-latin-400-normal.woff2
├── inter-latin-600-normal.woff2
├── inter-latin-ext-400-normal.woff2
└── inter-latin-ext-600-normal.woff2
```

Las `@font-face` (con `font-display: swap` y `unicode-range` por subconjunto) están en `src/styles/global.css`. No hace falta `<link>` a ningún CDN.

Para acelerar el primer render, cuando exista `src/layouts/MainLayout.astro` conviene **precargar** los dos pesos latinos en el `<head>`:

```astro
<link rel="preload" href="/fonts/inter/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter/inter-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
```

---

## 4. Iconografía y logo

- **Logo:** dado isométrico con el texto "DICE & CODE". SVG vectorial en `public/images/logo/`.
  - En el sitio (fondo oscuro) se usa la **variante blanca**: `logo_dice_and_code_white.svg`.
  - Tamaño en la home: **80×80px**. Declarar siempre `width` y `height` en el `<img>` para evitar layout shift (CLS).
- **Favicon:** el mark de Dice and Code (derivado del logo). Tres piezas en `public/`:
  - `favicon.svg` — primario, **adaptativo** (`prefers-color-scheme`: negro en chrome claro, blanco en oscuro), fondo transparente.
  - `favicon-32.png` — fallback raster (mark blanco sobre tile negro para garantizar contraste).
  - `apple-touch-icon.png` (180×180) — iOS/PWA, mark blanco sobre tile negro.
  - A tamaño de pestaña (16–32px) el texto incrustado no se lee (solo la silueta del dado); es esperado. Se generan desde el logo con `sharp`. Sin `.ico`: SVG + PNG cubre los navegadores actuales.
- **Iconografía general:** usar `astro-icon` con iconos lineales/sólidos monocromos. Los iconos deben heredar el color del texto y no introducir color propio.
- **No** usar emojis ni ilustraciones decorativas en la UI.

```astro
---
import { Icon } from 'astro-icon/components'
---
<Icon name="mdi:github" class="text-brand w-5 h-5" />
```

---

## 5. Espaciado y grid

Sistema basado en **múltiplos de 6/8px**, con un valor de gutter dominante de **24px** (`space-6` en Tailwind).

| Uso                          | Valor   | Tailwind       |
|------------------------------|---------|----------------|
| Ajuste fino                  | `6px`   | `mt-1.5`       |
| Gap entre elementos del hero | `24px`  | `gap-6`        |
| Padding de seguridad         | `24px`  | `p-6`          |

- **Layout:** `body` es flex column a pantalla completa (`min-h-screen flex flex-col`). El hero ocupa el espacio sobrante (`flex-1`) y centra su contenido; el footer queda anclado abajo.
- **Centrado:** todo el contenido del hero va centrado (`items-center justify-center text-center`).
- **Ritmo vertical:** los elementos del hero se separan con `gap-6`, salvo el micro-ajuste de `mt-1.5` sobre el CTA.
- **Caja de modelo:** `box-sizing: border-box` global (Tailwind lo activa por defecto con el preflight).

```
┌───────────────────────────┐
│                           │  ← p-6
│           [logo 80]       │
│            (gap-6)        │
│        Dice and Code      │  text-[34px]/text-[28px]
│            (gap-6)        │
│   Apps crafted with code  │  text-[17px]/text-[15px], max-w-[340px]
│         & a little luck.  │
│            (gap-6 + mt-1.5) │
│        ( Get in touch )   │  CTA píldora
│                           │
│         · flex-1 ·        │
├───────────────────────────┤
│      © 2026 Dice and Code │  text-xs, text-brand-muted
└───────────────────────────┘
```

---

## 6. Componentes recurrentes

### Botón CTA
El componente más característico: **botón píldora de Apple**.

- Fondo `accent` (`#0071e3`), texto blanco.
- `rounded-full` → cápsula totalmente redondeada.
- Padding `py-[11px] px-[26px]`, tamaño `text-[15px]`, peso `font-normal`.
- Transición `transition-colors duration-200`; en hover pasa a `accent-hover`.
- Sin borde, sin sombra. El color hace todo el trabajo.

```astro
<a href="/contact" class="inline-block bg-accent hover:bg-accent-hover text-on-accent text-[15px] py-[11px] px-[26px] rounded-full transition-colors duration-200 no-underline">
  Get in touch
</a>
```

### Hero
Bloque central único: logo → marca → tagline → CTA, en columna centrada con `flex flex-col items-center gap-6`. Patrón base para cualquier sección futura.

### Footer
Línea única de copyright, `text-xs text-brand-muted text-center p-6`. Discreto.

**Principios para nuevos componentes:**
- Heredan la paleta (negro / grises / azul) — no inventan color.
- Esquinas: `rounded-full` para acciones; `rounded-xl` para tarjetas si llegaran a existir.
- Transiciones cortas (`duration-200`), solo en propiedades baratas (`colors`, `opacity`, `transform`).
- Estado `hover:` siempre presente en elementos interactivos.

---

## 7. Layouts

El proyecto tiene dos layouts en `src/layouts/`:

### `MainLayout.astro`
Layout general para todas las páginas de la web (home, apps, etc.). Incluye:
- Preload de la fuente Inter y estilos globales (`global.css`)
- Meta SEO via `astro-seo` y alternates `hreflang`
- **Header** fino (`position: absolute`, arriba a la derecha) con el `LanguageSwitcher`; al ir absoluto no descentra el hero
- El **footer** vive hoy dentro de `Hero.astro` (una sola línea de copyright), no en el layout

### `LegalLayout.astro`
Layout para páginas de privacidad y términos (`/apps/[slug]/privacy`, `/apps/[slug]/terms`). Comparte el header y footer de `MainLayout` pero con cuerpo optimizado para lectura de texto legal:
- Tipografía más generosa (`text-base leading-relaxed`)
- Ancho de contenido contenido (`max-w-2xl mx-auto`)
- Sin animaciones ni elementos llamativos
- Misma paleta oscura — **no** fondo claro

---

## 8. Responsive

- **Enfoque mobile-first**: los estilos base están pensados para móvil; el escritorio simplemente dispone de más espacio.
- **Breakpoint principal:** `sm` (480px) de Tailwind para ajustes tipográficos.
- El layout (flex, centrado, gaps) no cambia entre breakpoints porque ya es fluido.
- `meta viewport` con `width=device-width, initial-scale=1.0` en el layout.
- Añadir breakpoints solo cuando un contenido nuevo lo exija; no anticipar.

---

## 9. Accesibilidad y rendimiento

- **Contraste:** texto principal `#f5f5f7` sobre `#000` y CTA blanco sobre azul `#0071e3` cumplen AA.
- **Fuentes:** auto-alojadas en `public/fonts/inter/` (woff2, sin terceros) con `font-display: swap` → sin FOIT.
- **JavaScript mínimo:** Astro genera HTML estático por defecto. No añadir JS en cliente salvo necesidad real (el selector de idioma se resuelve con `<details>` nativo, **sin JS**).
- **Imágenes con `width`/`height`** explícitos o usando el componente `<Image>` de Astro para evitar layout shift (CLS).
- `alt` descriptivo obligatorio en el logo y en capturas de apps.
- **Sitemap** generado automáticamente por `@astrojs/sitemap` en cada build.

---

## 10. i18n

- **Idiomas soportados:** `en` (default), `es`, `ca`
- Las cadenas de texto de la UI se gestionan en `src/i18n/` como archivos JSON por idioma.
- No hay diferencias de diseño entre idiomas — misma paleta, mismos componentes.
- El selector de idioma (`LanguageSwitcher.astro`) es un elemento discreto en el header: **solo un icono de globo** (`text-brand-muted`, `hover:text-brand`) que despliega un menú con los nombres nativos (English / Español / Català). Detalles:
  - Sin JS: usa `<details>`/`<summary>` nativo; el chevron rota con `group-open:rotate-180`.
  - Panel translúcido estilo Apple: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl` (solo opacidades de blanco, no colores nuevos).
  - El idioma actual va resaltado (`text-brand`) con un check; los demás en `text-brand-secondary`.
  - Los enlaces se generan con `getRelativeLocaleUrl(code)` para que sigan siendo correctos cuando existan más páginas.

---

## Resumen en una frase

**Negro puro, Inter, azul Apple `#0071e3`, una pantalla centrada, botón píldora, cero ruido — premium y mobile-first.**
