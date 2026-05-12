import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  coverLetter: z
    .string()
    .min(20, "Cover letter must be at least 20 characters")
    .max(5000, "Cover letter must most 5000 characters")
    .optional()
    .or(z.literal("")),
  cv: z.instanceof(File, { message: "Please upload a CV" }).optional(),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
