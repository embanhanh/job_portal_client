"use client";

import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Job } from "@/features/jobs/types/job.type";
import { ApplyJobDialog } from "./ApplyJobDialog";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job/job.service";
import { useMe } from "@/features/auth/hooks/useMe";

interface ApplyButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  job: Job;
  showIcon?: boolean;
}

export function ApplyButton({
  job,
  showIcon = true,
  className,
  variant,
  size = "lg",
  ...props
}: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("jobs.detail");
  const { data: user } = useMe();

  // Query to get the current status (saved/applied)
  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ["job-status", job.id, user?.id],
    queryFn: () => jobService.getUserJobStatus(job.id),
    enabled: !!user && user.role === "candidate",
  });

  const isApplied = status?.isApplied || false;

  return (
    <>
      <Button
        size={size}
        variant={isApplied ? "outline" : variant}
        className={className}
        onClick={() => !isApplied && setIsOpen(true)}
        disabled={isApplied || isStatusLoading || (!!user && user.role !== "candidate")}
        {...props}
      >
        {isApplied ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("applied")}
          </>
        ) : (
          <>
            {showIcon && <Send className="mr-2 h-4 w-4" />}
            {t("apply_now")}
          </>
        )}
      </Button>

      <ApplyJobDialog
        job={job}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
