import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export const useMe = () => {
  return useQuery({
    queryKey: [AUTH_KEYS.ME_QUERY],
    queryFn: async () => {
      const response = await authService.me();
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
