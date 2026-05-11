"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { UserPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditProfileDialog } from "./EditProfileDialog";
import type { User } from "@/features/auth/types/auth.type";

interface ProfileHeaderActionsProps {
  user: User;
}

export function ProfileHeaderActions({ user }: ProfileHeaderActionsProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("profile");

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <UserPen className="h-4 w-4" />
        {t("edit_profile")}
      </Button>

      <EditProfileDialog 
        user={user} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
