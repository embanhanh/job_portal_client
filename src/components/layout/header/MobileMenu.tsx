"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, LogIn, PlusCircle, Globe, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useMe } from "@/features/auth/hooks/useMe";
import { Role } from "@/features/auth";
import { APP_LOCALES } from "@/config/locales";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const tNav = useTranslations("navigation");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tUserMenu = useTranslations("header.user_menu");
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = useMe();
  const role = user?.role || Role.CANDIDATE;

  const closeMenu = () => setOpen(false);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    closeMenu();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="text-xl font-bold Poppins">Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation menu
        </SheetDescription>

        <nav className="flex flex-col gap-8 mt-8">
          <div className="flex flex-col space-y-4">
            <Link
              href="/jobs"
              className="text-lg font-semibold hover:text-primary transition-colors flex items-center justify-between"
              onClick={closeMenu}
            >
              {tNav("find_job")}
            </Link>
            <Link
              href="/companies"
              className="text-lg font-semibold hover:text-primary transition-colors flex items-center justify-between"
              onClick={closeMenu}
            >
              {tNav("companies")}
            </Link>
            <Link
              href="/guide"
              className="text-lg font-semibold hover:text-primary transition-colors flex items-center justify-between"
              onClick={closeMenu}
            >
              {tNav("guide")}
            </Link>
            <Link
              href="/about"
              className="text-lg font-semibold hover:text-primary transition-colors flex items-center justify-between"
              onClick={closeMenu}
            >
              {tNav("about_us")}
            </Link>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {tCommon("language_switch")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {APP_LOCALES.map((loc) => (
                  <Button
                    key={loc.locale}
                    variant={locale === loc.locale ? "default" : "outline"}
                    className={cn(
                      "justify-center h-10 rounded-xl",
                      locale === loc.locale && "shadow-md shadow-primary/20",
                    )}
                    onClick={() => handleLocaleChange(loc.locale)}
                  >
                    <span className="mr-2">{loc.flag}</span>
                    {tCommon(`languages.${loc.locale}`)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {role === Role.CANDIDATE && (
                <Link href="/employer-registration" onClick={closeMenu}>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Building2 className="mr-3 h-5 w-5" />
                    {tCommon("post_job")}
                  </Button>
                </Link>
              )}

              {role === Role.EMPLOYER && (
                <Link href="/employer/post-job" onClick={closeMenu}>
                  <Button className="w-full justify-start h-12 rounded-xl shadow-lg shadow-primary/20">
                    <PlusCircle className="mr-3 h-5 w-5" />
                    {tCommon("post_job")}
                  </Button>
                </Link>
              )}

              {user ? (
                <Link href="/profile" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 rounded-xl"
                  >
                    <User className="mr-3 h-5 w-5" />
                    {tUserMenu("profile")}
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  <Button className="w-full justify-start h-12 rounded-xl shadow-lg shadow-primary/20">
                    <LogIn className="mr-3 h-5 w-5" />
                    {tAuth("login_page.title")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
