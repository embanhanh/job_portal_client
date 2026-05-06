import { Role } from "../enums/auth.enum";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
  phone?: string;
  status?: string;
}

/**
 * Response từ POST /auth/login và POST /auth/register.
 * BE set token qua HTTP-only cookie — response body chỉ chứa message.
 */
export interface AuthResponse {
  message: string;
}
