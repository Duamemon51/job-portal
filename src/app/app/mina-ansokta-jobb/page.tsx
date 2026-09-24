"use client";

import { useMemo, useState } from "react";
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
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ApplicationStatus = "sent" | "response" | "interview" | "rejected";

interface CompanyBadge {
  name: string;
  short: string;
  className: string;
}

interface JobApplication {
  id: string;
  title: string;
  category: string;
  company: CompanyBadge;
  city: string;
  appliedAt: string;
  status: ApplicationStatus;
}

const COMPANIES: CompanyBadge[] = [
  { name: "Spotify", short: "S", className: "bg-emerald-500 text-white" },
  { name: "Klarna", short: "K", className: "bg-pink-200 text-pink-700" },
  { name: "Northvolt", short: "N", className: "bg-neutral-900 text-white" },
  { name: "Tele2", short: "T2", className: "bg-red-600 text-white" },
  { name: "ICA", short: "ICA", className: "bg-red-600 text-white" },
  { name: "SEB", short: "SEB", className: "bg-emerald-600 text-white" },
  { name: "Scania", short: "SC", className: "bg-blue-700 text-white" },
  { name: "Ericsson", short: "E", className: "bg-blue-900 text-white" },
  { name: "H&M", short: "H&M", className: "bg-red-600 text-white" },
];

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

const EXTRA_TITLES = [
  "Data Scientist",
  "QA Engineer",
  "Produktägare",
  "UX Designer",
  "Cloud Engineer",
  "Mobile Developer",
  "Säkerhetsanalytiker",
  "Nätverkstekniker",
  "Testautomatiserare",
  "IT-projektledare",
];

const CITIES = ["Stockholm", "Västerås", "Solna", "Södertälje", "Göteborg", "Malmö", "Uppsala", "Linköping"];

function buildApplications(): JobApplication[] {
  const seedRows: Array<[string, number, string, string, ApplicationStatus]> = [
    ["Systemutvecklare", 0, "Stockholm", "2025-09-21", "sent"],
    ["Frontend-utvecklare", 1, "Stockholm", "2025-09-20", "response"],
    ["Fullstack Developer", 2, "Västerås", "2025-09-20", "sent"],
    ["React-utvecklare", 3, "Stockholm", "2025-09-19", "interview"],
    ["Backend-utvecklare", 4, "Solna", "2025-09-19", "sent"],
    ["IT-supporttekniker", 5, "Stockholm", "2025-09-18", "rejected"],
    ["Systemadministratör", 6, "Södertälje", "2025-09-18", "sent"],
    ["DevOps Engineer", 7, "Stockholm", "2025-09-17", "sent"],
    ["Frontend Developer", 8, "Stockholm", "2025-09-17", "response"],
    ["Dataingenjör", 0, "Stockholm", "2025-09-16", "sent"],
  ];

  const rows: JobApplication[] = seedRows.map(([title, companyIdx, city, date, status], i) => ({
    id: `app-${i + 1}`,
    title,
    category: "IT & Tech",
    company: COMPANIES[companyIdx],
    city,
    appliedAt: date,
    status,
  }));

  const statusCycle: ApplicationStatus[] = ["sent", "sent", "sent", "response", "sent", "interview", "sent", "rejected", "sent", "response"];
  const seededCount = rows.length;

  for (let i = seededCount; i < 48; i++) {
    const title = EXTRA_TITLES[i % EXTRA_TITLES.length];
    const company = COMPANIES[i % COMPANIES.length];
    const city = CITIES[i % CITIES.length];
    const status = statusCycle[i % statusCycle.length];
    const dayOffset = i - seededCount;
    const date = new Date(2025, 8, 15);
    date.setDate(date.getDate() - dayOffset);
    rows.push({
      id: `app-${i + 1}`,
      title,
      category: "IT & Tech",
      company,
      city,
      appliedAt: date.toISOString().slice(0, 10),
      status,
    });
  }

  return rows;
}

const APPLICATIONS = buildApplications();

const STATS = [
  { label: "Totalt ansökta jobb", value: APPLICATIONS.length, trend: "+12%", hint: "senaste 30 dagarna", icon: FileText },
  { label: "Denna vecka", value: 12, trend: "+33%", hint: "jämfört med förra veckan", icon: Send },
  { label: "Svar mottagna", value: 8, trend: "17%", hint: "av alla ansökningar", icon: Eye },
  { label: "Intervjuer", value: 3, trend: "+6%", hint: "av alla ansökningar", icon: CalendarDays },
];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}-${m}-${d}`;
}

export default function MinaAnsoktaJobbPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories = useMemo(() => Array.from(new Set(APPLICATIONS.map((a) => a.category))), []);
  const cities = useMemo(() => Array.from(new Set(APPLICATIONS.map((a) => a.city))).sort(), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = APPLICATIONS.filter((a) => {
      if (term && !a.title.toLowerCase().includes(term) && !a.company.name.toLowerCase().includes(term)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (cityFilter !== "all" && a.city !== cityFilter) return false;
      if (dateFilter && a.appliedAt !== dateFilter) return false;
      return true;
    });
    rows.sort((a, b) => (sortDir === "desc" ? b.appliedAt.localeCompare(a.appliedAt) : a.appliedAt.localeCompare(b.appliedAt)));
    return rows;
  }, [search, statusFilter, categoryFilter, cityFilter, dateFilter, sortDir]);

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
    <div className="max-w-6xl space-y-6">
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
        <Button className="h-10 gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white hover:bg-indigo-600">
          <Download className="h-4 w-4" />
          Ladda ner som PDF
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-500">
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{stat.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.hint}</div>
          </div>
        ))}
      </div>

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
                    <div className="text-xs text-muted-foreground">{row.category}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold",
                          row.company.className
                        )}
                      >
                        {row.company.short}
                      </span>
                      <span className="text-foreground">{row.company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {row.city}
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
                        { label: "Visa annons", icon: Eye, onClick: () => {} },
                        { label: "Ladda ner ansökan", icon: Download, onClick: () => {} },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Inga ansökningar matchar din sökning.
                  </td>
                </tr>
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
