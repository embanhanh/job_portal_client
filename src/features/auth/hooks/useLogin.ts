import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { LoginInput } from "@/features/auth/schemas/login.schema";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      // Save to cookie for middleware
      if (typeof document !== "undefined") {
        document.cookie = `${AUTH_KEYS.ACCESS_TOKEN_COOKIE}=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        // Save role for middleware
        if (data.user?.role) {
          document.cookie = `user_role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      }
      // Invalidate 'me' query to fetch the user profile and update the whole app
      queryClient.invalidateQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
    },
  });
};
