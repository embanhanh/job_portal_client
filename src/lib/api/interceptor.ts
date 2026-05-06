// lib/api/interceptor.ts
import { InternalAxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
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

// --- Request Interceptor ---
// Cookie access_token tự đính kèm nhờ withCredentials: true (không cần gắn header thủ công)
apiClient.interceptors.request.use(
  async (config) => {
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
      return Promise.reject(normalizeError(error));
    }

    // Đang refresh → queue request lại, chờ BE set cookie mới
    if (refreshState.isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        refreshState.failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(normalizeError(err)));
    }

    originalRequest._retry = true;
    refreshState.isRefreshing = true;

    try {
      // BE sẽ set cookie access_token mới — FE không cần làm gì thêm
      await refreshTokenFlow();
      refreshState.processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      const normalizedError = normalizeError(refreshError);
      refreshState.processQueue(normalizedError);
      // Session hết hạn → clear cache
      queryClientRef?.clear();
      return Promise.reject(normalizedError);
    } finally {
      refreshState.isRefreshing = false;
    }
  },
);
