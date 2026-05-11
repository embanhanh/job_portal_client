import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

/**
 * Hook lấy thông tin user hiện tại từ GET /auth/me.
 * Cookie access_token tự đính kèm — không cần quản lý token thủ công.
 * Đây là single source of truth cho auth state.
 */
export const useMe = () => {
  // Kiểm tra cookie "has_session" (không httpOnly) để làm hint
  const hasSession = typeof document !== "undefined" && document.cookie.includes("has_session=true");

  return useQuery({
    queryKey: [AUTH_KEYS.ME_QUERY],
    queryFn: () => authService.me(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: hasSession, // Chỉ gọi API nếu có hint là đang có session
  });
};
