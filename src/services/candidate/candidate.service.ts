import { http } from "@/lib/api/http";
import { CANDIDATE_ENDPOINTS } from "@/lib/api/endpoints";
import { 
  Candidate, 
  Education, 
  Experience 
} from "@/features/candidate/types/candidate.type";
import { 
  EducationInput, 
  ExperienceInput, 
  UpdateCandidateInput 
} from "@/features/candidate/schemas/candidate.schema";

export const candidateService = {
  getMe: async (): Promise<Candidate> => {
    return http.get<Candidate>(CANDIDATE_ENDPOINTS.ME);
  },

  updateProfile: async (data: UpdateCandidateInput): Promise<Candidate> => {
    return http.patch<Candidate>(CANDIDATE_ENDPOINTS.ME, data);
  },

  uploadCv: async (file: File): Promise<Candidate> => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<Candidate>(CANDIDATE_ENDPOINTS.CV, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  addEducation: async (data: EducationInput): Promise<Education> => {
    return http.post<Education>(CANDIDATE_ENDPOINTS.EDUCATION, data);
  },

  updateEducation: async (id: string, data: EducationInput): Promise<Education> => {
    return http.patch<Education>(CANDIDATE_ENDPOINTS.EDUCATION_BY_ID(id), data);
  },

  deleteEducation: async (id: string): Promise<void> => {
    return http.delete(CANDIDATE_ENDPOINTS.EDUCATION_BY_ID(id));
  },

  addExperience: async (data: ExperienceInput): Promise<Experience> => {
    return http.post<Experience>(CANDIDATE_ENDPOINTS.EXPERIENCE, data);
  },

  updateExperience: async (id: string, data: ExperienceInput): Promise<Experience> => {
    return http.patch<Experience>(CANDIDATE_ENDPOINTS.EXPERIENCE_BY_ID(id), data);
  },

  deleteExperience: async (id: string): Promise<void> => {
    return http.delete(CANDIDATE_ENDPOINTS.EXPERIENCE_BY_ID(id));
  },

  syncSkills: async (skillIds: string[]): Promise<Candidate> => {
    return http.patch<Candidate>(CANDIDATE_ENDPOINTS.SKILLS, { skillIds });
  },
};
