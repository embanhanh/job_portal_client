import { User } from "lucide-react";
import type { User as UserType } from "@/features/auth/types/auth.type";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface ProfileHeaderProps {
  user: UserType;
}

import { ProfileHeaderActions } from "./ProfileHeaderActions";

export async function ProfileHeader({ user }: ProfileHeaderProps) {
  const t = await getTranslations("profile.info");

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white border rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.fullName}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none" />
        </div>

        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl font-bold Poppins tracking-tight text-foreground">
              {user.fullName}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {t("status_online", { fallback: "Online" })}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground font-medium">{user.email}</p>
          <p className="text-muted-foreground font-medium">{user.phone}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ProfileHeaderActions user={user} />
      </div>
    </div>
  );
}
