'use client';

import { useFormContext } from 'react-hook-form';
import type { LocaleConfig } from '@/config/locales';

interface UseMultilingualFormOptions {
  locales: LocaleConfig[];
  translationsPath?: string; // default: "translations"
}

interface UseMultilingualFormReturn {
  errorPerLocale: Record<string, boolean>;
  getFieldPath: (locale: string, fieldName: string) => string;
  copyFromLocale: (from: string, to: string, fieldNames: string[]) => void;
}

export function useMultilingualForm(
  options: UseMultilingualFormOptions
): UseMultilingualFormReturn {
  const { locales, translationsPath = 'translations' } = options;
  const {
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();

  /**
   * Identifies which locales have validation errors.
   */
  const errorPerLocale = locales.reduce((acc, { locale }) => {
    // RHF's FieldErrors doesn't support dynamic nested string keys at the type level.
    // Cast to Record<string, unknown> (not `any`) to safely check nested locale errors.
    const translationErrors = errors[translationsPath as keyof typeof errors] as
      | Record<string, unknown>
      | undefined;
    acc[locale] = !!translationErrors?.[locale];
    return acc;
  }, {} as Record<string, boolean>);

  /**
   * Generates the full path for a field within a specific locale.
   * Example: getFieldPath('vi', 'name') -> "translations.vi.name"
   */
  const getFieldPath = (locale: string, fieldName: string) => {
    return `${translationsPath}.${locale}.${fieldName}`;
  };

  /**
   * Copies field values from one locale to another.
   */
  const copyFromLocale = (from: string, to: string, fieldNames: string[]) => {
    const values = getValues(translationsPath)?.[from];
    if (!values) return;

    fieldNames.forEach((fieldName) => {
      if (values[fieldName] !== undefined) {
        setValue(getFieldPath(to, fieldName), values[fieldName], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  };

  return {
    errorPerLocale,
    getFieldPath,
    copyFromLocale,
  };
}
