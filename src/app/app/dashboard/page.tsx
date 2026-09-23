"use client";

import Link from "next/link";
import { Building2, Users, Briefcase, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/role-access";
import { EMPLOYERS, JOB_SEEKERS, DOCUMENTS } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function topByDate<T extends { updatedAt: string }>(items: T[], count: number) {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, count);
}

export default function DashboardPage() {
  const { user } = useAuth();

  const activeEmployers = EMPLOYERS.filter((e) => e.status === "active").length;
  const activeJobs = EMPLOYERS.reduce((sum, e) => sum + e.activeJobs, 0);
  const activeSeekers = JOB_SEEKERS.filter((j) => j.status === "active").length;

  const recentEmployers = topByDate(EMPLOYERS, 5);
  const recentSeekers = topByDate(JOB_SEEKERS, 5);
  const recentDocs = [...DOCUMENTS].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Översikt över arbetsgivare, jobbsökande och aktivitet.
          </p>
        </div>
        <Badge variant="outline">Inloggad som {user.name} · {ROLE_LABELS[user.role]}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Arbetsgivare" value={EMPLOYERS.length} hint={`${activeEmployers} aktiva`} icon={Building2} />
        <StatCard title="Aktiva jobbannonser" value={activeJobs} hint="Hos alla arbetsgivare" icon={Briefcase} />
        <StatCard title="Jobbsökande" value={JOB_SEEKERS.length} hint={`${activeSeekers} aktiva`} icon={Users} />
        <StatCard title="Dokument i systemet" value={DOCUMENTS.length} hint="CV, avtal med mera" icon={FileText} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Senaste arbetsgivare</CardTitle>
            <Link href="/app/arbetsgivare" className="text-xs font-medium text-primary hover:underline">
              Visa alla
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEmployers.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{e.companyName}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.industry} · {e.city}</div>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Senaste jobbsökande</CardTitle>
            <Link href="/app/jobbsokande" className="text-xs font-medium text-primary hover:underline">
              Visa alla
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSeekers.map((j) => (
              <div key={j.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{j.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{j.title} · {j.city}</div>
                </div>
                <StatusBadge status={j.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Senaste dokument</CardTitle>
          <Link href="/app/dokument" className="text-xs font-medium text-primary hover:underline">
            Visa alla
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentDocs.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{d.name}</span>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{d.uploadedAt}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
