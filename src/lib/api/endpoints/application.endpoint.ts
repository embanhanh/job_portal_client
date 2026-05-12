export const APPLICATION_ENDPOINTS = {
  APPLY: "/applications",
  MY_APPLICATIONS: "/applications/my",
  BY_JOB: (jobId: string) => `/applications/job/${jobId}`,
  BY_ID: (id: string) => `/applications/${id}`,
  UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
};
