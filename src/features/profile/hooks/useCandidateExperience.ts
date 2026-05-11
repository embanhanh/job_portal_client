"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { experienceSchema, type ExperienceInput } from "@/features/candidate/schemas/candidate.schema";
import { candidateService } from "@/services/candidate/candidate.service";
import type { Experience } from "@/features/candidate/types/candidate.type";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

interface UseCandidateExperienceProps {
  experience?: Experience;
  onOpenChange: (open: boolean) => void;
}

export function useCandidateExperience({ experience, onOpenChange }: UseCandidateExperienceProps) {
  const t = useTranslations("profile.candidate");
  const { locale } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema) as any,
    defaultValues: {
      companyName: experience?.companyName || "",
      position: experience?.position || "",
      startDate: experience?.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : "",
      endDate: experience?.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : "",
      isCurrent: experience?.isCurrent || false,
      description: experience?.description || "",
    },
  });

  const isCurrent = form.watch("isCurrent");

  const mutation = useMutation({
    mutationFn: (values: ExperienceInput) => {
      const data = {
        ...values,
        endDate: isCurrent ? undefined : values.endDate,
      };

      if (experience) {
        return candidateService.updateExperience(experience.id, data);
      }
      return candidateService.addExperience(data);
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

  const onSubmit = async (values: ExperienceInput) => {
    mutation.mutate(values);
  };

  return {
    form,
    isPending: mutation.isPending,
    isCurrent,
    locale: locale as string,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
