import axios from "axios";
import { AUTH_ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { ApiResponse } from "./types";

// Create a bypassed client specifically for refreshing to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

refreshClient.interceptors.request.use(
  async (config) => {
    let locale = "vi";
    if (typeof window !== "undefined") {
      locale = document.documentElement.lang || "vi";
    } else {
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

export const refreshTokenFlow = async (): Promise<string | null> => {
  try {
    const response = await refreshClient.post<ApiResponse<{ accessToken: string }>>(AUTH_ENDPOINTS.REFRESH);
    
    // Assuming backend returns { success: true, data: { accessToken: "..." } }
    const { accessToken } = response.data.data;
    
    // Update Zustand
    useAuthStore.getState().setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    // Refresh failed -> clear state
    useAuthStore.getState().clearAccessToken();
    return null;
  }
};
