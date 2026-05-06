// components/ui/server-aware-form-message.tsx
import { useTranslations } from "next-intl";
import { FormMessage, useFormField } from "@/components/ui/form";
import { ERROR_TYPES } from "../constants/auth.constant";

type ValidationKey = Parameters<ReturnType<typeof useTranslations>>[0];

interface Props {
  tCommon: ReturnType<typeof useTranslations>;
}

export function ServerAwareFormMessage({ tCommon }: Props) {
  const { error } = useFormField();

  if (!error?.message) return null;

  const message =
    error.type === ERROR_TYPES.SERVER
      ? error.message
      : tCommon(error.message as ValidationKey);

  return <FormMessage>{message}</FormMessage>;
}
