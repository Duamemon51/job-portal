import type { AppUser, Role } from "./types";

/**
 * Every role sees the same dashboard and the same four tabs (Dashboard, Brukare,
 * Medarbetare, Dokument) — the client asked for one shared layout, not separate
 * portals per role. What changes per role is which *actions* are offered on top
 * of that shared view, mirroring the ISAH reference's roleAccess.js split between
 * "what the menu offers" and "what the API permits".
 */

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "Användare",
};

const FULL_ACCESS_ROLES: Role[] = ["super_admin", "admin"];

export function hasFullAccess(user: AppUser | null | undefined): boolean {
  if (!user) return false;
  return FULL_ACCESS_ROLES.includes(user.role);
}

/** Create / edit records (employers, job seekers, documents). */
export function canManage(user: AppUser | null | undefined): boolean {
  return hasFullAccess(user);
}

/** Delete is the one action held back from Admin — only Super Admin can remove a record. */
export function canDelete(user: AppUser | null | undefined): boolean {
  if (!user) return false;
  return user.role === "super_admin";
}

export function canUploadDocuments(user: AppUser | null | undefined): boolean {
  return hasFullAccess(user);
}
