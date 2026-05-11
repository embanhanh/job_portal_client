import { Company } from "@/features/company";
import { Role } from "../enums/auth.enum";
import type { Candidate } from "@/features/candidate/types/candidate.type";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
  phone?: string;
  status?: string;
  candidate: Candidate;
  company?: Company; // Will update this when company types are ready
}

/**
 * Response từ POST /auth/login và POST /auth/register.
 * BE set token qua HTTP-only cookie — response body chỉ chứa message.
 */
export interface AuthResponse {
  message: string;
}
