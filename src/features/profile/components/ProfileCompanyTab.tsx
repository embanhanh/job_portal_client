import * as React from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, MapPin, Briefcase, Info, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Company } from "@/features/company/types/company.type";
import { getTranslations, getLocale } from "next-intl/server";
import { CompanyStatus } from "@/features/company/enums/company.enum";

interface ProfileCompanyTabProps {
  company: Company | null;
}

export async function ProfileCompanyTab({ company }: ProfileCompanyTabProps) {
  const t = await getTranslations("profile.company");
  const locale = await getLocale();

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="p-4 rounded-full bg-primary/10 border-4 border-primary/5 shadow-inner">
          <Building2 className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-2xl font-bold Poppins text-foreground">{t("not_registered_title")}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("not_registered_desc")}
          </p>
        </div>
        <Link
          href="/employer-registration"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-secondary rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
        >
          {t("register_now")}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  // Cấu hình trạng thái công ty
  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    [CompanyStatus.PENDING]: { label: t("status_pending"), className: "bg-amber-100 text-amber-700 border-amber-200", icon: <Info className="h-3 w-3" /> },
    [CompanyStatus.APPROVED]: { label: t("status_approved"), className: "bg-green-100 text-green-700 border-green-200", icon: <Badge className="h-3 w-3" /> },
    [CompanyStatus.REJECTED]: { label: t("status_rejected"), className: "bg-red-100 text-red-700 border-red-200", icon: <Info className="h-3 w-3" /> },
  };

  const currentStatus = statusConfig[company.status] || statusConfig[CompanyStatus.PENDING];

  return (
    <CardContent className="p-0 space-y-10">
      {/* Company Basic Info Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="h-28 w-28 rounded-2xl bg-muted flex items-center justify-center border shadow-inner shrink-0 overflow-hidden group">
          {company.logo ? (
            <img src={company.logo} alt={company.companyName} className="h-full w-full object-contain transition-transform group-hover:scale-110" />
          ) : (
            <Building2 className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold Poppins tracking-tight">{company.companyName}</h2>
            <Badge variant="outline" className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full ${currentStatus.className}`}>
              {currentStatus.icon}
              {currentStatus.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Globe className="h-4 w-4 text-primary" />
              {company.website ? (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary hover:underline flex items-center gap-1">
                  {company.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-sm italic">{t("not_updated")}</span>
              )}
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{company.industry || t("not_updated")}</span>
            </div>
            <div className="flex items-start gap-2.5 text-muted-foreground sm:col-span-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{company.address || t("not_updated")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pt-6 border-t">
        {/* Description Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-lg font-bold Poppins">{t("description_title")}</h3>
          </div>
          <div className="p-6 rounded-2xl bg-muted/5 border leading-relaxed text-muted-foreground">
            {company.description?.[locale as keyof typeof company.description] || (
              <p className="italic text-center py-4">{t("no_description")}</p>
            )}
          </div>
        </div>

        {/* Verification Alert if Pending */}
        {company.status === CompanyStatus.PENDING && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800">
            <Info className="h-6 w-6 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold">{t("verification_pending_title")}</p>
              <p className="text-sm opacity-90">{t("verification_pending_desc")}</p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
