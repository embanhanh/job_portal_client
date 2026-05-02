import { z } from "zod";
import { jobSchema, jobFilterSchema } from "../schemas/job.schema";

export type Job = z.infer<typeof jobSchema>;
export type JobFilter = z.infer<typeof jobFilterSchema>;
