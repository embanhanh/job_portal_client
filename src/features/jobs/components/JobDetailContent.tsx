"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Send,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "../types/job.type";
import { cn, formatCurrency, getLocalizedValue } from "@/lib/utils";
import { toast } from "sonner";
import { Container } from "@/components/craft";

interface JobDetailContentProps {
  job: Job;
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  const locale = useLocale();
  const t = useTranslations("jobs.common");
  const detailT = useTranslations("jobs.detail");

  const title = getLocalizedValue(job.title, locale);
  const description = getLocalizedValue(job.description, locale);
  const requirements = getLocalizedValue(job.requirements, locale);
  const benefits = getLocalizedValue(job.benefits, locale);

  const company = job.company;
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
      : t("salary_negotiable");

  return (
    <Container className="space-y-8">
      {/* Header Card */}
      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative h-20 w-20 rounded-2xl border bg-muted/30 shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.companyName}
                fill
                className="object-cover"
              />
            ) : (
              <Briefcase className="h-10 w-10 text-muted-foreground/50" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold Poppins text-foreground">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium">
              <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {company.companyName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location?.name || t("remote")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString(locale)
                  : t("just_now")}
              </span>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              size="lg"
              onClick={() =>
                toast.info("Tính năng ứng tuyển đang được phát triển!")
              }
            >
              <Send className="mr-2 h-4 w-4" />
              {detailT("apply_now")}
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Section */}
          <section className="bg-white border rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">
              {detailT("description")}
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description || detailT("no_description")}
            </div>
          </section>

          {/* Requirements Section */}
          <section className="bg-white border rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">
              {detailT("requirements")}
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {requirements || detailT("no_requirements")}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="bg-white border rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">
              {detailT("benefits")}
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {benefits || detailT("no_benefits")}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="bg-white border rounded-2xl p-6 space-y-6 sticky top-24">
            <h3 className="font-bold text-lg border-b pb-4">
              {detailT("job_summary")}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    {t("salary")}
                  </p>
                  <p className="font-bold text-green-600">{salaryRange}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    {t("location")}
                  </p>
                  <p className="font-semibold">
                    {job.location?.name || t("on_site")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    {t("type")}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-primary/5 text-primary border-primary/20"
                  >
                    {t(`types.${job.type}`)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    {t("category")}
                  </p>
                  <p className="font-semibold">
                    {job.category
                      ? getLocalizedValue(job.category.name, locale)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    {detailT("expired_at")}
                  </p>
                  <p className="font-semibold">
                    {job.expiredAt
                      ? new Date(job.expiredAt).toLocaleDateString(locale)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {job.jobSkills && job.jobSkills.length > 0 && (
              <div className="pt-4 border-t space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  {detailT("skills")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.jobSkills.map((js) => (
                    <Badge
                      key={js.id}
                      variant="outline"
                      className="font-medium hover:bg-muted"
                    >
                      {js.skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() =>
                  toast.info("Tính năng ứng tuyển đang được phát triển!")
                }
              >
                <Send className="mr-2 h-4 w-4" />
                {detailT("apply_now")}
              </Button>
            </div>
          </section>

          {/* Company Card Mini */}
          <section className="bg-white border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h4 className="font-bold">{detailT("about_company")}</h4>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {company.companyName}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-bold"
            >
              {detailT("view_company_profile")}
            </Button>
          </section>
        </div>
      </div>
    </Container>
  );
}
