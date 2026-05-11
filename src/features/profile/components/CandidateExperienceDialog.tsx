"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useCandidateExperience } from "../hooks/useCandidateExperience";
import type { ExperienceInput } from "@/features/candidate/schemas/candidate.schema";
import type { Experience } from "@/features/candidate/types/candidate.type";

interface CandidateExperienceDialogProps {
  experience?: Experience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateExperienceDialog({
  experience,
  open,
  onOpenChange,
}: CandidateExperienceDialogProps) {
  const t = useTranslations("profile.candidate");
  const { form, isPending, isCurrent, locale, onSubmit } = useCandidateExperience({ experience, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{experience ? t("edit_experience", { fallback: "Sửa kinh nghiệm" }) : t("add_experience")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField<ExperienceInput>
              control={form.control as any}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("company_name", { fallback: "Tên công ty" })}</FormLabel>
                  <FormControl>
                    <Input {...field} value={(field.value as string) || ""} placeholder="Ví dụ: Google" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<ExperienceInput>
              control={form.control as any}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("position", { fallback: "Chức danh" })}</FormLabel>
                  <FormControl>
                    <Input {...field} value={(field.value as string) || ""} placeholder="Ví dụ: Software Engineer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField<ExperienceInput>
                control={form.control as any}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("start_date", { fallback: "Ngày bắt đầu" })}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={(field.value as string) || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<ExperienceInput>
                control={form.control as any}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("end_date", { fallback: "Ngày kết thúc" })}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={(field.value as string) || ""} disabled={isCurrent} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<ExperienceInput>
              control={form.control as any}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("is_current_work", { fallback: "Tôi đang làm việc tại đây" })}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField<ExperienceInput>
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description", { fallback: "Mô tả công việc" })}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      value={(field.value as string) || ""}
                      placeholder={t("exp_desc_placeholder", { fallback: "Mô tả trách nhiệm và thành tựu..." })} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save", { fallback: "Lưu" })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
