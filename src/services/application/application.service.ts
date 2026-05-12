import { http } from "@/lib/api/http";
import { APPLICATION_ENDPOINTS } from "@/lib/api/endpoints";
import { Application } from "@/features/applications/types/application.type";
import { ApplyJobInput } from "@/features/applications/schemas/application.schema";

export const applicationService = {
  apply: async (data: ApplyJobInput): Promise<Application> => {
    const formData = new FormData();
    formData.append("jobId", data.jobId);
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    if (data.coverLetter) {
      formData.append("coverLetter", data.coverLetter);
    }
    if (data.cv) {
      formData.append("cv", data.cv);
    }

    return http.post<Application>(APPLICATION_ENDPOINTS.APPLY, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getMyApplications: async (page = 1, limit = 10): Promise<{ data: Application[]; total: number }> => {
    return http.get(APPLICATION_ENDPOINTS.MY_APPLICATIONS, {
      params: { page, limit },
    });
  },

  getApplicationDetails: async (id: string): Promise<Application> => {
    return http.get(APPLICATION_ENDPOINTS.BY_ID(id));
  },
};
