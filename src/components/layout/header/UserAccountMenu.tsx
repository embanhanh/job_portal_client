"use client";

import { useTranslations } from "next-intl";
import {
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Building2,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Role } from "@/features/auth";
import { User } from "@/features/auth";

interface UserAccountMenuProps {
  user: User;
}

export function UserAccountMenu({ user }: UserAccountMenuProps) {
  const tUserMenu = useTranslations("header.user_menu");
  const { logout, isPending: isLoggingOut } = useLogout();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user.role === Role.ADMIN;
  const isEmployer = user.role === Role.EMPLOYER;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full pl-1 pr-2 py-1 h-auto hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10 outline-none">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs shadow-inner overflow-hidden">
          {user.fullName ? (
            getInitials(user.fullName)
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
        </div>
        <span className="hidden sm:inline-block max-w-[120px] truncate text-sm font-semibold Poppins">
          {user.fullName}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl p-2 shadow-2xl border-muted/40 animate-in fade-in-0 zoom-in-95 bg-background"
      >
        <div className="flex items-center gap-3 p-3 mb-2 bg-muted/30 rounded-xl">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            {user.fullName ? getInitials(user.fullName) : "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate Poppins">
              {user.fullName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>

        <Link href="/profile">
          <DropdownMenuItem className="rounded-lg cursor-pointer py-2.5 transition-all hover:bg-primary/5 hover:text-primary">
            <UserIcon className="mr-3 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">{tUserMenu("profile")}</span>
          </DropdownMenuItem>
        </Link>

        {isEmployer && (
          <Link href="/employer/dashboard">
            <DropdownMenuItem className="rounded-lg cursor-pointer py-2.5 transition-all hover:bg-primary/5 hover:text-primary">
              <Building2 className="mr-3 h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">
                {tUserMenu("company_management")}
              </span>
            </DropdownMenuItem>
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin/dashboard">
            <DropdownMenuItem className="rounded-lg cursor-pointer py-2.5 transition-all hover:bg-primary/5 hover:text-primary">
              <LayoutDashboard className="mr-3 h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">
                {tUserMenu("admin_dashboard")}
              </span>
            </DropdownMenuItem>
          </Link>
        )}

        <Link href="/settings">
          <DropdownMenuItem className="rounded-lg cursor-pointer py-2.5 transition-all hover:bg-primary/5 hover:text-primary">
            <Settings className="mr-3 h-4 w-4 opacity-70" />
            <span className="text-sm font-medium">{tUserMenu("settings")}</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="rounded-lg cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive transition-all"
        >
          <LogOut className="mr-3 h-4 w-4 opacity-70" />
          <span className="text-sm font-bold">{tUserMenu("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
