import { useTranslations } from "next-intl";

export function LoginMarketing() {
  const t = useTranslations("auth.marketing");

  return (
    <div className="relative hidden h-full flex-col bg-brand-primary p-10 text-black lg:flex justify-center items-start">
      <div className="absolute inset-0 bg-linear-to-t from-brand-primary to-white/10 mix-blend-multiply" />
      <div className="relative z-20 flex items-center text-lg font-medium tracking-tight font-mono">
        {/* Placeholder for Logo if needed */}
        <span className="font-bold">JobPortal</span>
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg">
            {t("description")}
          </p>
        </blockquote>
      </div>
    </div>
  );
}
