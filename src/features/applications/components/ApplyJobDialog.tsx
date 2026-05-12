"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn, getLocalizedValue, getFileNameFromUrl } from "@/lib/utils";
import { Job } from "@/features/jobs/types/job.type";
import {
  applyJobSchema,
  ApplyJobInput,
} from "@/features/applications/schemas/application.schema";
import { useApplyJob } from "@/features/applications/hooks/useApplyJob";
import { useMe } from "@/features/auth/hooks/useMe";
import { FileUpload } from "@/components/shared/FileUpload";

interface ApplyJobDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyJobDialog({
  job,
  open,
  onOpenChange,
}: ApplyJobDialogProps) {
  const locale = useLocale();
  const t = useTranslations("jobs.apply_job");
  const { data: user } = useMe();

  const [cvSource, setCvSource] = useState<"profile" | "new">(
    user?.candidate?.currentCvUrl ? "profile" : "new",
  );

  const { mutateAsync: applyJob, isPending } = useApplyJob(() => {
    onOpenChange(false);
    form.reset();
  });

  const form = useForm<ApplyJobInput>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      jobId: job.id,
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      coverLetter: "",
    },
  });

  // Cập nhật defaultValues khi user data thay đổi (ví dụ khi load xong)
  React.useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: ApplyJobInput) => {
    if (cvSource === "new" && !values.cv) {
      toast.error(t("cv_required"));
      return;
    }

    try {
      await applyJob({ ...values, cvSource });
    } catch (error) {
      // Error handled by hook
    }
  };

  const hasProfileCv = !!user?.candidate?.currentCvUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t("title", { jobTitle: getLocalizedValue(job.title, locale) })}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Personal Info Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2 font-heading">
                {t("personal_info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t("fullName_label")}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fullName_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t("phone_label")}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("phone_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold font-heading">
                    {t("cover_letter_label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("cover_letter_placeholder")}
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label className="font-bold font-heading">{t("cv_label")}</Label>
              <RadioGroup
                value={cvSource}
                onValueChange={(value: string) =>
                  setCvSource(value as "profile" | "new")
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div
                  className={`relative flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-all ${cvSource === "profile" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                  onClick={() => hasProfileCv && setCvSource("profile")}
                >
                  <RadioGroupItem
                    value="profile"
                    id="profile"
                    disabled={!hasProfileCv}
                  />
                  <Label
                    htmlFor="profile"
                    className="flex-1 cursor-pointer flex items-center gap-3"
                  >
                    <div
                      className={`p-2 rounded-md ${hasProfileCv ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{t("use_profile_cv")}</p>
                      {hasProfileCv ? (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {getFileNameFromUrl(user?.candidate?.currentCvUrl) ||
                            t("profile_cv_default")}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("no_cv_profile")}
                        </p>
                      )}
                    </div>
                  </Label>
                </div>

                <div
                  className={`relative flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-all ${cvSource === "new" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                  onClick={() => setCvSource("new")}
                >
                  <RadioGroupItem value="new" id="new" />
                  <Label
                    htmlFor="new"
                    className="flex-1 cursor-pointer flex items-center gap-3"
                  >
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t("upload_new_cv")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("format_hint", { size: 5 })}
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {cvSource === "new" && (
                <FileUpload
                  name="cv"
                  accept=".pdf"
                  maxSizeMB={5}
                  showPreview={false}
                  className="animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
