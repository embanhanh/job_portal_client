"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LOCALES } from "@/config/locales";
import { useRouter, usePathname } from "@/i18n/routing";

export function LocaleSwitcher() {
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Sử dụng router.replace từ next-intl/navigation được export từ routing.ts
    // Đảm bảo truyền đúng cấu trúc tham số
    router.replace(pathname || "/", { locale: newLocale as any });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full h-9 w-9 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all outline-none"
        aria-label="Change language"
      >
        <Globe className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl p-1 shadow-xl border-muted/50 bg-background"
      >
        {APP_LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc.locale}
            onClick={() => handleLocaleChange(loc.locale)}
            className={cn(
              "flex items-center justify-between rounded-lg cursor-pointer transition-colors px-2 py-2 outline-none",
              locale === loc.locale
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted",
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{loc.flag}</span>
              <span className="text-sm">
                {tCommon(`languages.${loc.locale}`)}
              </span>
            </span>
            {locale === loc.locale && (
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
