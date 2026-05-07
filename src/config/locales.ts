export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleConfig {
  locale: SupportedLocale;
  flag: string;
}

export const APP_LOCALES: LocaleConfig[] = [
  { locale: 'vi', flag: '🇻🇳' },
  { locale: 'en', flag: '🇬🇧' },
];
