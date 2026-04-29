import { apiClient } from "@/lib/api/client";
import { USER_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";

export const userService = {
  getProfile: async () => {
    return apiClient.get<any, ApiResponse<any>>(USER_ENDPOINTS.PROFILE);
  },
};
