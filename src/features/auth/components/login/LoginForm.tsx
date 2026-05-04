"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login.schema";

export function LoginForm() {
  const t = useTranslations("auth.login_page");
  const tCommon = useTranslations("auth.validation");
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();
  const [error, setError] = useState<string | null>(null);

  type ValidationKey = Parameters<typeof tCommon>[0];

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      await login(data);
      // Assuming successful login will handle redirection via hook or middleware,
      // but let's push to home or dashboard as fallback.
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
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
                  {form.formState.errors.email?.message && (
                    <FormMessage>
                      {tCommon(form.formState.errors.email.message as ValidationKey)}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>{t("password_label")}</FormLabel>
                    <Button variant="link" className="p-0 h-auto font-normal text-xs" type="button">
                      {t("forgot_password")}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      placeholder={t("password_placeholder")}
                      type="password"
                      autoComplete="current-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.password?.message && (
                    <FormMessage>
                      {tCommon(form.formState.errors.password.message as ValidationKey)}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {error && (
              <div className="text-[0.8rem] font-medium text-destructive">
                {error}
              </div>
            )}

            <Button disabled={isPending} className="w-full mt-2" type="submit">
              {isPending ? t("loading") : t("submit_button")}
            </Button>
          </form>
        </Form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        {t("no_account")}{" "}
        <Button variant="link" className="p-0 h-auto font-normal" onClick={() => router.push("/register")}>
          {t("register_link")}
        </Button>
      </p>
    </div>
  );
}
