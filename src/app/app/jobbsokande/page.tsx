"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Users } from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { canManage, canDelete } from "@/lib/role-access";
import { JOB_SEEKERS } from "@/lib/mock-data";
import type { JobSeekerStatus } from "@/lib/types";
import { usePagination } from "@/lib/use-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { StatusBadge } from "@/components/StatusBadge";

const TABS: { key: "all" | JobSeekerStatus; label: string }[] = [
  { key: "all", label: "Alla" },
  { key: "active", label: "Aktiva" },
  { key: "hired", label: "Anställda" },
  { key: "inactive", label: "Inaktiva" },
];

export default function JobSeekersPage() {
  const user = useCurrentUser();
  const mayManage = canManage(user);
  const mayDelete = canDelete(user);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | JobSeekerStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOB_SEEKERS.filter((j) => {
      if (tab !== "all" && j.status !== tab) return false;
      if (!q) return true;
      return (
        j.name.toLowerCase().includes(q) ||
        j.title.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, tab]);

  const pager = usePagination(filtered, 10);

  const counts = {
    all: JOB_SEEKERS.length,
    active: JOB_SEEKERS.filter((j) => j.status === "active").length,
    hired: JOB_SEEKERS.filter((j) => j.status === "hired").length,
    inactive: JOB_SEEKERS.filter((j) => j.status === "inactive").length,
  };

  return (
    <div className={`space-y-4 ${filtered.length > 10 ? "pb-20" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Jobbsökande</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hantera kandidater registrerade på portalen, deras kompetenser och status.
          </p>
        </div>
        {mayManage && (
          <Button>
            <Plus className="h-4 w-4" /> Ny jobbsökande
          </Button>
        )}
      </div>

      <div className="relative min-w-[240px] max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök namn, titel, stad, kompetens..."
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-6 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 pb-3 text-sm transition ${
              tab === t.key
                ? "border-primary font-semibold text-foreground"
                : "border-transparent font-medium text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        Visar {pager.firstItem}–{pager.lastItem} av {filtered.length} jobbsökande
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Namn</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Titel</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Kompetenser</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Stad</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Ansökningar</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Uppdaterad</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {pager.pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <span>Inga jobbsökande hittades</span>
                  </div>
                </td>
              </tr>
            ) : (
              pager.pageItems.map((j) => (
                <tr key={j.id} className="border-t border-border transition hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{j.name}</div>
                    <div className="text-xs text-muted-foreground">{j.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{j.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {j.skills.map((s) => (
                        <Badge key={s} variant="muted">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{j.city}</td>
                  <td className="px-4 py-3">{j.applications}</td>
                  <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{j.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Visa" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {mayManage && (
                        <Button variant="ghost" size="icon" title="Redigera" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {mayDelete && (
                        <Button variant="ghost" size="icon" title="Ta bort" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={pager.page}
        totalPages={pager.totalPages}
        onPageChange={pager.setPage}
        itemLabel={`${filtered.length} jobbsökande`}
      />
    </div>
  );
}
