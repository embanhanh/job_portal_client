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

  const rawMessage = error.message as string;
  let message = rawMessage;

  if (error.type === ERROR_TYPES.SERVER) {
    message = rawMessage;
  } else {
    const translated = tCommon(rawMessage as ValidationKey);
    // Nếu tCommon trả về đúng cái key (nghĩa là không có bản dịch), hiển thị key để debug
    message = translated === rawMessage ? `[Missing translation: ${rawMessage}]` : translated;
  }

  return <FormMessage>{message}</FormMessage>;
}
