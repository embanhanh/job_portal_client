"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Globe, LogIn, LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function ClientHeaderActions() {
  const t = useTranslations("auth");
  const { data: user, isLoading } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const role = user?.role || null;

  // Giả lập Language Switcher đơn giản
  const toggleLanguage = () => {
    // Logic đổi locale sẽ được tích hợp với i18n routing
    console.log("Toggle language");
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleLanguage}
        className="rounded-full"
        aria-label="Change language"
      >
        <Globe className="h-5 w-5" />
      </Button>

      {isLoading ? (
        <div className="h-10 w-24 animate-pulse rounded-full bg-muted"></div>
      ) : (
        <>
          {role === "EMPLOYER" && (
            <Button 
              render={<Link href="/employer/post-job" />}
              className="rounded-full px-6 font-medium"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("post_job")}
            </Button>
          )}

          {role === "ADMIN" && (
            <Button 
              render={<Link href="/admin" />}
              variant="outline" 
              className="rounded-full px-6 font-medium"
            >
              {t("admin_dashboard")}
            </Button>
          )}

          {role ? (
            <Button 
              variant="outline"
              className="rounded-full px-6 font-medium"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          ) : (
            <Button 
              render={<Link href="/login" />}
              className="rounded-full px-6 font-medium"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t("login")}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
