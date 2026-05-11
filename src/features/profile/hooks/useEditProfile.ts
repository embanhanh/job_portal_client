"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserSchema, type UpdateUserInput } from "@/features/auth/schemas/update-user.schema";
import { authService } from "@/services/auth/auth.service";
import type { User } from "@/features/auth/types/auth.type";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

interface UseEditProfileProps {
  user: User;
  onOpenChange: (open: boolean) => void;
}

export function useEditProfile({ user, onOpenChange }: UseEditProfileProps) {
  const t = useTranslations("profile");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user.avatar || null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => authService.updateProfile(formData),
    onSuccess: () => {
      toast.success(t("update_success"));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      onOpenChange(false);
      router.refresh();
    },
    onError: () => {
      toast.error(t("update_failed"));
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: UpdateUserInput) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    if (values.phone) formData.append("phone", values.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    mutation.mutate(formData);
  };

  return {
    form,
    isPending: mutation.isPending,
    avatarPreview,
    handleAvatarChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
