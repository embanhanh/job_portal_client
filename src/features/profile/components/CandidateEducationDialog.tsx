"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { useCandidateEducation } from "../hooks/useCandidateEducation";
import type { EducationInput } from "@/features/candidate/schemas/candidate.schema";
import type { Education } from "@/features/candidate/types/candidate.type";

interface CandidateEducationDialogProps {
  education?: Education;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateEducationDialog({
  education,
  open,
  onOpenChange,
}: CandidateEducationDialogProps) {
  const t = useTranslations("profile.candidate");
  const { form, isPending, onSubmit } = useCandidateEducation({ education, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{education ? t("edit_education", { fallback: "Sửa học vấn" }) : t("add_education")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField<EducationInput>
              control={form.control as any}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("school_name", { fallback: "Tên trường" })}</FormLabel>
                  <FormControl>
                    <Input {...field} value={(field.value as string) || ""} placeholder="Ví dụ: Đại học Bách Khoa" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField<EducationInput>
                control={form.control as any}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("degree", { fallback: "Bằng cấp" })}</FormLabel>
                    <FormControl>
                      <Input {...field} value={(field.value as string) || ""} placeholder="Ví dụ: Cử nhân" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<EducationInput>
                control={form.control as any}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field_of_study", { fallback: "Ngành học" })}</FormLabel>
                    <FormControl>
                      <Input {...field} value={(field.value as string) || ""} placeholder="Ví dụ: Công nghệ thông tin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField<EducationInput>
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

              <FormField<EducationInput>
                control={form.control as any}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("end_date", { fallback: "Ngày kết thúc" })}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={(field.value as string) || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<EducationInput>
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description", { fallback: "Mô tả" })}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      value={field.value as string}
                      placeholder={t("edu_desc_placeholder", { fallback: "Mô tả quá trình học tập của bạn..." })} 
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
