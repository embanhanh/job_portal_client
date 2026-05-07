"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LocaleConfig } from "@/config/locales";
import { useTranslations } from "next-intl";
export type { LocaleConfig } from "@/config/locales";

interface LocaleTabShellProps {
  locales: LocaleConfig[];
  hasErrorPerLocale?: Record<string, boolean>;
  defaultLocale?: string;
  children: (locale: string) => React.ReactNode;
}

export function LocaleTabShell({
  locales,
  hasErrorPerLocale = {},
  defaultLocale,
  children,
}: LocaleTabShellProps) {
  const tCommon = useTranslations("common");
  const initialLocale = defaultLocale || locales[0]?.locale;

  return (
    <Tabs defaultValue={initialLocale} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        {locales.map(({ locale, flag }) => {
          const hasError = hasErrorPerLocale[locale];

          return (
            <TabsTrigger
              key={locale}
              value={locale}
              className={cn("relative flex items-center gap-2", {
                "text-destructive data-[state=active]:text-destructive":
                  hasError,
              })}
            >
              <span>{flag}</span>
              <span>{tCommon(`languages.${locale}`)}</span>
              {hasError && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {locales.map(({ locale }) => (
        <TabsContent key={locale} value={locale} className="mt-6 space-y-4">
          {children(locale)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
