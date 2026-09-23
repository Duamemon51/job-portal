"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Building2 } from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { canManage, canDelete } from "@/lib/role-access";
import { EMPLOYERS } from "@/lib/mock-data";
import type { EmployerStatus } from "@/lib/types";
import { usePagination } from "@/lib/use-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { StatusBadge } from "@/components/StatusBadge";

const TABS: { key: "all" | EmployerStatus; label: string }[] = [
  { key: "all", label: "Alla" },
  { key: "active", label: "Aktiva" },
  { key: "pending", label: "Väntande" },
  { key: "inactive", label: "Inaktiva" },
];

export default function EmployersPage() {
  const user = useCurrentUser();
  const mayManage = canManage(user);
  const mayDelete = canDelete(user);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | EmployerStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EMPLOYERS.filter((e) => {
      if (tab !== "all" && e.status !== tab) return false;
      if (!q) return true;
      return (
        e.companyName.toLowerCase().includes(q) ||
        e.industry.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.contactPerson.toLowerCase().includes(q)
      );
    });
  }, [query, tab]);

  const pager = usePagination(filtered, 10);

  const counts = {
    all: EMPLOYERS.length,
    active: EMPLOYERS.filter((e) => e.status === "active").length,
    pending: EMPLOYERS.filter((e) => e.status === "pending").length,
    inactive: EMPLOYERS.filter((e) => e.status === "inactive").length,
  };

  return (
    <div className={`space-y-4 ${filtered.length > 10 ? "pb-20" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Arbetsgivare</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hantera företag som publicerar jobb, deras kontaktpersoner och status.
          </p>
        </div>
        {mayManage && (
          <Button>
            <Plus className="h-4 w-4" /> Ny arbetsgivare
          </Button>
        )}
      </div>

      <div className="relative min-w-[240px] max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök arbetsgivare, bransch, stad, kontaktperson..."
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
        Visar {pager.firstItem}–{pager.lastItem} av {filtered.length} arbetsgivare
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Företag</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Kontakt</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Bransch</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Stad</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Jobb</th>
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
                    <Building2 className="h-8 w-8 text-muted-foreground/40" />
                    <span>Inga arbetsgivare hittades</span>
                  </div>
                </td>
              </tr>
            ) : (
              pager.pageItems.map((e) => (
                <tr key={e.id} className="border-t border-border transition hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.companyName}</div>
                    <div className="text-xs text-muted-foreground">{e.orgNr}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.contactPerson}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.industry}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.city}</td>
                  <td className="px-4 py-3">{e.activeJobs}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{e.updatedAt}</td>
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
        itemLabel={`${filtered.length} arbetsgivare`}
      />
    </div>
  );
}
