'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Copy, Languages, Loader2 } from 'lucide-react';
import type { LocaleConfig } from '@/config/locales';
import { LocaleTabShell } from './LocaleTabShell';
import {
  TranslationFieldRenderer,
  type FieldConfig,
} from './TranslationFieldRenderer';
import { useMultilingualForm } from '@/hooks/useMultilingualForm';

interface MultilingualFormSectionProps {
  locales: LocaleConfig[];
  fields: FieldConfig[] | ((locale: string) => FieldConfig[]);
  translationsPath?: string;
  onAutoTranslate?: (from: string, to: string) => Promise<void>;
  title?: string;
  description?: string;
}

export function MultilingualFormSection({
  locales,
  fields,
  translationsPath = 'translations',
  onAutoTranslate,
  title,
  description,
}: MultilingualFormSectionProps) {
  const t = useTranslations('common.multilingual');
  const [isTranslating, setIsTranslating] = React.useState<Record<string, boolean>>({});
  
  const { errorPerLocale, copyFromLocale } = useMultilingualForm({
    locales,
    translationsPath,
  });

  const defaultLocale = locales[0]?.locale;
  // React Compiler handles memoization — no useMemo needed
  const resolvedFields = typeof fields === 'function' ? fields(defaultLocale ?? '') : fields;
  const fieldNames = resolvedFields.map((f) => f.name);

  const handleTranslate = async (locale: string) => {
    if (!onAutoTranslate || !defaultLocale) return;
    
    setIsTranslating((prev) => ({ ...prev, [locale]: true }));
    try {
      await onAutoTranslate(defaultLocale, locale);
    } finally {
      setIsTranslating((prev) => ({ ...prev, [locale]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <LocaleTabShell
        locales={locales}
        hasErrorPerLocale={errorPerLocale}
        defaultLocale={defaultLocale}
      >
        {(currentLocale) => {
          const currentFields = typeof fields === 'function' ? fields(currentLocale) : fields;
          const isDefault = currentLocale === defaultLocale;

          return (
            <div className="space-y-6">
              {!isDefault && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2">
                    {t('tools')}
                  </span>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => copyFromLocale(defaultLocale, currentLocale, fieldNames)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {t('copy_from', { locale: locales[0].flag })}
                  </Button>

                  {onAutoTranslate && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      disabled={isTranslating[currentLocale]}
                      onClick={() => handleTranslate(currentLocale)}
                    >
                      {isTranslating[currentLocale] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Languages className="h-3.5 w-3.5" />
                      )}
                      {t('translate_from', { locale: locales[0].flag })}
                    </Button>
                  )}
                </div>
              )}

              <TranslationFieldRenderer
                fieldPath={`${translationsPath}.${currentLocale}`}
                fields={currentFields}
              />
            </div>
          );
        }}
      </LocaleTabShell>
    </div>
  );
}
