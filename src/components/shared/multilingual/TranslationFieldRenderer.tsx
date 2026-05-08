'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ServerAwareFormMessage } from '@/features/auth/components/ServerAwareFormMessage';
import { useTranslations } from 'next-intl';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'input' | 'textarea';
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

interface TranslationFieldRendererProps {
  fieldPath: string; // e.g., "translations.vi"
  fields: FieldConfig[];
  tValidation: any;
}

export function TranslationFieldRenderer({
  fieldPath,
  fields,
  tValidation,
}: TranslationFieldRendererProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={`${fieldPath}.${field.name}`}
          control={control}
          name={field.name ? `${fieldPath}.${field.name}` : fieldPath}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                {field.type === 'textarea' ? (
                  <Textarea
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    {...formField}
                  />
                ) : (
                  <Input placeholder={field.placeholder} {...formField} />
                )}
              </FormControl>
              <ServerAwareFormMessage tCommon={tValidation} />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
