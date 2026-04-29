import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const clearAuth = () => {
    useAuthStore.getState().clearAccessToken();
    if (typeof document !== "undefined") {
      document.cookie = `${AUTH_KEYS.ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    queryClient.removeQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
  };

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      clearAuth();
    },
    onError: () => {
      // Even if API call fails, we should clear local state
      clearAuth();
    }
  });
};
