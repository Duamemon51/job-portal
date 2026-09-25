"use client";

/**
 * Lediga tjänster page
 * Place at: app/app/lediga-tjanster/page.tsx  (route: /app/lediga-tjanster)
 * JobsMap.tsx lives in src/components and renders the job locations in an iframe.
 * Stack: Next.js (app router) + Tailwind + lucide-react
 *
 * Data comes from JobTech Dev's public Jobsearch API (jobsearch.api.jobtechdev.se),
 * proxied through /api/jobs/search. That API has no seniority or salary fields, so
 * the "Erfarenhetsnivå" and "Lön" controls stay in the UI but don't filter results.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bookmark,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Info,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MappedJob } from "@/lib/jobtech";

const JobsMap = dynamic(() => import("@/components/JobsMap"), {
  ssr: false,
  loading: () => <div className="h-[640px] animate-pulse rounded-xl border border-slate-200 bg-slate-100" />,
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Setup = "plats" | "hybrid" | "remote";
type Job = MappedJob;

const PAGE_SIZE = 8;

/* Counts for these come from live API facet requests (see /api/jobs/search) — no
 * static numbers here, so a category/city never shows a count before it's real. */
const CATEGORY_OPTIONS = [
  { id: "it", label: "IT & Tech" },
  { id: "marknad", label: "Marknad & Kommunikation" },
  { id: "design", label: "Design & UX" },
  { id: "admin", label: "Administration" },
  { id: "kundservice", label: "Kundservice" },
  { id: "forsaljning", label: "Försäljning" },
  { id: "ekonomi", label: "Ekonomi & Finans" },
  { id: "hr", label: "HR & Personal" },
  { id: "vard", label: "Vård & Omsorg" },
  { id: "utbildning", label: "Utbildning & Pedagogik" },
  { id: "ingenjor", label: "Ingenjör & Teknik" },
  { id: "ovrigt", label: "Övrigt" },
];
const COLLAPSED_CATEGORY_COUNT = 5;

const CITY_OPTIONS = [
  { id: "stockholm", label: "Stockholm" },
  { id: "goteborg", label: "Göteborg" },
  { id: "malmo", label: "Malmö" },
  { id: "remote", label: "Distans / Remote" },
  { id: "hela", label: "Hela Sverige" },
];

const EMPLOYMENT_OPTIONS = [
  { id: "heltid", label: "Heltid" },
  { id: "deltid", label: "Deltid" },
  { id: "projekt", label: "Projekt" },
  { id: "visstid", label: "Visstid" },
  { id: "timanstallning", label: "Timanställning" },
  { id: "praktik", label: "Praktik / LIA" },
];

const LEVEL_OPTIONS = [
  { id: "junior", label: "Junior (0–2 år)" },
  { id: "medior", label: "Medior (3–5 år)" },
  { id: "senior", label: "Senior (5+ år)" },
  { id: "alla", label: "Alla nivåer" },
];

const SETUP_OPTIONS: { id: Setup; label: string }[] = [
  { id: "plats", label: "På plats" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Remote" },
];

const PUBLISHED_OPTIONS = [
  { value: "any", label: "När som helst" },
  { value: "1", label: "Senaste 24 timmarna" },
  { value: "3", label: "Senaste 3 dagarna" },
  { value: "7", label: "Senaste veckan" },
  { value: "30", label: "Senaste månaden" },
];

const SORT_OPTIONS = [
  { value: "senaste", label: "Senast publicerade" },
  { value: "aldst", label: "Äldst först" },
  { value: "foretag", label: "Företag A–Ö" },
];

const QUICK_TAGS = ["Systemutvecklare", "Frontend", "React", "Stockholm", "Senior", "Remote", "Backend", "JavaScript"];

const SALARY_MAX = 100000;
const SALARY_TICKS = ["0k", "20k", "40k", "60k", "80k", "100k+"];

const SETUP_LABEL: Record<Setup, string> = { plats: "På plats", hybrid: "Hybrid", remote: "Remote" };

const nf = new Intl.NumberFormat("sv-SE");

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

type Filters = {
  keyword: string;
  categories: string[];
  cities: string[];
  employment: string[];
  levels: string[];
  setups: Setup[];
  salary: [number, number];
  published: string;
};

const DEFAULT_FILTERS: Filters = {
  keyword: "",
  categories: ["it"],
  cities: ["stockholm", "remote"],
  employment: ["heltid"],
  levels: [],
  setups: ["remote"],
  salary: [0, SALARY_MAX],
  published: "any",
};

const EMPTY_FILTERS: Filters = {
  keyword: "",
  categories: [],
  cities: [],
  employment: [],
  levels: [],
  setups: [],
  salary: [0, SALARY_MAX],
  published: "any",
};

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function publishedLabel(days: number) {
  if (days === 0) return "Publicerad idag";
  if (days === 1) return "Publicerad igår";
  return `Publicerad ${days} dagar sedan`;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

const inputCls =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20";

function Box({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border transition-colors",
        checked ? "border-[#6366f1] bg-[#6366f1] text-white" : "border-slate-300 bg-white"
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </span>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 rounded-md py-1 text-left text-[13px] text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/40"
    >
      <Box checked={checked} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-slate-400">{nf.format(count)}</span>}
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-4">
      <h3 className="mb-2.5 text-[13px] font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
        checked ? "bg-[#6366f1]" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

const thumb =
  "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 " +
  "[&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#6366f1] [&::-webkit-slider-thumb]:shadow " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white " +
  "[&::-moz-range-thumb]:bg-[#6366f1]";

function RangeSlider({
  value,
  onChange,
  max,
  step,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  max: number;
  step: number;
}) {
  const [lo, hi] = value;
  const pct = (v: number) => (v / max) * 100;
  return (
    <div className="relative h-5">
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#6366f1]"
        style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={lo}
        aria-label="Lägsta lön"
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        className={thumb}
      />
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={hi}
        aria-label="Högsta lön"
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        className={thumb}
      />
    </div>
  );
}

function Meta({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
      <Icon className="h-3 w-3 text-slate-400" />
      {children}
    </span>
  );
}

function Logo({ job }: { job: Job }) {
  if (job.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={job.logoUrl}
        alt=""
        aria-hidden="true"
        className={cn("h-12 w-12 shrink-0 object-contain", job.brand.round ? "rounded-full" : "rounded-xl")}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center text-sm font-bold",
        job.brand.round ? "rounded-full" : "rounded-xl"
      )}
      style={{ background: job.brand.bg, color: job.brand.fg }}
    >
      {job.initials}
    </div>
  );
}

function JobCard({
  job,
  applied,
  saved,
  onApply,
  onSave,
}: {
  job: Job;
  applied: boolean;
  saved: boolean;
  onApply: () => void;
  onSave: () => void;
}) {
  const mainSetup = job.setups.includes("hybrid") ? "hybrid" : (job.setups[0] as Setup) ?? "plats";
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start">
      <Logo job={job} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
          {job.isNew && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Ny</span>
          )}
        </div>
        <p className="text-sm text-slate-500">{job.company}</p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <Meta icon={MapPin}>
            {job.location} / {SETUP_LABEL[mainSetup]}
          </Meta>
          <Meta icon={Briefcase}>{job.employmentLabel}</Meta>
          <Meta icon={Clock}>{publishedLabel(job.publishedDays)}</Meta>
        </div>

        {job.description && (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{job.description}</p>
        )}

        {job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:self-start">
        <button
          type="button"
          onClick={onApply}
          disabled={applied || !job.applyUrl}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
            applied
              ? "cursor-default bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-[#6366f1] text-white hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {applied && <Check className="h-4 w-4" />}
          {applied ? "Ansökt" : "Ansök nu"}
        </button>
        <button
          type="button"
          onClick={onSave}
          aria-pressed={saved}
          aria-label={saved ? "Ta bort sparad tjänst" : "Spara tjänst"}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
            saved
              ? "border-[#6366f1]/40 bg-indigo-50 text-[#6366f1]"
              : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          )}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Data fetching                                                       */
/* ------------------------------------------------------------------ */

type Facets = { categories: Record<string, number>; cities: Record<string, number> };

function buildSearchQS(opts: {
  q: string;
  filters: Filters;
  sort: string;
  offset: number;
  limit: number;
}) {
  const qs = new URLSearchParams();
  if (opts.q) qs.set("q", opts.q);
  if (opts.filters.categories.length) qs.set("categories", opts.filters.categories.join(","));
  if (opts.filters.cities.length) qs.set("cities", opts.filters.cities.join(","));
  if (opts.filters.employment.length) qs.set("employment", opts.filters.employment.join(","));
  if (opts.filters.setups.length) qs.set("setups", opts.filters.setups.join(","));
  qs.set("published", opts.filters.published);
  qs.set("sort", opts.sort);
  qs.set("offset", String(opts.offset));
  qs.set("limit", String(opts.limit));
  return qs.toString();
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LedigaTjansterPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [showAllCats, setShowAllCats] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  const [sort, setSort] = useState("senaste");
  const [view, setView] = useState<"lista" | "karta">("lista");
  const [applied, setApplied] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const keywordRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<Facets>({ categories: {}, cities: {} });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Default the search to the user's saved Jobbpreferenser (categories, cities,
  // employment types, remote/nationwide) instead of the generic DEFAULT_FILTERS,
  // so this page opens already narrowed to what they said they're looking for.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/preferences")
      .then((res) => (res.ok ? res.json() : null))
      .then((prefs) => {
        if (cancelled || !prefs) return;
        const hasPrefs = prefs.categories?.length || prefs.cities?.length || prefs.employment?.length || prefs.nationwide;
        if (!hasPrefs) return;

        const cities: string[] = [...(prefs.cities ?? [])];
        if (prefs.mode === "distans") cities.push("remote");
        if (prefs.nationwide) cities.push("hela");

        setFilters({
          keyword: "",
          categories: prefs.categories?.length ? prefs.categories : DEFAULT_FILTERS.categories,
          cities: cities.length ? cities : DEFAULT_FILTERS.cities,
          employment: prefs.employment?.length ? prefs.employment : DEFAULT_FILTERS.employment,
          levels: prefs.experience ?? [],
          setups: prefs.mode === "distans" ? ["remote"] : [],
          salary: [0, SALARY_MAX],
          published: "any",
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPrefsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Seed "Ansökt" state from previously saved applications so it survives reloads.
  useEffect(() => {
    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.applications) setApplied(data.applications.map((a: { jobId: string }) => a.jobId));
      })
      .catch(() => {});
  }, []);

  const setF = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const submitSearch = () => setQuery(queryInput.trim());

  const pickQuickTag = (tag: string) => {
    const next = query.toLowerCase() === tag.toLowerCase() ? "" : tag;
    setQueryInput(next);
    setQuery(next);
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQueryInput("");
    setQuery("");
    setCityQuery("");
  };

  const openMoreFilters = () => {
    setFiltersOpen(true);
    setTimeout(() => keywordRef.current?.focus(), 0);
  };

  const combinedQuery = [query, filters.keyword].filter(Boolean).join(" ").trim();

  // Refetch page 1 whenever the search intent changes (debounced so typing/toggling
  // filters quickly doesn't fire a request per keystroke/click).
  useEffect(() => {
    if (!prefsLoaded) return;
    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      try {
        const qs = buildSearchQS({ q: combinedQuery, filters, sort, offset: 0, limit: PAGE_SIZE });
        const res = await fetch(`/api/jobs/search?${qs}`, { signal: controller.signal });
        if (!res.ok) throw new Error("request-failed");
        const data = await res.json();
        if (cancelled) return;
        setJobs(data.jobs ?? []);
        setTotal(data.total ?? 0);
        setFacets(data.facets ?? { categories: {}, cities: {} });
      } catch (err) {
        if (cancelled || (err as Error)?.name === "AbortError") return;
        setError("Kunde inte hämta lediga tjänster just nu. Försök igen om en stund.");
        setJobs([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    combinedQuery,
    filters.categories,
    filters.cities,
    filters.employment,
    filters.setups,
    filters.published,
    sort,
    prefsLoaded,
  ]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const qs = buildSearchQS({ q: combinedQuery, filters, sort, offset: jobs.length, limit: PAGE_SIZE });
      const res = await fetch(`/api/jobs/search?${qs}`);
      if (!res.ok) throw new Error("request-failed");
      const data = await res.json();
      setJobs((prev) => [...prev, ...(data.jobs ?? [])]);
      setTotal(data.total ?? 0);
    } catch {
      setError("Kunde inte hämta fler tjänster just nu.");
    } finally {
      setLoadingMore(false);
    }
  };

  const displayedJobs = useMemo(() => {
    if (sort !== "foretag") return jobs;
    return [...jobs].sort((a, b) => a.company.localeCompare(b.company, "sv"));
  }, [jobs, sort]);

  const pins = useMemo(
    () =>
      displayedJobs
        .filter((j): j is Job & { pos: [number, number] } => j.pos !== null)
        .map((j) => ({ id: j.id, title: j.title, company: j.company, location: j.location, pos: j.pos })),
    [displayedJobs]
  );

  const categoryRows = showAllCats
    ? CATEGORY_OPTIONS
    : CATEGORY_OPTIONS.filter((c, i) => i < COLLAPSED_CATEGORY_COUNT || filters.categories.includes(c.id));

  const cityRows = CITY_OPTIONS.filter((c) => c.label.toLowerCase().includes(cityQuery.trim().toLowerCase()));

  const handleApply = (job: Job) => {
    if (job.applyUrl) window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    setApplied((p) => (p.includes(job.id) ? p : [...p, job.id]));

    fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        title: job.title,
        company: job.company,
        city: job.location,
        category: job.categoryLabel,
        webpageUrl: job.webpageUrl,
        logoUrl: job.logoUrl,
      }),
    }).catch((err) => console.error("Kunde inte spara ansökan:", err));
  };

  return (
    <div className="space-y-6">
      {/* Heading + auto apply */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <nav aria-label="Brödsmula" className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/app/oversikt" className="transition-colors hover:text-slate-800">
              Hem
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-800">Lediga tjänster</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Lediga tjänster</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Här kan du se relevanta lediga tjänster som matchar dina preferenser. Du kan välja att ansöka manuellt eller
            låta JobbAuto göra det automatiskt.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[#6366f1]">
            <Zap className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              Automatisk ansökan
              <span title="När den är på ansöker JobbAuto åt dig till jobb som matchar dina preferenser." className="text-slate-400">
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="text-xs text-slate-500">{autoApply ? "På – vi ansöker åt dig" : "Av – du ansöker själv"}</p>
          </div>
          <Toggle checked={autoApply} onChange={setAutoApply} label="Automatisk ansökan" />
        </div>
      </header>

      {/* Search */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
          className="flex gap-2"
        >
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Sök efter jobb, företag, nyckelord…"
              className={cn(inputCls, "h-10 pl-9")}
            />
          </label>
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#6366f1] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5558e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50 focus-visible:ring-offset-2"
          >
            Sök
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {QUICK_TAGS.map((tag) => {
            const active = query.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => pickQuickTag(tag)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-[#6366f1] bg-indigo-50 text-[#6366f1]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {tag}
              </button>
            );
          })}
          <button
            type="button"
            onClick={openMoreFilters}
            className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-[#6366f1] hover:underline"
          >
            Mer filtrering <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filter sidebar */}
        <aside>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? "Dölj filter" : "Visa filter"}
          </button>

          <div
            className={cn(
              "rounded-xl border border-slate-200 bg-white px-4 shadow-sm lg:sticky lg:top-4 lg:block",
              filtersOpen ? "block" : "hidden"
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-100 py-4">
              <h2 className="text-base font-bold text-slate-900">Filter</h2>
              <button type="button" onClick={clearAll} className="text-xs font-medium text-[#6366f1] hover:underline">
                Rensa alla
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              <FilterGroup title="Nyckelord">
                <input
                  ref={keywordRef}
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setF("keyword", e.target.value)}
                  placeholder="Ex. systemutvecklare, React, AWS…"
                  className={inputCls}
                />
              </FilterGroup>

              <FilterGroup title="Jobbkategorier">
                <Select
                  value=""
                  ariaLabel="Välj kategori"
                  onChange={(v) => v && !filters.categories.includes(v) && setF("categories", [...filters.categories, v])}
                  options={[
                    { value: "", label: "Välj kategorier" },
                    ...CATEGORY_OPTIONS.map((c) => ({ value: c.id, label: c.label })),
                  ]}
                />
                <div className="mt-2.5 space-y-0.5">
                  {categoryRows.map((c) => (
                    <CheckRow
                      key={c.id}
                      label={c.label}
                      count={facets.categories[c.id]}
                      checked={filters.categories.includes(c.id)}
                      onToggle={() => setF("categories", toggleIn(filters.categories, c.id))}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllCats((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#6366f1] hover:underline"
                >
                  {showAllCats ? "Visa färre" : "Visa fler"}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", showAllCats && "rotate-180")} />
                </button>
              </FilterGroup>

              <FilterGroup title="Ort">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="Sök ort…"
                    className={cn(inputCls, "pl-8")}
                  />
                </label>
                <div className="mt-2.5 space-y-0.5">
                  {cityRows.length === 0 ? (
                    <p className="py-1 text-xs text-slate-500">Inga orter matchar.</p>
                  ) : (
                    cityRows.map((c) => (
                      <CheckRow
                        key={c.id}
                        label={c.label}
                        count={facets.cities[c.id]}
                        checked={filters.cities.includes(c.id)}
                        onToggle={() => setF("cities", toggleIn(filters.cities, c.id))}
                      />
                    ))
                  )}
                </div>
              </FilterGroup>

              <FilterGroup title="Anställningsform">
                <div className="space-y-0.5">
                  {EMPLOYMENT_OPTIONS.map((o) => (
                    <CheckRow
                      key={o.id}
                      label={o.label}
                      checked={filters.employment.includes(o.id)}
                      onToggle={() => setF("employment", toggleIn(filters.employment, o.id))}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Erfarenhetsnivå">
                <p className="mb-2 text-xs text-slate-400">Ingår inte i Arbetsförmedlingens öppna data – filtrerar inte listan.</p>
                <div className="space-y-0.5">
                  {LEVEL_OPTIONS.map((o) => (
                    <CheckRow
                      key={o.id}
                      label={o.label}
                      checked={filters.levels.includes(o.id)}
                      onToggle={() => setF("levels", toggleIn(filters.levels, o.id))}
                    />
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Lön (SEK/mån)">
                <p className="mb-2 text-xs text-slate-400">Ingår inte i Arbetsförmedlingens öppna data – filtrerar inte listan.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm tabular-nums text-slate-700">
                    {nf.format(filters.salary[0])}
                  </div>
                  <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-right text-sm tabular-nums text-slate-700">
                    {nf.format(filters.salary[1])}
                    {filters.salary[1] === SALARY_MAX && "+"}
                  </div>
                </div>
                <div className="mt-4">
                  <RangeSlider value={filters.salary} onChange={(v) => setF("salary", v)} max={SALARY_MAX} step={5000} />
                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                    {SALARY_TICKS.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </FilterGroup>

              <FilterGroup title="Publiceringsdatum">
                <Select value={filters.published} onChange={(v) => setF("published", v)} options={PUBLISHED_OPTIONS} ariaLabel="Publiceringsdatum" />
              </FilterGroup>

              <FilterGroup title="Work setup">
                <div className="space-y-0.5">
                  {SETUP_OPTIONS.map((o) => (
                    <CheckRow
                      key={o.id}
                      label={o.label}
                      checked={filters.setups.includes(o.id)}
                      onToggle={() => setF("setups", toggleIn(filters.setups, o.id))}
                    />
                  ))}
                </div>
              </FilterGroup>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              {loading ? "Söker…" : `${nf.format(total)} lediga tjänster`}
            </h2>

            <div className="flex items-center gap-2">
              <Select value={sort} onChange={setSort} options={SORT_OPTIONS} ariaLabel="Sortera" className="w-44" />
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                {(
                  [
                    { id: "lista", label: "Lista", icon: List },
                    { id: "karta", label: "Karta", icon: MapIcon },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={view === v.id}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 px-3 text-sm font-medium transition-colors",
                      view === v.id ? "bg-indigo-50 text-[#6366f1]" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <v.icon className="h-4 w-4" />
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 text-red-400" />
              <p className="mt-2 text-sm font-medium text-red-900">{error}</p>
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f }))}
                className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Försök igen
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
              ))}
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-medium text-slate-900">Inga tjänster matchar dina filter.</p>
              <p className="mt-1 text-sm text-slate-500">Prova att ta bort några filter eller sök på något annat.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Rensa alla filter
              </button>
            </div>
          ) : view === "karta" ? (
            <JobsMap pins={pins} />
          ) : (
            <>
              <div className="space-y-3">
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    applied={applied.includes(job.id)}
                    saved={saved.includes(job.id)}
                    onApply={() => handleApply(job)}
                    onSave={() => setSaved((p) => toggleIn(p, job.id))}
                  />
                ))}
              </div>

              {total > jobs.length && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                    Visa fler tjänster ({nf.format(total - jobs.length)})
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
