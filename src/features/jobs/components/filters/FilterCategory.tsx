"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCategories } from "../../hooks/useMasterData";
import { getLocalizedValue } from "@/lib/utils";

interface FilterCategoryProps {
  activeCategoryId: string;
  onFilterChange: (key: string, value: string | undefined) => void;
}

export function FilterCategory({ activeCategoryId, onFilterChange }: FilterCategoryProps) {
  const locale = useLocale();
  const t = useTranslations("jobs.filters");
  const { data: categories } = useCategories();

  return (
    <AccordionItem value="categories" className="border-b py-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
        {t("category")}
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange("categoryId", undefined)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
              !activeCategoryId ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
            }`}
          >
            {t("all_categories")}
            {!activeCategoryId && <ChevronRight className="h-4 w-4" />}
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange("categoryId", cat.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                activeCategoryId === cat.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
              }`}
            >
              {getLocalizedValue(cat.name, locale)}
              {activeCategoryId === cat.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
