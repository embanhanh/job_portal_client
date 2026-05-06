import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Poppins, IBM_Plex_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";
import { AuthStoreInitializer } from "@/features/auth/components/AuthStoreInitializer";
import Providers from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

/* ─── Fonts (Professional Skill: Poppins + IBM Plex Mono) ─── */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* ─── Static Params ─── */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* ─── Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/icons/logo.png",
    },
  };
}

/* ─── Layout ─── */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_KEYS.ACCESS_TOKEN_COOKIE)?.value || null;

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <AuthStoreInitializer accessToken={accessToken} />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
