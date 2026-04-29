"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { registerSchema, RegisterInput } from "@/features/auth/schemas/register.schema";
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
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export function RegisterForm() {
  const t = useTranslations("auth.register_page");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authService.register(data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      
      if (typeof document !== "undefined") {
        document.cookie = `${AUTH_KEYS.ACCESS_TOKEN_COOKIE}=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        if (data.user?.role) {
          document.cookie = `user_role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      }

      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
      
      const role = data.user.role;
      if (role === Role.EMPLOYER) {
        router.push("/employer/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (err: Error) => {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  });

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: Role.CANDIDATE,
    },
  });

  function onSubmit(values: RegisterInput) {
    setError(null);
    registerUser(values);
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
                    autoComplete="new-password"
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
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("role_label")}</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={field.value === Role.CANDIDATE ? "default" : "outline"}
                      className="w-full"
                      onClick={() => field.onChange(Role.CANDIDATE)}
                    >
                      {t("role_candidate")}
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === Role.EMPLOYER ? "default" : "outline"}
                      className="w-full"
                      onClick={() => field.onChange(Role.EMPLOYER)}
                    >
                      {t("role_employer")}
                    </Button>
                  </div>
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
        {t("has_account")}{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t("login_link")}
        </Link>
      </div>
    </div>
  );
}
