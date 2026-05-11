export const CANDIDATE_ENDPOINTS = {
  BASE: "/candidates",
  ME: "/candidates/me",
  CV: "/candidates/me/cv",
  EDUCATION: "/candidates/me/education",
  EDUCATION_BY_ID: (id: string) => `/candidates/me/education/${id}`,
  EXPERIENCE: "/candidates/me/experience",
  EXPERIENCE_BY_ID: (id: string) => `/candidates/me/experience/${id}`,
  SKILLS: "/candidates/me/skills",
  SEARCH: "/candidates/search",
  BY_ID: (id: string) => `/candidates/${id}`,
} as const;
