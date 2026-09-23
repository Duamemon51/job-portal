import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import type { UserRole } from "@/lib/models/user";

/**
 * Proxy-safe half of the auth logic: no `next/headers`, so `src/proxy.ts` can
 * import this directly without pulling in the cookie-store APIs that only work
 * inside a route handler / server component request scope.
 */

export const SESSION_COOKIE_NAME = "hirepath_session";

export interface SessionPayload {
  userId: number;
  role: UserRole;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken(userId: number, role: UserRole) {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === "string" || !payload) return null;
    const { userId, role } = payload as { userId?: number; role?: UserRole };
    if (typeof userId !== "number" || !role) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** The raw token goes in the reset link; only its hash is ever stored. */
export function createResetToken() {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashResetToken(token), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) };
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
