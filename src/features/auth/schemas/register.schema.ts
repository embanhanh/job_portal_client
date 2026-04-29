import { z } from "zod";
import { Role } from "../enums/auth.enum";

export const registerSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "password_too_short" }),
  role: z.nativeEnum(Role, { message: "invalid_role" }).extract([Role.CANDIDATE, Role.EMPLOYER]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
