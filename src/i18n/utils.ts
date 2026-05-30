import en from './en.json';
import es from './es.json';
import ca from './ca.json';

export const defaultLang = 'en';

export const languages = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
} as const;

export const ui = { en, es, ca } as const;

export type Lang = keyof typeof ui;
export type TranslationKey = keyof (typeof ui)[typeof defaultLang];

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment && segment in ui) return segment as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
