"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job/job.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks/useMe";

interface SavedJobButtonProps {
  jobId: string;
  className?: string;
}

export function SavedJobButton({ jobId, className }: SavedJobButtonProps) {
  const t = useTranslations("jobs.detail");
  const { data: user } = useMe();
  const queryClient = useQueryClient();

  // Query to get the current status (saved/applied)
  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ["job-status", jobId, user?.id],
    queryFn: () => jobService.getUserJobStatus(jobId),
    enabled: !!user && user.role === "candidate",
  });

  const isSaved = status?.isSaved || false;

  const { mutate: toggleSave, isPending } = useMutation({
    mutationFn: () => jobService.saveJob(jobId),
    onSuccess: (data) => {
      queryClient.setQueryData(["job-status", jobId, user?.id], (old: any) => ({
        ...old,
        isSaved: data.saved,
      }));

      toast.success(data.saved ? t("saved") : t("unsave_job"));
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save jobs.");
      return;
    }

    if (user.role !== "candidate") {
      return;
    }

    toggleSave();
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className={cn(
        "rounded-md border-border hover:bg-accent transition-all",
        isSaved && "text-destructive border-destructive/20 bg-destructive/5",
        className,
      )}
      onClick={handleToggle}
      disabled={
        isPending || isStatusLoading || !user || user.role !== "candidate"
      }
      title={isSaved ? t("unsave_job") : t("save_job")}
    >
      <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
    </Button>
  );
}
