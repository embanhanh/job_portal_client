"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CandidateSkill } from "@/features/candidate/types/candidate.type";
import { CandidateSkillsDialog } from "./CandidateSkillsDialog";

interface CandidateSkillsSectionProps {
  skills?: CandidateSkill[];
}

export function CandidateSkillsSection({ skills = [] }: CandidateSkillsSectionProps) {
  const t = useTranslations("profile.candidate");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("skills")}</h3>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          <Edit2 className="h-4 w-4 mr-2" />
          {t("manage_skills", { fallback: "Quản lý" })}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {t("no_skills", { fallback: "Chưa có kỹ năng nào" })}
          </p>
        ) : (
          skills.map((s) => (
            <Badge 
              key={s.id} 
              variant="secondary" 
              className="px-3 py-1 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
            >
              {s.skill.name}
            </Badge>
          ))
        )}
      </div>

      <CandidateSkillsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentSkills={skills}
      />
    </div>
  );
}
