import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register_page" });
  return {
    title: `${t("title")} | JobPortal`,
    description: t("subtitle"),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  // We await params even if not using it for locale, because Next.js 16/17 requires it
  await params;

  return <RegisterForm />;
}
