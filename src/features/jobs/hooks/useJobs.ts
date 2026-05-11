import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job/job.service";

import { JobFilter } from "../types/job.type";

export function useJobs(filters: JobFilter) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => jobService.getJobs(filters),
    placeholderData: (previousData) => previousData, // Smooth transitions between pages
  });
}

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
  });
}
