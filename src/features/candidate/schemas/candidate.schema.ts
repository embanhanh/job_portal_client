import { z } from "zod";

export const educationSchema = z.object({
  schoolName: z.string().min(1, { message: "profile.validation.school_required" }),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, { message: "profile.validation.date_required" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  companyName: z.string().min(1, { message: "profile.validation.company_required" }),
  position: z.string().min(1, { message: "profile.validation.position_required" }),
  startDate: z.string().min(1, { message: "profile.validation.date_required" }),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

export const updateCandidateSchema = z.object({
  bio: z.record(z.string(), z.string()).optional(),
  isSearching: z.boolean().optional(),
  skillIds: z.array(z.string()).optional(),
});

export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
