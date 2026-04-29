"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, LoginInput } from "@/features/auth/schemas/login.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Role } from "@/features/auth/enums/auth.enum";

export function LoginForm() {
  const t = useTranslations("auth.login_page");
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    setError(null);
    login(values, {
      onSuccess: (data) => {
        const role = data.user.role;
        if (role === Role.EMPLOYER) {
          router.push("/employer/dashboard");
        } else if (role === Role.ADMIN) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      },
      onError: (err: Error) => {
        setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      },
    });
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
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
                <FormMessage />
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
                    autoComplete="current-password"
                    disabled={isPending}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && (
            <div className="p-3 text-sm font-medium text-danger bg-danger/10 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t("loading") : t("submit_button")}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm text-muted-foreground">
        {t("no_account")}{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t("register_link")}
        </Link>
      </div>
    </div>
  );
}
