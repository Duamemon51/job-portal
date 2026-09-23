import type { AppUser, Employer, JobSeeker, PortalDocument } from "./types";

export const DEMO_USERS: AppUser[] = [
  { id: "u1", name: "Elin Karlsson", email: "elin@jobportal.se", role: "super_admin" },
  { id: "u2", name: "Noah Bergström", email: "noah@jobportal.se", role: "admin" },
  { id: "u3", name: "Maja Lindqvist", email: "maja@jobportal.se", role: "user" },
];

export const EMPLOYERS: Employer[] = [
  { id: "e1", companyName: "Nordic Tech AB", orgNr: "556677-8899", industry: "IT & Mjukvara", city: "Stockholm", email: "hr@nordictech.se", phone: "08-123 456", contactPerson: "Anna Svensson", status: "active", activeJobs: 6, updatedAt: "2026-09-18" },
  { id: "e2", companyName: "Byggpartner Sverige", orgNr: "556123-4567", industry: "Bygg", city: "Göteborg", email: "jobb@byggpartner.se", phone: "031-987 654", contactPerson: "Erik Nilsson", status: "active", activeJobs: 3, updatedAt: "2026-09-20" },
  { id: "e3", companyName: "Hälsocentrum Öst", orgNr: "556890-1122", industry: "Vård", city: "Uppsala", email: "rekrytering@halsocentrum.se", phone: "018-222 333", contactPerson: "Sara Johansson", status: "pending", activeJobs: 0, updatedAt: "2026-09-10" },
  { id: "e4", companyName: "Skandia Logistik", orgNr: "556445-9988", industry: "Logistik", city: "Malmö", email: "hr@skandialogistik.se", phone: "040-555 111", contactPerson: "Johan Persson", status: "active", activeJobs: 9, updatedAt: "2026-09-21" },
  { id: "e5", companyName: "Grön Energi AB", orgNr: "556333-2211", industry: "Energi", city: "Linköping", email: "karriar@gronenergi.se", phone: "013-444 222", contactPerson: "Linnea Holm", status: "inactive", activeJobs: 0, updatedAt: "2026-08-30" },
  { id: "e6", companyName: "Retail Group Norden", orgNr: "556778-3344", industry: "Handel", city: "Stockholm", email: "jobb@retailgroup.se", phone: "08-777 888", contactPerson: "Oscar Blom", status: "active", activeJobs: 4, updatedAt: "2026-09-19" },
  { id: "e7", companyName: "Finansia Konsult", orgNr: "556991-4455", industry: "Finans", city: "Stockholm", email: "hr@finansia.se", phone: "08-333 999", contactPerson: "Klara Ek", status: "active", activeJobs: 2, updatedAt: "2026-09-15" },
  { id: "e8", companyName: "EduSmart Sverige", orgNr: "556212-7766", industry: "Utbildning", city: "Örebro", email: "rekrytering@edusmart.se", phone: "019-666 111", contactPerson: "Victor Åberg", status: "inactive", activeJobs: 0, updatedAt: "2026-08-22" },
];

export const JOB_SEEKERS: JobSeeker[] = [
  { id: "j1", name: "Amina Yusuf", email: "amina.yusuf@mail.com", phone: "070-111 2233", city: "Stockholm", title: "Frontend-utvecklare", skills: ["React", "TypeScript", "CSS"], status: "active", applications: 5, updatedAt: "2026-09-21" },
  { id: "j2", name: "Viktor Lindberg", email: "viktor.l@mail.com", phone: "070-222 3344", city: "Göteborg", title: "Elektriker", skills: ["Elinstallation", "Bygg"], status: "hired", applications: 2, updatedAt: "2026-09-12" },
  { id: "j3", name: "Fatima Al-Sayed", email: "fatima.a@mail.com", phone: "070-333 4455", city: "Malmö", title: "Sjuksköterska", skills: ["Vård", "Akutsjukvård"], status: "active", applications: 3, updatedAt: "2026-09-20" },
  { id: "j4", name: "Erik Holm", email: "erik.holm@mail.com", phone: "070-444 5566", city: "Uppsala", title: "Lagerarbetare", skills: ["Truckkort", "Logistik"], status: "active", applications: 7, updatedAt: "2026-09-17" },
  { id: "j5", name: "Sofia Pettersson", email: "sofia.p@mail.com", phone: "070-555 6677", city: "Stockholm", title: "Ekonomiassistent", skills: ["Bokföring", "Excel"], status: "inactive", applications: 1, updatedAt: "2026-08-28" },
  { id: "j6", name: "Daniel Berg", email: "daniel.berg@mail.com", phone: "070-666 7788", city: "Linköping", title: "Backend-utvecklare", skills: ["Node.js", "PostgreSQL"], status: "active", applications: 4, updatedAt: "2026-09-19" },
  { id: "j7", name: "Nour Haddad", email: "nour.h@mail.com", phone: "070-777 8899", city: "Malmö", title: "Butikssäljare", skills: ["Kundservice", "Kassa"], status: "active", applications: 6, updatedAt: "2026-09-16" },
  { id: "j8", name: "Karl Åström", email: "karl.astrom@mail.com", phone: "070-888 9900", city: "Örebro", title: "Projektledare", skills: ["Scrum", "Ledarskap"], status: "hired", applications: 2, updatedAt: "2026-09-05" },
  { id: "j9", name: "Ella Nyström", email: "ella.n@mail.com", phone: "070-999 0011", city: "Stockholm", title: "UX-designer", skills: ["Figma", "UX-research"], status: "active", applications: 8, updatedAt: "2026-09-22" },
  { id: "j10", name: "Adam Karlsson", email: "adam.k@mail.com", phone: "070-000 1122", city: "Göteborg", title: "Lärare", skills: ["Pedagogik", "Matematik"], status: "inactive", applications: 0, updatedAt: "2026-08-15" },
];

export const DOCUMENTS: PortalDocument[] = [
  { id: "d1", name: "Amina Yusuf – CV.pdf", category: "resumes", owner: "Amina Yusuf", fileType: "PDF", size: "412 KB", uploadedAt: "2026-09-21" },
  { id: "d2", name: "Erik Holm – CV.pdf", category: "resumes", owner: "Erik Holm", fileType: "PDF", size: "298 KB", uploadedAt: "2026-09-17" },
  { id: "d3", name: "Ella Nyström – Portfolio & CV.pdf", category: "resumes", owner: "Ella Nyström", fileType: "PDF", size: "1.1 MB", uploadedAt: "2026-09-22" },
  { id: "d4", name: "Nordic Tech AB – Anställningsavtal.docx", category: "contracts", owner: "Nordic Tech AB", fileType: "DOCX", size: "88 KB", uploadedAt: "2026-09-18" },
  { id: "d5", name: "Skandia Logistik – Ramavtal.pdf", category: "contracts", owner: "Skandia Logistik", fileType: "PDF", size: "214 KB", uploadedAt: "2026-09-14" },
  { id: "d6", name: "Viktor Lindberg – Erbjudandebrev.pdf", category: "offer_letters", owner: "Viktor Lindberg", fileType: "PDF", size: "76 KB", uploadedAt: "2026-09-12" },
  { id: "d7", name: "Karl Åström – Erbjudandebrev.pdf", category: "offer_letters", owner: "Karl Åström", fileType: "PDF", size: "81 KB", uploadedAt: "2026-09-05" },
  { id: "d8", name: "Fatima Al-Sayed – Legitimation.jpg", category: "id_verification", owner: "Fatima Al-Sayed", fileType: "JPG", size: "1.4 MB", uploadedAt: "2026-09-20" },
  { id: "d9", name: "Daniel Berg – Legitimation.jpg", category: "id_verification", owner: "Daniel Berg", fileType: "JPG", size: "980 KB", uploadedAt: "2026-09-19" },
  { id: "d10", name: "Standard anställningsavtal – mall.docx", category: "templates", owner: "System", fileType: "DOCX", size: "44 KB", uploadedAt: "2026-08-01" },
  { id: "d11", name: "Erbjudandebrev – mall.docx", category: "templates", owner: "System", fileType: "DOCX", size: "39 KB", uploadedAt: "2026-08-01" },
];

export const DOCUMENT_CATEGORY_LABELS: Record<PortalDocument["category"], string> = {
  resumes: "CV & Ansökningar",
  contracts: "Avtal",
  offer_letters: "Erbjudandebrev",
  id_verification: "Legitimation",
  templates: "Mallar",
};
