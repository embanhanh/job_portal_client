"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useRegister } from "@/features/auth/hooks/useRegister";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/register.schema";
import { Role } from "@/features/auth/enums/auth.enum";
import { ApiException } from "@/lib/api/types";
import { ServerAwareFormMessage } from "./ServerAwareFormMessage";
import { ERROR_TYPES } from "../constants/auth.constant";

export function RegisterForm() {
  const t = useTranslations("auth.register_page");
  const tCommon = useTranslations("auth.validation");
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegister();

  // Used for client-side Zod validation messages (i18n keys)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      role: Role.CANDIDATE,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data);
      toast.success(t("success_message"));
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (!ApiException.isApiException(err)) {
        // Lỗi không mong đợi: JS runtime error, network hoàn toàn chết,...
        toast.error(t("unexpected_error"));
        return;
      }

      if (err.errors) {
        // Validation errors từ server → map vào từng field
        Object.entries(err.errors).forEach(([field, messages]) => {
          form.setError(field as keyof RegisterInput, {
            type: ERROR_TYPES.SERVER,
            message: messages[0],
          });
        });
        return;
      }

      // Lỗi chung: "Email đã tồn tại", "Server error", timeout,...
      toast.error(err.message);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fullName_placeholder")}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <ServerAwareFormMessage tCommon={tCommon} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("phone_placeholder")}
                      type="tel"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <ServerAwareFormMessage tCommon={tCommon} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("email_placeholder")}
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <ServerAwareFormMessage tCommon={tCommon} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("password_placeholder")}
                      type="password"
                      autoComplete="new-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <ServerAwareFormMessage tCommon={tCommon} />
                </FormItem>
              )}
            />

            <Button disabled={isPending} className="w-full mt-2" type="submit">
              {isPending ? t("loading") : t("submit_button")}
            </Button>
          </form>
        </Form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        {t("has_account")}{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => router.push("/login")}
        >
          {t("login_link")}
        </Button>
      </p>
    </div>
  );
}
