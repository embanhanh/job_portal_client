import axios from "axios";
import { AUTH_ENDPOINTS } from "./endpoints";
import { BASE_API_CONFIG } from "./config";
import { getRequestLocale } from "./locale";

// Client riêng để tránh interceptor loop khi refresh
const refreshClient = axios.create(BASE_API_CONFIG);

refreshClient.interceptors.request.use(
  async (config) => {
    config.headers["Accept-Language"] = await getRequestLocale();
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Gọi POST /auth/refresh — cookie refresh_token tự đính kèm nhờ withCredentials.
 * BE sẽ set lại cookie access_token mới. FE không cần xử lý token thủ công.
 */
export const refreshTokenFlow = async (): Promise<void> => {
  await refreshClient.post(AUTH_ENDPOINTS.REFRESH);
};
