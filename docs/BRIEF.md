# Dice and Code — Project Brief

## Qué es esto
Web de marca para "Dice and Code", estudio independiente de desarrollo de apps móviles.
Web estática construida con Astro + Tailwind + Netlify.

## Propósito
- Presentar la marca y las apps publicadas
- Links a redes sociales
- Alojar páginas legales (privacy policy, terms) por app para Google AdMob, Play Store y App Store

## Stack
- Astro 6 (SSG, sin SSR)
- Tailwind CSS v4 (CSS-first vía `@tailwindcss/vite`; sin `tailwind.config.mjs`)
- Netlify (deploy estático, **sin adapter** — config en `netlify.toml`)
- i18n nativo de Astro
- astro-icon (iconos SVG via Iconify; sets `@iconify-json/simple-icons` y `@iconify-json/mdi`)
- astro-seo (meta tags, Open Graph y Twitter Card; títulos, canonical y hreflang centralizados en `MainLayout`; datos estructurados JSON-LD vía prop `structuredData` y `src/lib/schema.ts`; imágenes OG en `public/og/` generadas por `scripts/generate-og.mjs`)
- @astrojs/sitemap (sitemap automático en cada build; requiere `site` en `astro.config.mjs`; configurado con `i18n` para emitir alternates `hreflang` por idioma)

URL de producción: `https://diceandcode.netlify.app`

## Estructura de idiomas
- Default: en
- Soportados: en, es, ca
- Detección automática por navegador, cambio manual disponible

## Páginas previstas
- Home: **construida como escaparate de apps** (hero compacto + grid de apps que enlazan a su página; contacto discreto). Pendiente: links a redes sociales.
- /apps/[slug]: página individual de cada app
  - **/apps/tapluck — construida** (versión simple pre-capturas: icono, tagline, modos y badges de stores como placeholder; se rehará para incluir capturas cuando las exijan las tiendas)
- /apps/[slug]/privacy: política de privacidad por app — **construida**
- /apps/[slug]/terms: términos y condiciones por app — **construida**

  Ambas se generan desde la colección de contenido `legal` (`getStaticPaths` filtrando por `type` y `lang`) y se renderizan con `LegalLayout`. Para TapLuck el texto legal está relleno con defaults de España (responsable/desarrollador **Rubén Codina Cid**, persona física que opera bajo el nombre comercial «Dice and Code»; jurisdicción España; edad de menores 14 según LOPDGDD; contacto `hello.diceandcode@gmail.com`; Terrassa, Barcelona) y **traducido a los tres idiomas** (en/es/ca): cada ruta localizada carga el markdown de su idioma. La UI del layout (encabezados, "última actualización", enlace de vuelta) también está traducida.

## Convenciones
- Componentes en src/components/
- Layouts en src/layouts/ (MainLayout y LegalLayout)
- `BrandLink` (logo + nombre) actúa como cabecera de marca en las páginas interiores y enlaza a la home del idioma actual. Se controla con la prop `showBrand` de `MainLayout` (por defecto `true`); las páginas home la desactivan con `showBrand={false}` porque el logo del héroe ya cumple esa función.
- Traducciones en src/i18n/ como JSON
- Imágenes en public/images/
- Páginas legales en Markdown con LegalLayout (fondo oscuro, tipografía legible, sin animaciones)
- Textos legales en `src/content/legal/<slug>/` (colección `legal`, definida en `src/content.config.ts`): un archivo por documento e idioma con sufijo de idioma — `privacy-policy.{en,es,ca}.md` y `terms-of-service.{en,es,ca}.md` — cada uno con frontmatter `app`, `type` (`privacy`|`terms`), `lang` (`en`|`es`|`ca`), `title` y `lastUpdated`. Añadir legal a una app = crear su carpeta `<slug>/` con esos archivos (3 idiomas × 2 documentos); las rutas filtran por `type` + `lang` y el layout los recoge automáticamente.

## Apps publicadas
- **Tapluck** — primera app publicada, sirve como referencia para el patrón de páginas `/apps/[slug]`

## Lo que NO hace esta web
- Sin backend
- Sin base de datos
- Sin autenticación
- Sin JavaScript pesado en cliente

## Documentación
- La carpeta `docs/` contiene documentación interna del proyecto
- `docs/BRIEF.md` — visión general, stack, estructura y convenciones
- `docs/DESIGN.md` — sistema de diseño: paleta, tipografía, componentes, tono visual
