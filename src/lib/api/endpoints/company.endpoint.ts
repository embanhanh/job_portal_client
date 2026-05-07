export const companyEndpoints = {
  BASE: "/companies",
  ME: "/companies/me",
  BY_ID: (id: string) => `/companies/${id}`,
} as const;
