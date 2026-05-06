import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/LoginForm";

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
  return <LoginForm />;
}
