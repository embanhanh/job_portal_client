"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Building2, MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Job } from "../types/job.type";
import { cn, formatCurrency, getLocalizedValue } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  const locale = useLocale();
  const t = useTranslations("jobs.common");

  const title = getLocalizedValue(job.title, locale);
  const companyName = job.company?.companyName || "";
  const locationName = job.location || "";
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
      : t("salary_negotiable");

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group block p-5 bg-white border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 active:scale-[0.98]",
        className,
      )}
    >
      <div className="flex gap-4 items-start">
        {/* Company Logo */}
        <div className="relative h-14 w-14 rounded-lg border bg-muted/30 shrink-0 overflow-hidden flex items-center justify-center">
          {job.company?.logoUrl ? (
            <Image
              src={job.company?.logoUrl}
              alt={companyName}
              fill
              className="object-cover"
            />
          ) : (
            <Building2 className="h-7 w-7 text-muted-foreground/50" />
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg Poppins leading-tight text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 whitespace-nowrap"
            >
              {t(`types.${job.type}`)}
            </Badge>
          </div>

          <p className="text-muted-foreground font-medium text-sm flex items-center gap-1.5 truncate">
            {companyName}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/70" />
              {locationName}
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-500">
              <DollarSign className="h-4 w-4" />
              {salaryRange}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {job.createdAt
            ? new Date(job.createdAt).toLocaleDateString(locale)
            : t("just_now")}
        </div>
        {job.category && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
            <Briefcase className="h-3.5 w-3.5" />
            {getLocalizedValue(job.category.name, locale)}
          </div>
        )}
      </div>
    </Link>
  );
}
