"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function JobSearchForm() {
  const t = useTranslations("jobs.search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [keyword, setKeyword] = React.useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("q", keyword.trim());
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setKeyword(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white p-2 rounded-2xl shadow-lg border border-primary/10 flex flex-col md:flex-row items-center gap-2 group focus-within:border-primary/30 transition-all duration-300"
    >
      <div className="flex-1 w-full flex items-center px-4 gap-3">
        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border-none focus-visible:ring-0 text-base h-12 px-0 placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-border" />

      <div className="shrink-0 w-full md:w-auto p-1">
        <Button type="submit" size="lg">
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
