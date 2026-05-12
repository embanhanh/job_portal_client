import { useQuery } from "@tanstack/react-query";
import { masterService } from "@/services/job/job.service";


export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => masterService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}


export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => masterService.getSkills(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
