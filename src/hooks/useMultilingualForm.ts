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
    const translationErrors = errors[translationsPath as keyof typeof errors] as
      | Record<string, unknown>
      | undefined;
    
    // Check if the locale itself has an error (flat mode) or if any sub-fields have errors (nested mode)
    acc[locale] = !!translationErrors?.[locale];
    return acc;
  }, {} as Record<string, boolean>);

  /**
   * Generates the full path for a field within a specific locale.
   * Example: getFieldPath('vi', 'name') -> "translations.vi.name"
   */
  const getFieldPath = (locale: string, fieldName?: string) => {
    return fieldName ? `${translationsPath}.${locale}.${fieldName}` : `${translationsPath}.${locale}`;
  };

  /**
   * Copies field values from one locale to another.
   */
  const copyFromLocale = (from: string, to: string, fieldNames: string[]) => {
    const rootValues = getValues(translationsPath);
    const fromValues = rootValues?.[from];
    if (fromValues === undefined) return;

    fieldNames.forEach((fieldName) => {
      // Handle flat mode (fieldName is empty)
      if (fieldName === "") {
        if (typeof fromValues === "string") {
          setValue(getFieldPath(to), fromValues, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        return;
      }

      // Handle nested mode
      if (typeof fromValues === "object" && fromValues !== null && fromValues[fieldName] !== undefined) {
        setValue(getFieldPath(to, fieldName), fromValues[fieldName], {
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
