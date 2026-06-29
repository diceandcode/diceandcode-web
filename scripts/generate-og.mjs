// Generates 1200x630 Open Graph images into public/og/.
// Run manually when branding changes: `node scripts/generate-og.mjs`.
// Not part of `npm run build` — the PNGs are committed as static assets.
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const outDir = join(pub, 'og');
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const palette = {
  bg: '#000000',
  brand: '#f5f5f7',
  secondary: '#86868b',
  accent: '#0071e3',
};

const fontData = readFileSync(
  join(pub, 'fonts/inter/inter-latin-600-normal.woff2'),
).toString('base64');

const escapeXml = (s) =>
  s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[c],
  );

function background(title, subtitle, footer) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'Inter';
        font-weight: 600;
        src: url('data:font/woff2;base64,${fontData}') format('woff2');
      }
      .title { font-family: 'Inter', sans-serif; font-weight: 600; fill: ${palette.brand}; }
      .sub { font-family: 'Inter', sans-serif; font-weight: 600; fill: ${palette.secondary}; }
      .foot { font-family: 'Inter', sans-serif; font-weight: 600; fill: ${palette.secondary}; }
    </style>
    <radialGradient id="glow" cx="50%" cy="22%" r="55%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${palette.bg}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${palette.bg}" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />
  <text x="${W / 2}" y="430" text-anchor="middle" class="title" font-size="68">${escapeXml(title)}</text>
  <text x="${W / 2}" y="488" text-anchor="middle" class="sub" font-size="30">${escapeXml(subtitle)}</text>
  ${footer ? `<text x="${W / 2}" y="572" text-anchor="middle" class="foot" font-size="22" opacity="0.8">${escapeXml(footer)}</text>` : ''}
</svg>`);
}

async function roundedIcon(srcPath, size, radius) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`,
  );
  return sharp(srcPath)
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function build({ out, title, subtitle, footer, badge }) {
  const base = sharp(background(title, subtitle, footer));
  const composites = [
    { input: badge, top: 150, left: Math.round((W - 170) / 2) },
  ];
  await base.composite(composites).png().toFile(join(outDir, out));
  console.log('wrote', join('public/og', out));
}

// Home — white logo mark
const logo = await sharp(join(pub, 'images/logo/logo_dice_and_code_white.svg'))
  .resize(170, 170, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

// TapLuck — rounded app icon
const tapluck = await roundedIcon(
  join(pub, 'images/apps/tapluck/icon.webp'),
  170,
  40,
);

await build({
  out: 'home.png',
  title: 'Dice and Code',
  subtitle: 'Mobile app studio',
  footer: 'diceandcode.netlify.app',
  badge: logo,
});

await build({
  out: 'tapluck.png',
  title: 'TapLuck',
  subtitle: 'Everyone taps. Luck picks.',
  footer: 'An app by Dice and Code',
  badge: tapluck,
});
