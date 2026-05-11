import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string().min(2, { message: "validation.full_name_too_short" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10,11}$/.test(val), {
      message: "validation.invalid_phone",
    }),
  avatar: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
