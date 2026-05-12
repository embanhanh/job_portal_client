import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { applicationService } from "@/services/application/application.service";
import { ApplyJobInput } from "../schemas/application.schema";

export function useApplyJob(onSuccess?: () => void) {
  const t = useTranslations("jobs.apply_job");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyJobInput & { cvSource: "profile" | "new" }) => {
      const { cvSource, ...values } = data;
      return applicationService.apply({
        ...values,
        // If using profile CV, we don't send the 'cv' file field
        cv: cvSource === "new" ? values.cv : undefined,
      });
    },
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (message === "You have already applied for this job") {
        toast.error(t("already_applied"));
      } else {
        toast.error(t("error"));
      }
    },
  });
}
