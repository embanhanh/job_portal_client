"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Edit2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Education } from "@/features/candidate/types/candidate.type";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";
import { CandidateEducationDialog } from "./CandidateEducationDialog";
import { candidateService } from "@/services/candidate/candidate.service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface CandidateEducationSectionProps {
  educations?: Education[];
}

export function CandidateEducationSection({ educations = [] }: CandidateEducationSectionProps) {
  const t = useTranslations("profile.candidate");
  const { locale } = useParams();
  const router = useRouter();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedEdu, setSelectedEdu] = React.useState<Education | undefined>();
  const [eduToDelete, setEduToDelete] = React.useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleEdit = (edu: Education) => {
    setSelectedEdu(edu);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedEdu(undefined);
    setIsDialogOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => candidateService.deleteEducation(id),
    onSuccess: () => {
      toast.success(t("delete_success", { fallback: "Xóa thành công!" }));
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      setIsDeleteConfirmOpen(false);
      setEduToDelete(null);
      router.refresh();
    },
    onError: () => {
      toast.error(t("delete_failed", { fallback: "Xóa thất bại!" }));
    },
  });

  const handleDeleteClick = (id: string) => {
    setEduToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eduToDelete) {
      deleteMutation.mutate(eduToDelete);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("education")}</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add_education")}
        </Button>
      </div>

      <div className="space-y-4">
        {educations.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {t("no_education", { fallback: "Chưa có thông tin học vấn." })}
          </p>
        ) : (
          educations.map((edu) => (
            <div key={edu.id} className="group flex items-start gap-4 p-4 rounded-lg border bg-muted/5 transition-colors hover:bg-muted/10">
              <div className="mt-1 p-2 rounded-md bg-white border shadow-sm text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{edu.schoolName}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(edu)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(edu.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {edu.degree} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(edu.startDate), "MMM yyyy", { locale: dateLocale })} - 
                  {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy", { locale: dateLocale }) : t("present", { fallback: "Hiện tại" })}
                </p>
                {edu.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CandidateEducationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        education={selectedEdu} 
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title={t("delete_confirm_title", { fallback: "Xác nhận xóa" })}
        description={t("delete_confirm", { fallback: "Bạn có chắc chắn muốn xóa học vấn này không?" })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
