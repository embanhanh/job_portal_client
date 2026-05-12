"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { setupInterceptors } from "@/lib/api/interceptor";
import { refreshTokenFlow } from "@/lib/api/refresh";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });

    // Inject queryClient into interceptor IMMEDIATELY
    setupInterceptors(client);
    return client;
  });

  useEffect(() => {
    // Đọc JWT từ cookie (client-readable access_token KHÔNG phải httpOnly)
    // Nếu access_token là httpOnly thì dùng has_session để tính thời gian cố định
    const REFRESH_BUFFER_MS = 2 * 60 * 1000; // Refresh trước khi hết hạn 2 phút
    const FALLBACK_INTERVAL_MS = 10 * 60 * 1000; // Fallback nếu không đọc được exp

    let timerId: ReturnType<typeof setTimeout>;

    const getTokenExp = (): number | null => {
      try {
        // Tìm access_token từ document.cookie (chỉ đọc được nếu KHÔNG httpOnly)
        const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
        if (!match) return null;
        const base64Url = match[1].split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
      } catch {
        return null;
      }
    };

    const scheduleRefresh = () => {
      if (!document.cookie.includes('has_session=true')) return;

      const exp = getTokenExp();
      // Nếu đọc được exp: refresh đúng 2 phút trước khi hết hạn
      // Nếu không (httpOnly): fallback về 10 phút cố định
      const delay = exp
        ? Math.max(exp - Date.now() - REFRESH_BUFFER_MS, 0)
        : FALLBACK_INTERVAL_MS;

      timerId = setTimeout(async () => {
        if (!document.cookie.includes('has_session=true')) return;
        try {
          await refreshTokenFlow();
        } catch {
          // Lỗi thì bỏ qua, interceptor/middleware sẽ xử lý
        }
        // Sau khi refresh xong, token mới có exp mới → lên lịch lại
        scheduleRefresh();
      }, delay);
    };

    scheduleRefresh();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
