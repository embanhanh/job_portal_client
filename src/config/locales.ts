export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleConfig {
  locale: SupportedLocale;
  label: string;
  flag: string;
}

export const APP_LOCALES: LocaleConfig[] = [
  { locale: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { locale: 'en', label: 'English', flag: '🇬🇧' },
];
