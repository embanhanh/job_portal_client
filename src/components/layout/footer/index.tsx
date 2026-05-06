import { useTranslations } from "next-intl";
import Link from "next/link";
import { Section, Container, Grid } from "@/components/craft";
import { Globe, Briefcase, MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="border-t bg-card text-card-foreground">
      <Section className="py-12 md:py-16">
        <Container>
          <Grid cols={4} gap={8}>
            {/* Cột 1: Thông tin công ty */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tight text-primary">
                  JobPortal<span className="text-foreground">.</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t("company_desc")}
              </p>
            </div>

            {/* Cột 2: Danh mục */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">{t("categories")}</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("it_jobs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("marketing_jobs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("design_jobs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("sales_jobs")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">{t("support")}</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Newsletter & Social */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">{t("connect")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("newsletter_desc")}
              </p>
              <div className="flex gap-4 mt-2">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      <div className="border-t py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>{tCommon("copyright", { year: new Date().getFullYear() })}</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors">
                {tCommon("language_vi")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {tCommon("language_en")}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
