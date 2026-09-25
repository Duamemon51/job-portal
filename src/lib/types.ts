export type Role = "super_admin" | "admin" | "user";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title?: string | null;
  phone?: string | null;
  city?: string | null;
  jobTypes?: string[] | null;
  jobAreas?: string[] | null;
  preferredLocations?: string[] | null;
  emailProvider?: string | null;
  autoApply?: boolean;
  notifyNewJobs?: boolean;
  weeklyReport?: boolean;
}

export type EmployerStatus = "active" | "inactive" | "pending";

export interface Employer {
  id: string;
  companyName: string;
  orgNr: string;
  industry: string;
  city: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: EmployerStatus;
  activeJobs: number;
  updatedAt: string;
}

export type JobSeekerStatus = "active" | "inactive" | "hired";

export interface JobSeeker {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  title: string;
  skills: string[];
  status: JobSeekerStatus;
  applications: number;
  updatedAt: string;
}

export type DocumentCategory =
  | "resumes"
  | "contracts"
  | "offer_letters"
  | "id_verification"
  | "templates";

export interface PortalDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  owner: string;
  fileType: string;
  size: string;
  uploadedAt: string;
}
