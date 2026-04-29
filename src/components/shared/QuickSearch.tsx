"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface QuickSearchProps {
  className?: string;
}

export function QuickSearch({ className }: QuickSearchProps) {
  const t = useTranslations("navigation");

  return (
    <div className={cn("relative group w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <input 
        type="text" 
        placeholder={t("find_job")} 
        className="w-full bg-muted/50 border border-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-hidden"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 pointer-events-none">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
}
