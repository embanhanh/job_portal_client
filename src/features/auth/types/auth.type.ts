import { Role } from "../enums/auth.enum";

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
