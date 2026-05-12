"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultilingualFormSection } from "@/components/shared/multilingual/MultilingualFormSection";
import { APP_LOCALES } from "@/config/locales";

import { CompanyInput, companySchema } from "../schemas/company.schema";
import { useCreateCompany } from "../hooks/useCompany";
import { CompanyGeneralInfo } from "./sections/CompanyGeneralInfo";
import { FileUpload } from "@/components/shared/FileUpload";
import { ApiException } from "@/lib/api/types";
import { ERROR_TYPES } from "@/features/auth/constants/auth.constant";

export function EmployerRegistrationForm() {
  const t = useTranslations("company.registration");
  const tForm = useTranslations("company.registration.form");
  const tValidation = useTranslations("company.validation");
  const router = useRouter();
  const { mutateAsync: createCompany, isPending } = useCreateCompany();

  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      website: "",
      address: "",
      industry: "",
      description: {
        vi: "",
        en: "",
      },
    },
  });

  const onSubmit = async (data: CompanyInput) => {
    try {
      await createCompany(data);
      toast.success(t("success_message"));
      router.push("/profile?tab=company");
      router.refresh();
    } catch (err: unknown) {
      if (!ApiException.isApiException(err)) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (err.errors) {
        Object.entries(err.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CompanyInput, {
            type: ERROR_TYPES.SERVER,
            message: messages[0],
          });
        });
        return;
      }

      toast.error(err.message);
    }
  };

  console.log(form.formState.errors);

  return (
    <Card className="mx-auto max-w-4xl border-none shadow-none bg-transparent p-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold tracking-tight Poppins">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-base">{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Section 1: Thông tin chung */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold Poppins border-b pb-2">
                1. {tForm("companyName_label")}
              </h3>
              <CompanyGeneralInfo isPending={isPending} />
            </div>

            {/* Section 2: Giới thiệu đa ngôn ngữ */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold Poppins border-b pb-2">
                2. {tForm("description_label")}
              </h3>
              <MultilingualFormSection
                locales={APP_LOCALES}
                translationsPath="description"
                tValidation={tValidation}
                fields={[
                  {
                    name: "", // Map directly to description.vi and description.en
                    label: tForm("description_label"),
                    type: "textarea",
                    placeholder: tForm("description_placeholder"),
                    rows: 5,
                    required: true,
                  },
                ]}
              />
            </div>

            {/* Section 3: Tài liệu & Hình ảnh */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold Poppins border-b pb-2">
                3. {tForm("businessLicense_label")} & Logo
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FileUpload
                  name="logo"
                  label={tForm("logo_label")}
                  accept="image/*"
                  tValidation={tValidation}
                />
                <FileUpload
                  name="businessLicense"
                  label={tForm("businessLicense_label")}
                  required
                  accept="image/*,.pdf"
                  tValidation={tValidation}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="min-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base font-semibold transition-all shadow-lg shadow-primary/20"
              >
                {isPending ? tForm("loading") : tForm("submit_button")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
