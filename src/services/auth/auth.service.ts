import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import { LoginInput } from "@/features/auth/schemas/login.schema";
import { RegisterInput } from "@/features/auth/schemas/register.schema";
import { AuthResponse, User } from "@/features/auth/types/auth.type";
import { http } from "@/lib/api/http";

export const authService = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    return http.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return http.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);
  },

  me: async (): Promise<User> => {
    return http.get<User>(AUTH_ENDPOINTS.ME);
  },

  logout: async (): Promise<AuthResponse> => {
    return http.post<AuthResponse>(AUTH_ENDPOINTS.LOGOUT, {});
  },
};
