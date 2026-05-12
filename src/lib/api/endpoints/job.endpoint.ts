export const JOB_ENDPOINTS = {
  LIST: "/jobs",
  DETAIL: (id: string) => `/jobs/${id}`,
  SAVE: (id: string) => `/jobs/${id}/save`,
  USER_STATUS: (id: string) => `/jobs/${id}/user-status`,
} as const;
