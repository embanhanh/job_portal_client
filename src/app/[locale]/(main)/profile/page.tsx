import { getTranslations } from "next-intl/server";
import { ProfileLayout } from "@/features/profile/components/ProfileLayout";
import { ProfileInfoTab } from "@/features/profile/components/ProfileInfoTab";
import { ProfileCompanyTab } from "@/features/profile/components/ProfileCompanyTab";
import { ProfileSettingsTab } from "@/features/profile/components/ProfileSettingsTab";
import { authService } from "@/services/auth/auth.service";
import { companyService } from "@/services/company/company.service";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab = (resolvedSearchParams.tab as string) || "info";

  let user = null;
  let company = null;

  try {
    // Gọi các service gốc — Interceptor sẽ tự động xử lý cookies ở server
    [user, company] = await Promise.all([
      authService.me(),
      companyService.getMyCompany().catch(() => null),
    ]);
  } catch (error) {
    console.log(error);
    // 401 hoặc lỗi khác
  }

  const tCommon = await getTranslations("common");

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <ProfileLayout user={user} activeTab={activeTab}>
      <Suspense fallback={<div>{tCommon("loading")}...</div>}>
        {activeTab === "info" && <ProfileInfoTab user={user} />}
        {activeTab === "company" && <ProfileCompanyTab company={company} />}
        {activeTab === "settings" && <ProfileSettingsTab />}
      </Suspense>
    </ProfileLayout>
  );
}
