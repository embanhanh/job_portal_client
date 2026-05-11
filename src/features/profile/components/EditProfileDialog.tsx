"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Camera, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEditProfile } from "../hooks/useEditProfile";
import type { User } from "@/features/auth/types/auth.type";

interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const t = useTranslations("profile");
  const { form, isPending, avatarPreview, handleAvatarChange, onSubmit } = useEditProfile({ user, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit_profile")}</DialogTitle>
          <DialogDescription>
            {t("edit_profile_desc", { fallback: "Cập nhật thông tin cá nhân của bạn tại đây." })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <Avatar className="h-24 w-24 border-2 border-muted transition-opacity group-hover:opacity-80">
                  <AvatarImage src={avatarPreview || ""} alt={user.fullName} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("avatar_hint", { fallback: "Nhấp để thay đổi ảnh đại diện" })}</p>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("full_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>{t("email")}</Label>
              <Input value={user.email} disabled className="bg-muted" />
              <p className="text-[0.8rem] text-muted-foreground">
                {t("email_disabled_hint", { fallback: "Email không thể thay đổi." })}
              </p>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0123456789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save_changes")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
