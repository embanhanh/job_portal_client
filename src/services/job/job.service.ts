import { JOB_ENDPOINTS, MASTER_ENDPOINTS } from "@/lib/api/endpoints";
import { http } from "@/lib/api/http";
import {
  Job,
  JobFilter,
  JobListResponse,
  Category,
  Location,
  Skill,
} from "@/features/jobs/types/job.type";
import { cleanObject } from "@/lib/utils";

class JobService {
  /**
   * Lấy danh sách việc làm với các bộ lọc.
   */
  async getJobs(params?: JobFilter): Promise<JobListResponse> {
    const cleanedParams = cleanObject(params || {});
    return http.getPaginated<Job>(JOB_ENDPOINTS.LIST, {
      params: cleanedParams,
    });
  }

  /**
   * Lấy chi tiết một việc làm.
   */
  async getJobById(id: string): Promise<Job> {
    return http.get<Job>(JOB_ENDPOINTS.DETAIL(id));
  }
}

class MasterDataService {
  /**
   * Lấy danh sách ngành nghề.
   */
  async getCategories(): Promise<Category[]> {
    return http.get<Category[]>(MASTER_ENDPOINTS.CATEGORIES);
  }

  /**
   * Lấy danh sách địa điểm.
   */
  async getLocations(): Promise<Location[]> {
    return http.get<Location[]>(MASTER_ENDPOINTS.LOCATIONS);
  }

  /**
   * Lấy danh sách kỹ năng.
   */
  async getSkills(): Promise<Skill[]> {
    return http.get<Skill[]>(MASTER_ENDPOINTS.SKILLS);
  }
}

export const jobService = new JobService();
export const masterService = new MasterDataService();
