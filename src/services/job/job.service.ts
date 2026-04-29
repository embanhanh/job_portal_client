import { apiClient } from "@/lib/api/client";
import { JOB_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";

export const jobService = {
  getJobs: async (params?: Record<string, any>) => {
    return apiClient.get<any, ApiResponse<any[]>>(JOB_ENDPOINTS.LIST, { params });
  },
  getJobById: async (id: string) => {
    return apiClient.get<any, ApiResponse<any>>(JOB_ENDPOINTS.DETAIL(id));
  },
};
