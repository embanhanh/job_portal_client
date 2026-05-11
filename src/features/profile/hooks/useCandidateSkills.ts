"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { candidateService } from "@/services/candidate/candidate.service";
import { masterService } from "@/services/job/job.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

export function useCandidateSkills() {
  const t = useTranslations("profile.candidate");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: allSkills = [], isLoading: isLoadingAllSkills } = useQuery({
    queryKey: ["master-skills"],
    queryFn: () => masterService.getSkills(),
  });

  const mutation = useMutation({
    mutationFn: (skillIds: string[]) => candidateService.syncSkills(skillIds),
    onSuccess: () => {
      toast.success(t("skills_update_success", { fallback: "Cập nhật kỹ năng thành công!" }));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      router.refresh();
    },
    onError: () => {
      toast.error(t("skills_update_failed", { fallback: "Cập nhật kỹ năng thất bại!" }));
    },
  });

  return {
    allSkills,
    isLoadingAllSkills,
    updateSkills: mutation.mutate,
    isPending: mutation.isPending,
  };
}
