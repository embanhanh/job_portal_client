import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { normalizeError } from "./error";
import { refreshTokenFlow } from "./refresh";
import { useAuthStore } from "@/features/auth/model/auth.store";

// We need a query client reference to removeQueries on logout
// We'll export a setup function that takes the queryClient from the app root
let queryClientRef: QueryClient | null = null;

export const setupInterceptors = (queryClient: QueryClient) => {
  queryClientRef = queryClient;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    // 1. Attach Auth Token
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach Accept-Language Header
    let locale = "vi"; // Default fallback
    if (typeof window !== "undefined") {
      // Client-side: Read from the HTML lang attribute
      locale = document.documentElement.lang || "vi";
    } else {
      // Server-side: Read from next-intl (dynamic server context)
      try {
        const { getLocale } = await import("next-intl/server");
        const serverLocale = await getLocale();
        if (serverLocale) {
          locale = serverLocale;
        }
      } catch (error) {
        // Ignore if not in a server request context
      }
    }
    config.headers["Accept-Language"] = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Automatically return response.data for typed service consumption
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshTokenFlow();

      if (newToken) {
        processQueue(null, newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } else {
        processQueue(error, null);
        isRefreshing = false;
        // On refresh fail, we clear query cache
        if (queryClientRef) {
          queryClientRef.removeQueries({ queryKey: ["me"] });
        }
        return Promise.reject(normalizeError(error));
      }
    }

    // For non-401 errors, or if 401 but _retry is already true
    return Promise.reject(normalizeError(error));
  }
);
