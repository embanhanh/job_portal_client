export const JOB_ENDPOINTS = {
  LIST: "/jobs",
  DETAIL: (id: string) => `/jobs/${id}`,
} as const;
