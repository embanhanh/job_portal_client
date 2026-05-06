import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "@/services/auth/auth.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";
import { useAuthStore } from "@/features/auth/model/auth.store";

export const useMe = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const query = useQuery({
    queryKey: [AUTH_KEYS.ME_QUERY],
    queryFn: async () => {
      const response = await authService.me();
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    // Lắng nghe accessToken để bật/tắt query
    enabled: !!accessToken,
  });

  // Đồng bộ hóa dữ liệu từ TanStack Query vào Zustand Store
  useEffect(() => {
    setLoading(query.isLoading);
    if (query.data) {
      setUser(query.data);
      // Lưu role vào cookie cho middleware sau khi có data từ /me
      if (typeof document !== "undefined") {
        document.cookie = `user_role=${query.data.role}; path=/; max-age=86400; SameSite=Lax`;
      }
    } else if (!query.isLoading && query.isError) {
      setUser(null);
    }
  }, [query.data, query.isLoading, query.isError, setUser, setLoading]);

  return query;
};
