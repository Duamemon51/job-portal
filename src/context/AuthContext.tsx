"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_USERS } from "@/lib/mock-data";
import type { AppUser, Role } from "@/lib/types";

interface AuthContextValue {
  user: AppUser;
  /** Demo-only: swaps the signed-in user to preview each role's permissions. */
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("super_admin");

  const value = useMemo<AuthContextValue>(() => {
    const user = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    return { user, setRole };
  }, [role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
