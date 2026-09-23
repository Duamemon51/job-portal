import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { hasValidSession } from "@/lib/auth";

export default async function DashboardGroupLayout({ children }: { children: ReactNode }) {
  if (!(await hasValidSession())) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
