import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AUTH_KEYS } from "@/features/auth/constants/auth.constant";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    console.log("[Logout] Đang thực hiện xóa session...");
    
    // 1. Clear Zustand Store
    useAuthStore.getState().clearAuth();
    
    // 2. Clear Cookies
    if (typeof document !== "undefined") {
      document.cookie = `${AUTH_KEYS.ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      console.log("[Logout] Đã xóa Access Token và User Role khỏi Cookie");
    }

    // 3. Clear TanStack Query Cache (quan trọng để xóa thông tin user cũ)
    queryClient.removeQueries({ queryKey: [AUTH_KEYS.ME_QUERY] });
    // Có thể clear toàn bộ cache nếu muốn chắc chắn
    // queryClient.clear();
    
    console.log("[Logout] Hoàn tất đăng xuất tại Client");
  };

  return {
    logout,
    isPending: false, // Giữ lại để không làm break UI đang dùng isPending
  };
};
