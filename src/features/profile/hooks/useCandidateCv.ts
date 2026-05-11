"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { candidateService } from "@/services/candidate/candidate.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export function useCandidateCv() {
  const t = useTranslations("profile.candidate");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => candidateService.uploadCv(file),
    onSuccess: () => {
      toast.success(t("upload_success", { fallback: "Tải lên CV thành công!" }));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      router.refresh();
    },
    onError: () => {
      toast.error(t("upload_failed", { fallback: "Tải lên CV thất bại!" }));
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error(t("only_pdf", { fallback: "Chỉ chấp nhận file PDF" }));
      return;
    }

    mutation.mutate(file);
  };

  return {
    isUploading: mutation.isPending,
    handleUpload,
  };
}
