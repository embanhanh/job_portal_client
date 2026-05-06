import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

/**
 * Hook lấy thông tin user hiện tại từ GET /auth/me.
 * Cookie access_token tự đính kèm — không cần quản lý token thủ công.
 * Đây là single source of truth cho auth state.
 */
export const useMe = () => {
  return useQuery({
    queryKey: [AUTH_KEYS.ME_QUERY],
    queryFn: () => authService.me(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    // Luôn enabled — nếu chưa login BE trả 401,
    // interceptor thử refresh, nếu không có session thì query error → data = undefined
  });
};
