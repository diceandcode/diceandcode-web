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
- astro-seo (meta tags y Open Graph)
- @astrojs/sitemap (sitemap automático en cada build; requiere `site` en `astro.config.mjs`)

URL de producción: `https://diceandcode.netlify.app`

## Estructura de idiomas
- Default: en
- Soportados: en, es, ca
- Detección automática por navegador, cambio manual disponible

## Páginas previstas
- Home: hero, lista de apps, links sociales
- /apps/[slug]: página individual de cada app
  - **/apps/tapluck — construida** (versión simple pre-capturas: icono, tagline, modos y badges de stores como placeholder; se rehará para incluir capturas cuando las exijan las tiendas)
- /apps/[slug]/privacy: política de privacidad por app
- /apps/[slug]/terms: términos y condiciones por app

## Convenciones
- Componentes en src/components/
- Layouts en src/layouts/ (MainLayout y LegalLayout)
- Traducciones en src/i18n/ como JSON
- Imágenes en public/images/
- Páginas legales en Markdown con LegalLayout (fondo oscuro, tipografía legible, sin animaciones)

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
