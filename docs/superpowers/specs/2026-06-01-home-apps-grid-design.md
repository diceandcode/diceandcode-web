# Spec — Home como escaparate de apps

**Fecha:** 2026-06-01
**Estado:** aprobado, pendiente de implementación
**Depende de:** la página de app `/apps/tapluck` (ya en `main`) — las tarjetas enlazan a ella.

---

## 1. Objetivo

Convertir la home de una pantalla centrada en marca + contacto a un **escaparate de apps**: el contenido principal pasa a ser un grid de apps publicadas, cada una enlazando a su página `/apps/[slug]`. Es la materialización de lo ya previsto en `BRIEF.md` ("Home: hero, lista de apps, links sociales").

Hoy hay **una sola app** (TapLuck), así que el grid muestra una tarjeta; el diseño está pensado para escalar a varias sin recablear.

## 2. Decisión de estructura (validada con wireframes)

**Opción 2 · Apps primero (escaparate).** Hero compacto arriba, grid de apps como contenido principal (idealmente visible sin scroll), contacto discreto abajo.

Descartadas: opción 1 (marca primero + scroll a sección apps) y opción 3 (todo fundido en una pantalla con contacto protagonista). La 2 prioriza las apps, que es el objetivo del sitio, sin perder el tono minimalista.

## 3. Estructura de la home (de arriba a abajo, centrada)

1. **Hero compacto:** logo (40×40, `rounded-[10px]`) + `brandName` (`Dice and Code`) + `heroTagline` (`Apps crafted with code & a little luck.`). Se mantiene la tagline de marca para ubicar al visitante frío.
2. **Sección de apps:** etiqueta sutil `appsSectionLabel` (mayúsculas, tracking, `text-brand-muted`) + grid de tarjetas.
3. **Contacto discreto:** `ctaContact` (`Get in touch`) como **botón fantasma** (borde `white/20`, `text-brand-secondary`, hover a `text-brand`), mismo `mailto` actual. Deja de ser el botón azul sólido — el protagonismo pasa a las apps.
4. **Footer:** `footerCopyright` (`© 2026 Dice and Code`).

**Fuera de alcance:** links a redes sociales (los menciona `BRIEF.md` pero no entran aquí); hueco/placeholder "próxima app" en el grid (con 1 app se vería vacío).

## 4. Grid y tarjeta

**Grid:** `flex flex-wrap justify-center gap-3` con ancho contenido. En móvil las tarjetas ocupan el ancho completo y se apilan; en `sm`+ tienen ancho fijo (`sm:w-[300px]`) y se reparten en fila centrada, envolviendo cuando haya más de dos. Con una sola app, la tarjeta queda **centrada** (ventaja de usar flex+wrap+justify-center frente a `grid-cols-2`, que dejaría la única tarjeta descentrada).

**Tarjeta de app (`AppCard`):** toda la tarjeta es un enlace `<a>` a la página localizada de la app. Contenido: icono (44×44, `rounded-[11px]`) + nombre + tagline corta + flecha `→`. Estilo coherente con el resto: `bg-white/5 border border-white/10 rounded-2xl`, hover sutil (`hover:bg-white/[0.07] hover:border-white/20`, `transition-colors duration-200`). Texto alineado a la izquierda dentro de la tarjeta; nombre `text-brand` semibold, tagline `text-brand-secondary`.

**Destino:** `/apps/[slug]` localizado vía `getRelativeLocaleUrl(lang, \`apps/${slug}\`)` (la antesala con los badges de descarga). No enlaza directo a stores.

## 5. Datos y arquitectura

Patrón de **páginas finas** intacto: `index.astro` (+ `es/`, `ca/`) siguen renderizando `MainLayout` + un único componente de cuerpo de home.

**Módulo de datos — `src/data/apps.ts`:**
Lista tipada de apps publicadas. Sin Content Collection todavía (YAGNI con 1 app; se migrará si crece). Forma:

```ts
import type { TranslationKey } from '../i18n/utils';

export interface App {
  slug: string;
  icon: string;          // ruta en /public
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

Escalar = añadir una entrada (y su página `/apps/[slug]`).

**Componentes nuevos:**
- `src/components/AppCard.astro` — recibe una `App` por props; resuelve `lang`/`t` y el `href` localizado; renderiza la tarjeta-enlace.
- `src/components/AppsGrid.astro` — importa `apps`, renderiza la etiqueta de sección y mapea `apps` → `AppCard`.

**Refactor del cuerpo de la home:**
El actual `src/components/Hero.astro` contiene el hero monolítico (logo → marca → tagline → CTA azul) + footer + email. Se **renombra a `src/components/Home.astro`** y se reestructura para componer: hero compacto (logo + marca + tagline) → `<AppsGrid />` → contacto fantasma → footer. El email de contacto y las clases reutilizables se conservan. Las 3 páginas `index` pasan a importar `Home` en lugar de `Hero`.

> Nota: el componente de la página de app sigue llamándose `TapLuckHero.astro` y no se toca. El "hero" que se renombra es solo el de la home.

**i18n:** nueva clave `appsSectionLabel` en los tres idiomas. El nombre y la tagline de cada tarjeta **reutilizan** las claves de la app (`tapluckName`, `tapluckTagline`) vía `nameKey`/`taglineKey` — no se duplican.

| Clave | EN | ES | CA |
|-------|----|----|----|
| `appsSectionLabel` | Our apps | Nuestras apps | Les nostres apps |

## 6. Restricciones (heredadas de CLAUDE.md / DESIGN.md)

- **SSG only** — sin SSR, sin adapter, sin `prerender`.
- **Sin JS de cliente** — todo estático; tarjetas son enlaces `<a>`, sin interactividad JS.
- **Mobile-first**; paleta cerrada (negro/grises/azul `#0071e3` + opacidades de blanco) — sin colores nuevos.
- **Nada de strings hardcodeados** — todo i18n, en las tres lenguas.
- Iconos de app con `width`/`height` y `alt` (nombre de la app).
- Código/nombres en inglés; componentes en PascalCase; claves i18n en camelCase.

## 7. Documentación a actualizar tras implementar

- `docs/BRIEF.md` — marcar la lista de apps de la home como **construida**.
- `docs/DESIGN.md` — actualizar la home: deja de ser hero de CTA único; documentar el escaparate (hero compacto + sección de apps), el patrón `AppCard`/`AppsGrid`, el módulo `src/data/apps.ts`, el contacto fantasma, y el renombrado `Hero.astro` → `Home.astro`. Ajustar el diagrama de layout de la sección 5 y la mención al "Hero" en la sección 6.

## 8. Fuera de alcance

- Links a redes sociales en la home.
- Content Collection de apps (sigue siendo un array tipado por ahora).
- Placeholder "próxima app" en el grid.
- Cambios en la página `/apps/tapluck` o en `TapLuckHero.astro`.
- Selector de idioma consciente de la ruta (sigue su comportamiento actual: lleva a la home del idioma).
