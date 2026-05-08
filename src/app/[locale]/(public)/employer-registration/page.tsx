"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, Building2, Clock } from "lucide-react";

import { Main, Section, Container } from "@/components/craft";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { Role } from "@/features/auth/enums/auth.enum";
import { useMyCompany } from "@/features/company/hooks/useCompany";
import { CompanyStatus } from "@/features/company/enums/company.enum";
import { EmployerRegistrationForm } from "@/features/company/components/EmployerRegistrationForm";
import { Button } from "@/components/ui/button";

export default function EmployerRegistrationPage() {
  const t = useTranslations("company.registration");
  const router = useRouter();
  const { data: company, isLoading } = useMyCompany();

  return (
    <RoleGuard roles={[Role.CANDIDATE]} fallback={null}>
      <Main>
        <Section>
          <Container>
            {isLoading ? (
              <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : company && company.status !== CompanyStatus.REJECTED ? (
              // Nếu đã có công ty (Pending hoặc Approved)
              <div className="flex flex-col items-center justify-center space-y-6 text-center py-20">
                <div className="rounded-full bg-primary/10 p-6">
                  {company.status === CompanyStatus.PENDING ? (
                    <Clock className="h-12 w-12 text-primary" />
                  ) : (
                    <Building2 className="h-12 w-12 text-primary" />
                  )}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight Poppins">
                    {company.status === CompanyStatus.PENDING
                      ? t("pending_notice")
                      : t("approved_notice")}
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {company.status === CompanyStatus.PENDING
                      ? t("pending_desc")
                      : t("approved_desc")}
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/profile?tab=company")}
                  variant="outline"
                  className="rounded-full px-8"
                >
                  {t("view_profile_btn")}
                </Button>
              </div>
            ) : (
              // Hiển thị Form đăng ký
              <EmployerRegistrationForm />
            )}
          </Container>
        </Section>
      </Main>
    </RoleGuard>
  );
}
