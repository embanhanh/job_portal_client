import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job/job.service";

export const useJobs = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const response = await jobService.getJobs(filters);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
