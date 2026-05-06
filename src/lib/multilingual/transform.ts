/**
 * Types for multilingual data structures.
 */
export type LocaleFirst<TLocale extends string, TFields extends string> = Record<
  TLocale,
  Record<TFields, string>
>;

export type FieldFirst<TFields extends string, TLocale extends string> = Record<
  TFields,
  Record<TLocale, string>
>;

/**
 * Converts locale-first (form state) → field-first (BE payload)
 * Example:
 * { vi: { name: "A" }, en: { name: "B" } }
 * → { name: { vi: "A", en: "B" } }
 */
export function serializeTranslations<
  TLocale extends string,
  TFields extends string
>(
  localeFirst: Partial<Record<TLocale, Partial<Record<TFields, string>>>>,
  locales: readonly TLocale[],
  fields: readonly TFields[]
): FieldFirst<TFields, TLocale> {
  const result = {} as FieldFirst<TFields, TLocale>;

  for (const field of fields) {
    result[field] = {} as Record<TLocale, string>;
    for (const locale of locales) {
      result[field][locale] = localeFirst[locale]?.[field] ?? "";
    }
  }

  return result;
}

/**
 * Converts field-first (BE response) → locale-first (form state)
 * Example:
 * { name: { vi: "A", en: "B" } }
 * → { vi: { name: "A" }, en: { name: "B" } }
 */
export function deserializeTranslations<
  TFields extends string,
  TLocale extends string
>(
  fieldFirst: Partial<Record<TFields, Partial<Record<TLocale, string>>>>,
  locales: readonly TLocale[],
  fields: readonly TFields[]
): LocaleFirst<TLocale, TFields> {
  const result = {} as LocaleFirst<TLocale, TFields>;

  for (const locale of locales) {
    result[locale] = {} as Record<TFields, string>;
    for (const field of fields) {
      result[locale][field] = fieldFirst[field]?.[locale] ?? "";
    }
  }

  return result;
}
