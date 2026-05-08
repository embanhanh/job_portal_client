"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServerAwareFormMessage } from "@/features/auth/components/ServerAwareFormMessage";

interface CompanyGeneralInfoProps {
  isPending?: boolean;
}

export function CompanyGeneralInfo({ isPending }: CompanyGeneralInfoProps) {
  const t = useTranslations("company.registration.form");
  const tValidation = useTranslations("company.validation"); // Dùng chung schema validation
  const { control } = useFormContext();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("companyName_label")}{" "}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("companyName_placeholder")}
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <ServerAwareFormMessage tCommon={tValidation} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("industry_label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("industry_placeholder")}
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <ServerAwareFormMessage tCommon={tValidation} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("website_label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("website_placeholder")}
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <ServerAwareFormMessage tCommon={tValidation} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("address_label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("address_placeholder")}
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <ServerAwareFormMessage tCommon={tValidation} />
          </FormItem>
        )}
      />
    </div>
  );
}
