"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PROVINCES } from "@/lib/constants/locations";

interface FilterLocationProps {
  activeLocation: string;
  onFilterChange: (key: string, value: string | undefined) => void;
}

export function FilterLocation({ activeLocation, onFilterChange }: FilterLocationProps) {
  const t = useTranslations("jobs.filters");

  return (
    <AccordionItem value="locations" className="border-b py-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
        {t("location")}
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => onFilterChange("location", undefined)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
              !activeLocation ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
            }`}
          >
            {t("all_locations")}
            {!activeLocation && <ChevronRight className="h-4 w-4" />}
          </button>
          {PROVINCES.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onFilterChange("location", loc.name)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                activeLocation === loc.name ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
              }`}
            >
              {loc.name}
              {activeLocation === loc.name && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
