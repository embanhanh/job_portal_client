"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Loader2, Search, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCandidateSkills } from "../hooks/useCandidateSkills";
import type { CandidateSkill } from "@/features/candidate/types/candidate.type";

interface CandidateSkillsDialogProps {
  currentSkills?: CandidateSkill[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateSkillsDialog({
  currentSkills = [],
  open,
  onOpenChange,
}: CandidateSkillsDialogProps) {
  const t = useTranslations("profile.candidate");
  const { allSkills, isLoadingAllSkills, updateSkills, isPending } = useCandidateSkills();
  
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Initialize selected IDs when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedIds(currentSkills.map((s) => s.skillId));
    }
  }, [open, currentSkills]);

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSkill = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    updateSkills(selectedIds, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{t("manage_skills", { fallback: "Quản lý kỹ năng" })}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
          {/* Selected Skills */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border bg-muted/30">
            {selectedIds.length === 0 ? (
              <span className="text-sm text-muted-foreground px-2 py-1">
                {t("no_skills_selected", { fallback: "Chưa chọn kỹ năng nào" })}
              </span>
            ) : (
              selectedIds.map((id) => {
                const skill = allSkills.find((s) => s.id === id);
                return (
                  <Badge key={id} variant="default" className="gap-1 pl-3 pr-1 py-1">
                    {skill?.name || id}
                    <button
                      onClick={() => toggleSkill(id)}
                      className="ml-1 rounded-full outline-none hover:bg-primary-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_skills", { fallback: "Tìm kiếm kỹ năng..." })}
              className="pl-9"
            />
          </div>

          {/* Skills List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingAllSkills ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((s) => {
                  const isSelected = selectedIds.includes(s.id);
                  return (
                    <Badge
                      key={s.id}
                      variant={isSelected ? "secondary" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 transition-all ${
                        isSelected 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                      onClick={() => toggleSkill(s.id)}
                    >
                      {s.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t("cancel", { fallback: "Hủy" })}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save", { fallback: "Lưu" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
