import { cookies } from "next/headers";
import type { UserRole } from "@/lib/models/user";
import { SESSION_COOKIE_NAME, createSessionToken, verifySessionToken } from "@/lib/auth-core";

export { hashPassword, verifyPassword, verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-core";
export type { SessionPayload } from "@/lib/auth-core";

export async function hasValidSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return false;
  return verifySessionToken(token) !== null;
}

export async function setSessionCookie(userId: number, role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(userId, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
