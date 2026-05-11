// lib/api/interceptor.ts
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { normalizeError } from "./error";
import { refreshTokenFlow } from "./refresh";
import { getRequestLocale } from "./locale";

// Fix: Extend type cho _retry
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let queryClientRef: QueryClient | null = null;

export const setupInterceptors = (queryClient: QueryClient) => {
  queryClientRef = queryClient;
};

// Quản lý trạng thái refresh — tránh nhiều request cùng refresh
const refreshState = {
  isRefreshing: false,
  failedQueue: [] as Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
  }>,

  processQueue(error: unknown) {
    this.failedQueue.forEach((prom) => {
      error ? prom.reject(error) : prom.resolve();
    });
    this.failedQueue = [];
  },
};

export const initializeInterceptors = (instance: AxiosInstance) => {
  // --- Request Interceptor ---
  // Tự động đính kèm locale và cookies (nếu ở server)
  instance.interceptors.request.use(
    async (config) => {
      // Gắn locale
      config.headers["Accept-Language"] = await getRequestLocale();

      // Nếu ở server (Next.js Server Component), forward cookies thủ công
      if (typeof window === "undefined") {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const cookieString = cookieStore.toString();
          if (cookieString) {
            config.headers["Cookie"] = cookieString;
          }
        } catch (error) {
          // Có thể đang ở build time hoặc không có request context
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // --- Response Interceptor ---
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as RetryableRequestConfig;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(normalizeError(error));
      }

      // Đang refresh → queue request lại, chờ BE set cookie mới
      if (refreshState.isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          refreshState.failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(normalizeError(err)));
      }

      originalRequest._retry = true;
      refreshState.isRefreshing = true;

      try {
        // BE sẽ set cookie access_token mới — FE không cần làm gì thêm
        await refreshTokenFlow();
        refreshState.processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        const normalizedError = normalizeError(refreshError);
        refreshState.processQueue(normalizedError);

        // Session hết hạn → Cập nhật cache auth về null để UI thoát trạng thái loading
        if (queryClientRef) {
          queryClientRef.setQueryData(["me"], null);
        }

        return Promise.reject(normalizedError);
      } finally {
        refreshState.isRefreshing = false;
      }
    },
  );
};
