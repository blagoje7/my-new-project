import sr from './sr.json';
import en from './en.json';
import nl from './nl.json';

export const languages = {
    sr,
    en,
    nl
};

export const defaultLang = 'sr';

export type Language = keyof typeof languages;

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as Language;
    return defaultLang;
}

export function useTranslations(lang: Language) {
    return function t(key: string) {
        return key.split('.').reduce((obj, k) => obj && obj[k], languages[lang] as any) || key;
    }
}

export const languageNames = {
    sr: "SR (Srpski)",
    en: "EN (English)",
    nl: "NL (Nederlands)"
};