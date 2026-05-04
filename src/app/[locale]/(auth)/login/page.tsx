import { getTranslations } from "next-intl/server";
import { LoginLayout } from "@/features/auth/components/login/LoginLayout";
import { LoginMarketing } from "@/features/auth/components/login/LoginMarketing";
import { LoginForm } from "@/features/auth/components/login/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login_page" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return (
    <LoginLayout
      marketingPanel={<LoginMarketing />}
      formPanel={<LoginForm />}
    />
  );
}
