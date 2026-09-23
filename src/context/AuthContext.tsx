"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppUser, Role } from "@/lib/types";

// Mirrors lib/models/user.ts's UserRole — kept as a plain literal type (not imported)
// so this client module never pulls in the Sequelize model.
type SessionRole = "user" | "admin" | "superadmin";

const ROLE_FROM_SESSION: Record<SessionRole, Role> = {
  user: "user",
  admin: "admin",
  superadmin: "super_admin",
};

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** Re-reads the session from the server. Call after login/register so the app
   *  picks up the new user without a full page reload. */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser({
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: ROLE_FROM_SESSION[data.user.role as SessionRole] ?? "user",
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setUser({
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          role: ROLE_FROM_SESSION[data.user.role as SessionRole] ?? "user",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * For components that only ever render behind the /app proxy gate (AppShell
 * already blocks rendering until `user` resolves), so they can use a
 * guaranteed non-null user instead of re-checking for null everywhere.
 */
export function useCurrentUser(): AppUser {
  const { user } = useAuth();
  if (!user) {
    throw new Error("useCurrentUser() called outside an authenticated route");
  }
  return user;
}
