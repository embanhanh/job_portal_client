import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import { LoginInput } from "@/features/auth/schemas/login.schema";
import { RegisterInput } from "@/features/auth/schemas/register.schema";
import { AuthResponse, User } from "@/features/auth/types/auth.type";
import { UpdateUserInput } from "@/features/auth/schemas/update-user.schema";
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

  updateProfile: async (data: UpdateUserInput | FormData): Promise<User> => {
    const isFormData = data instanceof FormData;
    return http.patch<User>(AUTH_ENDPOINTS.PROFILE, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
  },
};
