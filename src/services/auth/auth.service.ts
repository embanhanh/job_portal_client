import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/types";
import { LoginInput } from "@/features/auth/schemas/login.schema";
import { RegisterInput } from "@/features/auth/schemas/register.schema";
import { AuthResponse, User } from "@/features/auth/types/auth.type";
import { http } from "@/lib/api/http";
import { unwrapData } from "@/lib/api/unwrap";

export const authService = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    const res = await http.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.LOGIN, credentials);
    return unwrapData(res);
  },
  register: async (data: RegisterInput) => {
    const res = await http.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.REGISTER, data);
    return unwrapData(res);
  },
  me: async () => {
    const res = await http.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME);
    return unwrapData(res);
  },
  logout: async () => {
    const res = await http.post<ApiResponse<null>>(AUTH_ENDPOINTS.LOGOUT);
    return unwrapData(res);
  },
};
