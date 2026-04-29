import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "password_too_short" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
