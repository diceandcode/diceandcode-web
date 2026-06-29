// JSON-LD structured data builders. Passed to MainLayout via the
// `structuredData` prop, which emits a <script type="application/ld+json">.

const SITE = 'https://diceandcode.netlify.app';

const base = (site: URL | undefined) => site?.origin ?? SITE;

export function organizationSchema(site: URL | undefined) {
  const origin = base(site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dice and Code',
    url: `${origin}/`,
    logo: `${origin}/images/logo/logo_dice_and_code_white.svg`,
  };
}

export function tapluckSchema(site: URL | undefined, description: string) {
  const origin = base(site);
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'TapLuck',
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Android, iOS',
    image: `${origin}/og/tapluck.png`,
    publisher: {
      '@type': 'Organization',
      name: 'Dice and Code',
      url: `${origin}/`,
    },
  };
}
