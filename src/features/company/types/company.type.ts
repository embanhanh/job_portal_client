import { CompanyStatus } from "../enums/company.enum";

export interface CompanyDescription {
  vi: string;
  en: string;
}

export interface Company {
  id: string;
  companyName: string;
  logo: string | null;
  website: string | null;
  address: string | null;
  industry: string | null;
  description: CompanyDescription;
  status: CompanyStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  companyName: string;
  website?: string;
  address?: string;
  industry?: string;
  description?: CompanyDescription;
  logo?: File;
  businessLicense: File;
}
