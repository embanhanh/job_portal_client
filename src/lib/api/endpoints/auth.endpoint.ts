export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  LOGOUT: "/auth/logout", // Assuming there is a logout endpoint if needed
} as const;
