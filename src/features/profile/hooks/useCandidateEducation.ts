"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { educationSchema, type EducationInput } from "@/features/candidate/schemas/candidate.schema";
import { candidateService } from "@/services/candidate/candidate.service";
import type { Education } from "@/features/candidate/types/candidate.type";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

interface UseCandidateEducationProps {
  education?: Education;
  onOpenChange: (open: boolean) => void;
}

export function useCandidateEducation({ education, onOpenChange }: UseCandidateEducationProps) {
  const t = useTranslations("profile.candidate");
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema) as any,
    defaultValues: {
      schoolName: education?.schoolName || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      startDate: education?.startDate ? new Date(education.startDate).toISOString().split('T')[0] : "",
      endDate: education?.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
      description: education?.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: EducationInput) => {
      if (education) {
        return candidateService.updateEducation(education.id, values);
      }
      return candidateService.addEducation(values);
    },
    onSuccess: () => {
      toast.success(t("update_success", { fallback: "Thành công!" }));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      onOpenChange(false);
      router.refresh();
    },
    onError: () => {
      toast.error(t("update_failed", { fallback: "Thất bại!" }));
    },
  });

  const onSubmit = async (values: EducationInput) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
