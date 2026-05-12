"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES } from "@/lib/constants/locations";

export function HomeSearch() {
  const t = useTranslations("common.search");
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location && location !== "all") params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto bg-background/95 backdrop-blur-sm p-2 rounded-2xl md:rounded-full shadow-lg border border-border/50 gap-2 md:gap-0"
    >
      <div className="flex items-center w-full md:flex-1 px-4 py-2">
        <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t("placeholder")}
          className="border-0 shadow-none focus-visible:ring-0 px-0 text-base bg-transparent w-full"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-border mx-2 shrink-0" />

      <div className="flex items-center w-full md:w-64 px-4 py-2 border-t md:border-t-0 border-border">
        <MapPin className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
        <Select
          value={location}
          onValueChange={(val) => setLocation(val || "")}
        >
          <SelectTrigger className="border-0 shadow-none focus:ring-0 px-0 h-auto bg-transparent w-full">
            <SelectValue placeholder={t("locationPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">{t("allLocations")}</SelectItem>
            {PROVINCES.map((prov) => (
              <SelectItem key={prov.id} value={prov.name}>
                {prov.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full md:w-auto rounded-xl md:rounded-full px-8 py-6 text-base font-semibold transition-transform active:scale-95 mt-2 md:mt-0"
      >
        {t("button")}
      </Button>
    </form>
  );
}
