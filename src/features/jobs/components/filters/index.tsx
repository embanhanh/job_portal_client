"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Filter } from "lucide-react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { FilterCategory } from "./FilterCategory";
import { FilterLocation } from "./FilterLocation";
import { FilterType } from "./FilterType";
import { FilterSalary } from "./FilterSalary";

export function JobFilterSidebar() {
  const t = useTranslations("jobs.filters");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategoryId = searchParams.get("categoryId") || "";
  const activeLocationId = searchParams.get("locationId") || "";
  const activeTypes = searchParams.get("type")?.split(",") || [];
  const salaryMin = Number(searchParams.get("salaryMin")) || 0;
  const salaryMax = Number(searchParams.get("salaryMax")) || 50000000;

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-6 w-full lg:max-w-[280px]">
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          {t("title")}
        </h3>
        <Button variant="destructive" size="sm" onClick={resetFilters}>
          {t("reset")}
        </Button>
      </div>

      <Accordion
        defaultValue={["categories", "locations", "types", "salary"]}
        className="w-full border-none"
      >
        <FilterCategory
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
        />
        <FilterLocation
          activeLocationId={activeLocationId}
          onFilterChange={handleFilterChange}
        />
        <FilterType
          activeTypes={activeTypes}
          onFilterChange={handleFilterChange}
        />
        <FilterSalary salaryMin={salaryMin} salaryMax={salaryMax} />
      </Accordion>
    </div>
  );
}
