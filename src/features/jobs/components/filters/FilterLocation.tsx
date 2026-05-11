"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocations } from "../../hooks/useMasterData";

interface FilterLocationProps {
  activeLocationId: string;
  onFilterChange: (key: string, value: string | undefined) => void;
}

export function FilterLocation({ activeLocationId, onFilterChange }: FilterLocationProps) {
  const t = useTranslations("jobs.filters");
  const { data: locations } = useLocations();

  return (
    <AccordionItem value="locations" className="border-b py-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
        {t("location")}
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => onFilterChange("locationId", undefined)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
              !activeLocationId ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
            }`}
          >
            {t("all_locations")}
            {!activeLocationId && <ChevronRight className="h-4 w-4" />}
          </button>
          {locations?.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onFilterChange("locationId", loc.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                activeLocationId === loc.id ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
              }`}
            >
              {loc.name}
              {activeLocationId === loc.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
