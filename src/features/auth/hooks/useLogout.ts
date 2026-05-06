import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { authService } from "@/services/auth/auth.service";

/**
 * Hook đăng xuất.
 * Gọi POST /auth/logout để BE clear HTTP-only cookie,
 * sau đó clear toàn bộ React Query cache và redirect về login.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push(`/${locale}/login`);
    },
    onError: () => {
      // Dù BE lỗi, vẫn clear cache phía FE để đảm bảo UI reset
      queryClient.clear();
      router.push(`/${locale}/login`);
    },
  });

  return { logout, isPending };
};
