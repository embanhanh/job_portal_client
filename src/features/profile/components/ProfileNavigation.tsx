"use client";

import { cn } from "@/lib/utils";
import { User, Building2, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface ProfileNavigationProps {
  activeTab: string;
  userRole?: string;
}

export function ProfileNavigation({ activeTab, userRole }: ProfileNavigationProps) {
  const t = useTranslations("profile.navigation");

  const navItems: NavItem[] = [
    {
      id: "info",
      label: t("personal_info"),
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "company",
      label: t("company_mgmt"),
      icon: <Building2 className="h-5 w-5" />,
      roles: ["candidate", "employer"],
    },
    {
      id: "settings",
      label: t("settings"),
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="flex flex-col gap-1 p-2 bg-white border rounded-xl shadow-sm h-full">
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Menu
      </div>
      {navItems.map((item) => {
        if (item.roles && !item.roles.includes(userRole || "")) return null;

        const isActive = activeTab === item.id;

        return (
          <Link
            key={item.id}
            href={{ pathname: "/profile", query: { tab: item.id } }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
              isActive
                ? "bg-primary text-secondary shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className={cn(
              "transition-colors",
              isActive ? "text-secondary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
