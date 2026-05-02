import { z } from "zod";

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  salary: z.string().optional(),
  type: z.string(), // "FULL_TIME", "PART_TIME", etc.
  description: z.string(),
  requirements: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const jobFilterSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
