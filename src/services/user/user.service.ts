import { USER_ENDPOINTS } from "@/lib/api/endpoints";
import { http } from "@/lib/api/http";
import { User } from "@/features/auth/types/auth.type";

export const userService = {
  getProfile: async () => {
    return http.get<User>(USER_ENDPOINTS.PROFILE);
  },
};
