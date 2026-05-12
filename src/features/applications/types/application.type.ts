export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  OFFERED = "offered",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  cvUrl?: string;
  cvPublicId?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  score?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
