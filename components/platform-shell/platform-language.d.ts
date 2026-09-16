export type NavigationLocale = 'en' | 'th' | 'zh-CN' | 'zh-TW' | 'ru';
export const platformLanguages: Array<{value: NavigationLocale; short: string; label: string}>;
export function platformLanguageMarkup(locale: string): string;
