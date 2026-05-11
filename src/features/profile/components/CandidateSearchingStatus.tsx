"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { candidateService } from "@/services/candidate/candidate.service";
import { Loader2 } from "lucide-react";

interface CandidateSearchingStatusProps {
  isSearching: boolean;
}

export function CandidateSearchingStatus({ isSearching: initialValue }: CandidateSearchingStatusProps) {
  const t = useTranslations("profile.candidate");
  const router = useRouter();
  const [isSearching, setIsSearching] = React.useState(initialValue);
  const [isPending, setIsPending] = React.useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsPending(true);
    try {
      await candidateService.updateProfile({ isSearching: checked });
      setIsSearching(checked);
      toast.success(t("update_success", { fallback: "Cập nhật thành công!" }));
      router.refresh();
    } catch (error) {
      toast.error(t("update_failed", { fallback: "Cập nhật thất bại!" }));
      // Revert state on error
      setIsSearching(!checked);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-primary/5 border-primary/10">
      <div className="space-y-0.5">
        <Label htmlFor="searching-status" className="text-base font-bold">
          {t("searching_status", { fallback: "Trạng thái tìm việc" })}
        </Label>
        <p className="text-sm text-muted-foreground">
          {isSearching 
            ? t("is_searching", { fallback: "Đang bật chế độ tìm việc. Nhà tuyển dụng có thể tìm thấy bạn." }) 
            : t("not_searching", { fallback: "Đang tắt chế độ tìm việc." })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        <Switch
          id="searching-status"
          checked={isSearching}
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
