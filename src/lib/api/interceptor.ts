// lib/api/interceptors.ts
import { InternalAxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { normalizeError } from "./error";
import { refreshTokenFlow } from "./refresh";
import { getRequestLocale } from "./locale"; // ✅ Reuse
import { useAuthStore } from "@/features/auth/model/auth.store";

// ✅ Fix: Extend type cho _retry thay vì dùng any
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let queryClientRef: QueryClient | null = null;

export const setupInterceptors = (queryClient: QueryClient) => {
  queryClientRef = queryClient;
};

// ✅ Encapsulate refresh state — tránh SSR module-level mutation
const refreshState = {
  isRefreshing: false,
  failedQueue: [] as Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }>,

  processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      error ? prom.reject(error) : prom.resolve(token!);
    });
    this.failedQueue = [];
  },
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Auth token
    let token = useAuthStore.getState().accessToken;

    // Dự phòng: Nếu store trống, thử đọc trực tiếp từ cookie (đề phòng Hydration/Sync delay)
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )access_token=([^;]+)"));
      if (match) {
        token = match[2];
        console.log("[API Request] Store trống nhưng tìm thấy token trong Cookie, đang sync lại store...");
        useAuthStore.getState().setAccessToken(token);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] Gắn token vào header cho: ${config.url}`);
    } else {
      console.log(`[API Request] Request không có token: ${config.url}`);
    }

    // 2. Locale — dùng shared util
    config.headers["Accept-Language"] = await getRequestLocale();

    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      // Non-401 hoặc đã retry rồi → normalize và reject
      return Promise.reject(normalizeError(error));
    }

    // --- 401 handling ---
    if (refreshState.isRefreshing) {
      console.log(`[Auth] Đang trong quá trình refresh, đưa request vào hàng đợi: ${originalRequest.url}`);
      // Đang refresh → queue lại request, chờ token mới
      return new Promise<string>((resolve, reject) => {
        refreshState.failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          console.log(`[Auth] Queue xử lý thành công, retry request: ${originalRequest.url}`);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          console.error(`[Auth] Queue xử lý thất bại: ${originalRequest.url}`);
          return Promise.reject(normalizeError(err));
        });
    }

    originalRequest._retry = true;
    refreshState.isRefreshing = true;

    try {
      console.log("[Auth] Bắt đầu luồng Refresh Token...");
      const newToken = await refreshTokenFlow();

      if (newToken) {
        console.log("[Auth] Refresh Token thành công!");
        refreshState.processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      console.warn("[Auth] Refresh Token trả về null - Session expired");
      // Refresh trả null → session hết hạn
      const sessionError = normalizeError(error);
      refreshState.processQueue(sessionError, null);

      // ✅ Clear Session sạch sẽ
      useAuthStore.getState().clearAuth();
      if (typeof document !== "undefined") {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // ✅ Clear toàn bộ cache thay vì chỉ ["me"]
      queryClientRef?.clear();

      return Promise.reject(sessionError);
    } catch (refreshError) {
      console.error("[Auth] Lỗi trong quá trình Refresh Token:", refreshError);
      // ✅ refreshTokenFlow throw unexpectedly
      const normalizedError = normalizeError(refreshError);
      refreshState.processQueue(normalizedError, null);
      
      // ✅ Clear Session sạch sẽ
      useAuthStore.getState().clearAuth();
      if (typeof document !== "undefined") {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      queryClientRef?.clear();
      return Promise.reject(normalizedError);
    } finally {
      // ✅ Luôn reset dù success hay fail
      refreshState.isRefreshing = false;
    }
  },
);
