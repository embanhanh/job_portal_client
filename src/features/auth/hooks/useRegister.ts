import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { RegisterInput } from "@/features/auth/schemas/register.schema";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

/**
 * Hook đăng ký tài khoản mới.
 * BE set HTTP-only cookie (access_token, refresh_token) sau khi đăng ký thành công.
 * FE không lưu token — chỉ invalidate ['me'] query và redirect về trang chủ.
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
    },
  });
};
