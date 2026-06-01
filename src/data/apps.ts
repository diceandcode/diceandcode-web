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
