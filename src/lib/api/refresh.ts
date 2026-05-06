import axios from "axios";
import { AUTH_ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { ApiResponse } from "./types";
import { BASE_API_CONFIG } from "./config";
import { getRequestLocale } from "./locale";

// Create a bypassed client specifically for refreshing to avoid interceptor loops
const refreshClient = axios.create(BASE_API_CONFIG);

refreshClient.interceptors.request.use(
  async (config) => {
    config.headers["Accept-Language"] = await getRequestLocale();
    return config;
  },
  (error) => Promise.reject(error),
);

export const refreshTokenFlow = async (): Promise<string | null> => {
  try {
    console.log("[Refresh] Đang gọi API refresh...");
    const response = await refreshClient.post<
      ApiResponse<{ accessToken: string }>
    >(AUTH_ENDPOINTS.REFRESH);

    const { accessToken } = response.data.data!;
    console.log("[Refresh] Nhận accessToken mới thành công");

    // Update Zustand
    useAuthStore.getState().setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error("[Refresh] Gọi API refresh thất bại:", error);
    // Refresh failed -> clear state
    useAuthStore.getState().clearAuth();
    return null;
  }
};
