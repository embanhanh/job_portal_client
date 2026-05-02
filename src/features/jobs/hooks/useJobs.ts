import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job/job.service";
import { JobFilter } from "../types/job.type";

export const useJobs = (filters?: JobFilter) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const response = await jobService.getJobs(filters);
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};
