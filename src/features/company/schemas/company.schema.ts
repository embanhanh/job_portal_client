import { z } from "zod";

/**
 * Schema cho việc đăng ký và cập nhật công ty.
 * Sử dụng cho react-hook-form.
 */
export const companySchema = z.object({
  companyName: z.string().min(2, "company_name_too_short"),
  website: z.string().url("invalid_url").or(z.string().length(0)).optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  description: z.object({
    vi: z.string().min(10, "description_too_short"),
    en: z.string().min(10, "description_too_short"),
  }),
  logo: z.instanceof(File).optional(),
  businessLicense: z.instanceof(File, { message: "business_license_required" }),
});

export type CompanyInput = z.infer<typeof companySchema>;

/**
 * Schema cho việc cập nhật (mọi trường đều optional)
 */
export const updateCompanySchema = companySchema.partial();
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
