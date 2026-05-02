import { JOB_ENDPOINTS } from "@/lib/api/endpoints";
import { http } from "@/lib/api/http";
import { Job, JobFilter } from "@/features/jobs/types/job.type";

export const jobService = {
  getJobs: async (params?: JobFilter): Promise<Job[]> => {
    return http.get<Job[]>(JOB_ENDPOINTS.LIST, { params });
  },
  getJobById: async (id: string): Promise<Job> => {
    return http.get<Job>(JOB_ENDPOINTS.DETAIL(id));
  },
};
