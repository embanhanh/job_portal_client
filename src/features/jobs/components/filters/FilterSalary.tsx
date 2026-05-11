"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface FilterSalaryProps {
  salaryMin: number;
  salaryMax: number;
}

export function FilterSalary({ salaryMin, salaryMax }: FilterSalaryProps) {
  const t = useTranslations("jobs.filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [values, setValues] = useState([salaryMin, salaryMax]);

  // Sync state with props when URL changes
  useEffect(() => {
    setValues([salaryMin, salaryMax]);
  }, [salaryMin, salaryMax]);

  return (
    <AccordionItem value="salary" className="py-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
        {t("salary")}
      </AccordionTrigger>
      <AccordionContent className="pt-4 px-1">
        <div className="space-y-6">
          <Slider
            value={values}
            onValueChange={(val) => {
              if (Array.isArray(val)) {
                setValues(val as number[]);
              }
            }}
            max={100000000}
            step={1000000}
            onValueCommitted={(val) => {
              if (Array.isArray(val)) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("salaryMin", val[0].toString());
                params.set("salaryMax", val[1].toString());
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }
            }}
            className="py-4"
          />
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <div className="bg-muted px-2 py-1 rounded border">
              {formatCurrency(values[0])}
            </div>
            <div className="bg-muted px-2 py-1 rounded border">
              {formatCurrency(values[1])}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
