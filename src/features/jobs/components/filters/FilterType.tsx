"use client";

import { useTranslations } from "next-intl";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { JobType } from "../../enums/job.enum";

interface FilterTypeProps {
  activeTypes: string[];
  onFilterChange: (key: string, value: string | undefined) => void;
}

export function FilterType({ activeTypes, onFilterChange }: FilterTypeProps) {
  const t = useTranslations("jobs.filters");
  const commonT = useTranslations("jobs.common");

  const handleTypeToggle = (type: string) => {
    const newTypes = activeTypes.includes(type)
      ? activeTypes.filter((tStr) => tStr !== type)
      : [...activeTypes, type];

    onFilterChange(
      "type",
      newTypes.length > 0 ? newTypes.join(",") : undefined,
    );
  };

  return (
    <AccordionItem value="types" className="border-b py-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
        {t("type")}
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-3 px-1">
          {Object.values(JobType).map((type) => (
            <div key={type} className="flex items-center space-x-3">
              <Checkbox
                id={`type-${type}`}
                checked={activeTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {commonT(`types.${type}`)}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
