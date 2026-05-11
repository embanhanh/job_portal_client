"use client";

import { useTranslations } from "next-intl";
import { Bell, Lock, Globe, Moon, UserX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileSettingsTab() {
  const t = useTranslations("profile.settings");

  const settingsGroups = [
    {
      title: t("security"),
      items: [
        { id: "2fa", label: t("two_fa"), icon: <Lock className="h-4 w-4" />, default: false },
        { id: "login-notify", label: t("login_notify"), icon: <Bell className="h-4 w-4" />, default: true },
      ]
    },
    {
      title: t("personalization"),
      items: [
        { id: "dark-mode", label: t("dark_mode"), icon: <Moon className="h-4 w-4" />, default: false },
        { id: "public-profile", label: t("public_profile"), icon: <Globe className="h-4 w-4" />, default: true },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold Poppins tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {settingsGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">
              {group.title}
            </h3>
            <div className="grid gap-4">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card transition-all hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/5 text-primary">
                      {item.icon}
                    </div>
                    <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                  </div>
                  <Switch id={item.id} defaultChecked={item.default} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-8 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-red-100 bg-red-50/30">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
                <UserX className="h-4 w-4" />
                {t("delete_account")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("delete_account_desc")}
              </p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-full">
              {t("delete_account")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
