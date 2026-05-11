import { useTranslations } from "next-intl";
import { Briefcase, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Main, Section, Container } from "@/components/craft";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <Main>
      {/* ─── Hero Section ─── */}
      <Section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-2xl" />
        </div>

        <Container className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            JobPortal 2026
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("welcome_title")}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("welcome_desc")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 px-8 text-base font-semibold"
              aria-label={t("find_job")}
            >
              <Briefcase className="h-5 w-5" />
              {t("find_job")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 text-base font-semibold"
              aria-label={t("post_job")}
            >
              <PenLine className="h-5 w-5" />
              {t("post_job")}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10K+", label: "Việc làm" },
              { value: "5K+", label: "Công ty" },
              { value: "50K+", label: "Ứng viên" },
              { value: "98%", label: "Hài lòng" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
