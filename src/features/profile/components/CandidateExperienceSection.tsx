"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Edit2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Experience } from "@/features/candidate/types/candidate.type";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";
import { CandidateExperienceDialog } from "./CandidateExperienceDialog";
import { candidateService } from "@/services/candidate/candidate.service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface CandidateExperienceSectionProps {
  experiences?: Experience[];
}

export function CandidateExperienceSection({ experiences = [] }: CandidateExperienceSectionProps) {
  const t = useTranslations("profile.candidate");
  const { locale } = useParams();
  const router = useRouter();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedExp, setSelectedExp] = React.useState<Experience | undefined>();
  const [expToDelete, setExpToDelete] = React.useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleEdit = (exp: Experience) => {
    setSelectedExp(exp);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedExp(undefined);
    setIsDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => candidateService.deleteExperience(id),
    onSuccess: () => {
      toast.success(t("delete_success", { fallback: "Xóa thành công!" }));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      setIsDeleteConfirmOpen(false);
      setExpToDelete(null);
      router.refresh();
    },
    onError: () => {
      toast.error(t("delete_failed", { fallback: "Xóa thất bại!" }));
    },
  });

  const handleDeleteClick = (id: string) => {
    setExpToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expToDelete) {
      deleteMutation.mutate(expToDelete);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("experience")}</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add_experience")}
        </Button>
      </div>

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {t("no_experience", { fallback: "Chưa có thông tin kinh nghiệm làm việc." })}
          </p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="group flex items-start gap-4 p-4 rounded-lg border bg-muted/5 transition-colors hover:bg-muted/10">
              <div className="mt-1 p-2 rounded-md bg-white border shadow-sm text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{exp.companyName}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(exp)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(exp.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {exp.position}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(exp.startDate), "MMM yyyy", { locale: dateLocale })} - 
                  {exp.isCurrent ? t("present", { fallback: "Hiện tại" }) : (exp.endDate ? format(new Date(exp.endDate), "MMM yyyy", { locale: dateLocale }) : "")}
                </p>
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CandidateExperienceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        experience={selectedExp} 
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title={t("delete_confirm_title", { fallback: "Xác nhận xóa" })}
        description={t("delete_confirm", { fallback: "Bạn có chắc chắn muốn xóa kinh nghiệm này không?" })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
