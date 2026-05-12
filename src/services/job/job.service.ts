import { JOB_ENDPOINTS, MASTER_ENDPOINTS } from "@/lib/api/endpoints";
import { http } from "@/lib/api/http";
import {
  Job,
  JobFilter,
  JobListResponse,
  Category,
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

  /**
   * Lưu hoặc hủy lưu việc làm.
   */
  async saveJob(id: string): Promise<{ saved: boolean }> {
    return http.post<{ saved: boolean }>(JOB_ENDPOINTS.SAVE(id), {});
  }

  /**
   * Kiểm tra trạng thái của người dùng đối với việc làm (đã lưu, đã ứng tuyển).
   */
  async getUserJobStatus(
    id: string
  ): Promise<{ isSaved: boolean; isApplied: boolean }> {
    return http.get<{ isSaved: boolean; isApplied: boolean }>(
      JOB_ENDPOINTS.USER_STATUS(id)
    );
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
   * Lấy danh sách kỹ năng.
   */
  async getSkills(): Promise<Skill[]> {
    return http.get<Skill[]>(MASTER_ENDPOINTS.SKILLS);
  }
}

export const jobService = new JobService();
export const masterService = new MasterDataService();
