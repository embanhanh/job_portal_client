"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { candidateService } from "@/services/candidate/candidate.service";

interface CandidateBioSectionProps {
  bio?: Record<string, string>;
}

export function CandidateBioSection({ bio }: CandidateBioSectionProps) {
  const t = useTranslations("profile.candidate");
  const { locale } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(bio?.[locale as string] || "");
  const [isPending, setIsPending] = React.useState(false);

  const handleSave = async () => {
    setIsPending(true);
    try {
      const newBio = { ...bio, [locale as string]: value };
      await candidateService.updateProfile({ bio: newBio });
      toast.success(t("update_success", { fallback: "Cập nhật thành công!" }));
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(t("update_failed", { fallback: "Cập nhật thất bại!" }));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("bio")}</h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            {t("edit_bio")}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isPending}>
              <X className="h-4 w-4 mr-2" />
              {t("cancel", { fallback: "Hủy" })}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {t("save", { fallback: "Lưu" })}
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("bio_placeholder", { fallback: "Giới thiệu ngắn gọn về bản thân..." })}
          className="min-h-[120px]"
        />
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {value || t("no_bio", { fallback: "Chưa có thông tin giới thiệu." })}
        </p>
      )}
    </div>
  );
}
