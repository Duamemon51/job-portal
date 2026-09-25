"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Download,
  FileText,
  Send,
  Eye,
  CalendarDays,
  Search,
  MapPin,
  ArrowUpDown,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ApplicationStatus = "sent" | "response" | "interview" | "rejected";

interface JobApplication {
  id: string;
  jobId: string;
  title: string;
  company: string;
  city: string | null;
  category: string | null;
  webpageUrl: string | null;
  logoUrl: string | null;
  status: ApplicationStatus;
  appliedAt: string; // ISO
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  sent: "Skickad",
  response: "Svar mottaget",
  interview: "Intervju",
  rejected: "Ej aktuell",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  sent: "bg-blue-100 text-blue-700",
  response: "bg-violet-100 text-violet-700",
  interview: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-600",
};

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

function formatDate(iso: string) {
  return iso.slice(0, 10);
}

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 42%)`;
}

function initialsFor(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function CompanyBadge({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 rounded-lg object-contain" />;
  }
  return (
    <span
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-white"
      style={{ background: hashColor(name) }}
    >
      {initialsFor(name)}
    </span>
  );
}

function isThisWeek(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return date >= start;
}

export default function MinaAnsoktaJobbPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) throw new Error("request-failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setApplications(data.applications ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Kunde inte hämta dina ansökningar just nu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(applications.map((a) => a.category).filter((c): c is string => Boolean(c)))),
    [applications]
  );
  const cities = useMemo(
    () => Array.from(new Set(applications.map((a) => a.city).filter((c): c is string => Boolean(c)))).sort(),
    [applications]
  );

  const stats = useMemo(() => {
    const thisWeek = applications.filter((a) => isThisWeek(a.appliedAt)).length;
    const responses = applications.filter((a) => a.status === "response" || a.status === "interview").length;
    const interviews = applications.filter((a) => a.status === "interview").length;
    return [
      { label: "Totalt ansökta jobb", value: applications.length, hint: "sedan du började använda JobbAuto", icon: FileText },
      { label: "Denna vecka", value: thisWeek, hint: "ansökningar sedan i söndags", icon: Send },
      { label: "Svar mottagna", value: responses, hint: "av alla ansökningar", icon: Eye },
      { label: "Intervjuer", value: interviews, hint: "av alla ansökningar", icon: CalendarDays },
    ];
  }, [applications]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = applications.filter((a) => {
      if (term && !a.title.toLowerCase().includes(term) && !a.company.toLowerCase().includes(term)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (cityFilter !== "all" && a.city !== cityFilter) return false;
      if (dateFilter && formatDate(a.appliedAt) !== dateFilter) return false;
      return true;
    });
    rows.sort((a, b) => (sortDir === "desc" ? b.appliedAt.localeCompare(a.appliedAt) : a.appliedAt.localeCompare(b.appliedAt)));
    return rows;
  }, [applications, search, statusFilter, categoryFilter, cityFilter, dateFilter, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(currentPage * rowsPerPage, filtered.length);

  function resetToFirstPage() {
    setPage(1);
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(pageRows.map((r) => r.id)) : new Set());
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const pageNumbers = useMemo(() => {
    const span = 5;
    let start = Math.max(1, currentPage - Math.floor(span / 2));
    const end = Math.min(totalPages, start + span - 1);
    start = Math.max(1, end - span + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/app/oversikt" className="hover:text-foreground hover:underline">
          Översikt
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Mina ansökta jobb</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Mina ansökta jobb</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Här ser du alla jobb som du har ansökt till via JobbAuto, med status och detaljer.
          </p>
        </div>
        <Link href="/app/lediga-tjanster">
          <Button className="h-10 gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white hover:bg-indigo-600">
            <Search className="h-4 w-4" />
            Sök fler tjänster
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-500">
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{stat.label}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.hint}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            placeholder="Sök bland dina ansökta jobb..."
            className="h-11 rounded-xl pl-9"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof statusFilter);
            resetToFirstPage();
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Alla statusar</option>
          {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((key) => (
            <option key={key} value={key}>
              {STATUS_LABELS[key]}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            resetToFirstPage();
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Alla jobbkategorier</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            resetToFirstPage();
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Alla orter</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              resetToFirstPage();
            }}
            className="h-11 w-[168px] rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-indigo-500"
                    aria-label="Markera alla"
                  />
                </th>
                <th className="px-4 py-3">Tjänst</th>
                <th className="px-4 py-3">Företag</th>
                <th className="px-4 py-3">Ort</th>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                    className="inline-flex items-center gap-1 normal-case text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    Ansökningsdatum
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="w-16 px-4 py-3 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Hämtar dina ansökningar…
                  </td>
                </tr>
              ) : (
                <>
                  {pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="h-4 w-4 rounded border-input accent-indigo-500"
                          aria-label={`Markera ${row.title}`}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-indigo-500">{row.title}</div>
                        <div className="text-xs text-muted-foreground">{row.category ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <CompanyBadge name={row.company} logoUrl={row.logoUrl} />
                          <span className="text-foreground">{row.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {row.city ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">{formatDate(row.appliedAt)}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[row.status])}>
                          {STATUS_LABELS[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <DropdownMenu
                          items={[
                            {
                              label: "Visa annons",
                              icon: Eye,
                              onClick: () => row.webpageUrl && window.open(row.webpageUrl, "_blank", "noopener,noreferrer"),
                            },
                            { label: "Ladda ner ansökan", icon: Download, onClick: () => {} },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}

                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        {applications.length === 0 ? (
                          <>
                            Du har inte ansökt till några jobb än.{" "}
                            <Link href="/app/lediga-tjanster" className="font-medium text-indigo-500 hover:underline">
                              Hitta lediga tjänster
                            </Link>
                            .
                          </>
                        ) : (
                          "Inga ansökningar matchar din sökning."
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                resetToFirstPage();
              }}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>
              visar {rangeStart}–{rangeEnd} av {filtered.length} ansökningar
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Föregående sida"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg text-sm font-semibold transition",
                  n === currentPage ? "bg-indigo-500 text-white" : "text-foreground hover:bg-muted"
                )}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Nästa sida"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Export banner */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-indigo-500 shadow-sm">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-indigo-950">Exportera dina ansökningar</div>
          <p className="text-sm text-indigo-950/70">
            Ladda ner en PDF med alla dina ansökta jobb, inklusive tjänst, företag, datum, status och länk till annonsen.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 shrink-0 gap-1.5 rounded-xl border-indigo-200 bg-white text-indigo-500 hover:bg-indigo-50"
        >
          <Download className="h-3.5 w-3.5" />
          Ladda ner som PDF
        </Button>
      </div>
    </div>
  );
}
