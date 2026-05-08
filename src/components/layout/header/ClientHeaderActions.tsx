"use client";

import { useTranslations } from "next-intl";
import { Building2, PlusCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks/useMe";
import { Role } from "@/features/auth/enums/auth.enum";
import { Link } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { UserAccountMenu } from "./UserAccountMenu";

export function ClientHeaderActions() {
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const { data: user, isLoading } = useMe();

  const role = user?.role || Role.CANDIDATE;

  return (
    <div className="flex items-center gap-3">
      {/* Locale Switcher */}
      <LocaleSwitcher />

      {isLoading ? (
        <div className="h-9 w-24 animate-pulse rounded-full bg-muted/60"></div>
      ) : (
        <>
          {role === Role.EMPLOYER && (
            <Link href="/employer/post-job">
              <Button className="hidden lg:flex rounded-full px-5 font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" />
                {tCommon("post_job")}
              </Button>
            </Link>
          )}

          {user ? (
            <UserAccountMenu user={user} />
          ) : (
            <Link href="/login">
              <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/25 hover:shadow-xl active:scale-95 transition-all">
                <LogIn className="mr-2 h-4 w-4" />
                {tAuth("login_page.title")}
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
