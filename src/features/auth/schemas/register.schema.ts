import { z } from "zod";
import { Role } from "../enums/auth.enum";

export const registerSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "password_too_short" }),
  fullName: z.string().min(2, { message: "full_name_too_short" }),
  phone: z.string().regex(/^[0-9]{10,11}$/, { message: "invalid_phone" }),
  role: z.nativeEnum(Role, { message: "invalid_role" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
