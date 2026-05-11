import { z } from "zod";
import { PaginationMeta, Paginated } from "@/lib/api/types";

// --- Multi-language support ---
export interface LocalizedString {
  vi: string;
  en?: string;
}

// --- Master Data ---
export interface Category {
  id: string;
  name: LocalizedString;
  slug?: string;
  parentId?: string | null;
}

export interface Location {
  id: string;
  name: string;
  type?: "PROVINCE" | "DISTRICT" | "WARD";
  parentId?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

// --- Company & Job ---
export interface JobCompany {
  id: string;
  companyName: string;
  logoUrl?: string | null;
  website?: string | null;
  address?: string | null;
}

export interface Job {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  requirements?: LocalizedString;
  benefits?: LocalizedString;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  type: "full_time" | "part_time" | "contract" | "internship" | "remote";
  status: "pending" | "open" | "closed" | "expired";
  company: JobCompany;
  category?: Category;
  location?: Location;
  jobSkills?: Array<{
    id: string;
    skill: Skill;
  }>;
  expiredAt?: string;
  createdAt?: string;
}

// --- Filter & Pagination ---
export interface JobFilter {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: string;
  locationId?: string;
  type?: string; // string or comma-separated string
  salaryMin?: number;
  salaryMax?: number;
}

export type JobListResponse = Paginated<Job>;
