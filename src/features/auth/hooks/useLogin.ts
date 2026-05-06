import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { LoginInput } from "@/features/auth/schemas/login.schema";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

/**
 * Hook đăng nhập.
 * BE set HTTP-only cookie (access_token, refresh_token) sau khi login thành công.
 * FE không lưu token — chỉ invalidate ['me'] query và redirect về trang chủ.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate để các component dùng useMe() tự fetch lại user profile
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
    },
  });
};
