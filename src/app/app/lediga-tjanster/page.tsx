"use client";

/**
 * Lediga tjänster page
 * Place at: app/app/lediga-tjanster/page.tsx  (route: /app/lediga-tjanster)
 * JobsMap.tsx lives in src/components and renders the job locations in an iframe.
 * Stack: Next.js (app router) + Tailwind + lucide-react
 *
 * Data is mocked (JOBS below) – replace with your API. Filtering/sorting already works on it.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bookmark,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Info,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const JobsMap = dynamic(() => import("@/components/JobsMap"), {
  ssr: false,
  loading: () => <div className="h-[640px] animate-pulse rounded-xl border border-slate-200 bg-slate-100" />,
});

/* ------------------------------------------------------------------ */
/* Types + mock data                                                   */
/* ------------------------------------------------------------------ */

type Setup = "plats" | "hybrid" | "remote";

type Job = {
  id: string;
  title: string;
  company: string;
  initials: string;
  brand: { bg: string; fg: string; round?: boolean };
  isNew: boolean;
  location: string;
  city: string; // matches a CITY_OPTIONS id
  setups: Setup[];
  employment: string; // matches an EMPLOYMENT_OPTIONS id
  levels: string[];
  category: string; // matches a CATEGORY_OPTIONS id
  publishedDays: number;
  salary: [number, number];
  description: string;
  tags: string[];
  pos: [number, number];
};

const JOBS: Job[] = [
  {
    id: "spotify-frontend",
    title: "Frontend Developer (React)",
    company: "Spotify",
    initials: "S",
    brand: { bg: "#1DB954", fg: "#ffffff", round: true },
    isNew: true,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 0,
    salary: [55000, 75000],
    description:
      "Vi söker en frontendutvecklare med fokus på React och TypeScript till teamet som bygger nästa generations lyssnarupplevelse.",
    tags: ["React", "TypeScript", "Next.js", "Jest", "Figma"],
    pos: [59.3293, 18.0686],
  },
  {
    id: "klarna-net",
    title: "Systemutvecklare .NET",
    company: "Klarna",
    initials: "K",
    brand: { bg: "#FFB3C7", fg: "#17120f" },
    isNew: true,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 1,
    salary: [52000, 70000],
    description:
      "Vill du utveckla stabila betalningssystem? Vi söker en systemutvecklare med erfarenhet av .NET och molnbaserade lösningar.",
    tags: [".NET", "C#", "Azure", "SQL", "Microservices"],
    pos: [59.3396, 18.0577],
  },
  {
    id: "northvolt-backend",
    title: "Backend Developer (Node.js)",
    company: "Northvolt",
    initials: "n",
    brand: { bg: "#111111", fg: "#ffffff" },
    isNew: false,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 0,
    salary: [50000, 68000],
    description:
      "Du bygger och skalar backend-tjänster som styr våra produktionsflöden, med Node.js, TypeScript och PostgreSQL.",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    pos: [59.3172, 18.0344],
  },
  {
    id: "ica-fullstack",
    title: "Fullstack Developer",
    company: "ICA",
    initials: "ICA",
    brand: { bg: "#E3000F", fg: "#ffffff" },
    isNew: false,
    location: "Solna",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior"],
    category: "it",
    publishedDays: 2,
    salary: [48000, 64000],
    description:
      "Som fullstackutvecklare på ICA bygger du digitala tjänster som används av miljontals kunder varje vecka.",
    tags: ["React", "Node.js", "AWS", "Docker", "Java"],
    pos: [59.36, 18.0009],
  },
  {
    id: "seb-java",
    title: "Systemutvecklare (Java)",
    company: "SEB",
    initials: "SEB",
    brand: { bg: "#60CD18", fg: "#ffffff" },
    isNew: false,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["senior"],
    category: "it",
    publishedDays: 3,
    salary: [58000, 78000],
    description:
      "Vi söker en systemutvecklare till vårt team inom betalningar. Du arbetar med Java, Spring och Kafka i en agil miljö.",
    tags: ["Java", "Spring", "Kafka", "Backend", "Kubernetes"],
    pos: [59.3323, 18.0714],
  },
  {
    id: "scania-devops",
    title: "DevOps Engineer",
    company: "Scania",
    initials: "S",
    brand: { bg: "#041E42", fg: "#ffffff", round: true },
    isNew: false,
    location: "Södertälje",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 1,
    salary: [54000, 72000],
    description:
      "Du utvecklar och driftar CI/CD-pipelines och molninfrastruktur för Scanias uppkopplade fordonsplattform.",
    tags: ["AWS", "Docker", "Terraform", "Kubernetes", "CI/CD"],
    pos: [59.1955, 17.6253],
  },
  {
    id: "ericsson-sysadmin",
    title: "Systemadministratör",
    company: "Ericsson",
    initials: "E",
    brand: { bg: "#0082F0", fg: "#ffffff" },
    isNew: false,
    location: "Kista",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior"],
    category: "it",
    publishedDays: 5,
    salary: [46000, 60000],
    description:
      "Vi behöver en systemadministratör som ansvarar för drift, övervakning och säkerhet i vår Linux- och molnmiljö.",
    tags: ["Linux", "AWS", "Nätverk", "Bash", "Säkerhet"],
    pos: [59.403, 17.944],
  },
  {
    id: "hm-data",
    title: "Dataingenjör",
    company: "H&M",
    initials: "H&M",
    brand: { bg: "#E50010", fg: "#ffffff" },
    isNew: false,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 6,
    salary: [52000, 70000],
    description:
      "Bygg skalbara datapipelines som ger H&M:s analysteam tillförlitlig data i nära realtid.",
    tags: ["Python", "SQL", "Databricks", "Spark", "ETL"],
    pos: [59.3345, 18.0632],
  },
  {
    id: "volvo-fullstack",
    title: "Fullstackutvecklare",
    company: "Volvo Cars",
    initials: "V",
    brand: { bg: "#003057", fg: "#ffffff", round: true },
    isNew: false,
    location: "Göteborg",
    city: "goteborg",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["medior", "senior"],
    category: "it",
    publishedDays: 4,
    salary: [50000, 68000],
    description:
      "Utveckla digitala tjänster för nästa generations elbilar tillsammans med ett tvärfunktionellt team.",
    tags: ["React", "Kotlin", "GCP", "REST", "Agile"],
    pos: [57.7089, 11.9746],
  },
  {
    id: "telia-cloud",
    title: "Molnarkitekt",
    company: "Telia",
    initials: "T",
    brand: { bg: "#990AE3", fg: "#ffffff" },
    isNew: false,
    location: "Stockholm",
    city: "stockholm",
    setups: ["hybrid", "remote"],
    employment: "heltid",
    levels: ["senior"],
    category: "it",
    publishedDays: 8,
    salary: [65000, 90000],
    description:
      "Som molnarkitekt leder du utformningen av säkra och kostnadseffektiva molnlösningar för våra företagskunder.",
    tags: ["Azure", "AWS", "Arkitektur", "Terraform", "Säkerhet"],
    pos: [59.3421, 18.0207],
  },
];

/** Shown in the header when nothing is narrowed down – replace with the total from your API. */
const DEMO_TOTAL = 2219;
const PAGE_SIZE = 8;

/* Static facet options (counts are demo numbers) */
const CATEGORY_OPTIONS = [
  { id: "it", label: "IT & Tech", count: 1245 },
  { id: "marknad", label: "Marknad & Kommunikation", count: 487 },
  { id: "design", label: "Design & UX", count: 312 },
  { id: "admin", label: "Administration", count: 267 },
  { id: "kundservice", label: "Kundservice", count: 651 },
  { id: "forsaljning", label: "Försäljning", count: 703 },
  { id: "ekonomi", label: "Ekonomi & Finans", count: 540 },
  { id: "hr", label: "HR & Personal", count: 198 },
  { id: "vard", label: "Vård & Omsorg", count: 812 },
  { id: "utbildning", label: "Utbildning & Pedagogik", count: 356 },
  { id: "ingenjor", label: "Ingenjör & Teknik", count: 421 },
  { id: "ovrigt", label: "Övrigt", count: 289 },
];
const COLLAPSED_CATEGORY_COUNT = 5;

const CITY_OPTIONS = [
  { id: "stockholm", label: "Stockholm", count: 894 },
  { id: "goteborg", label: "Göteborg", count: 421 },
  { id: "malmo", label: "Malmö", count: 289 },
  { id: "remote", label: "Distans / Remote", count: 1102 },
  { id: "hela", label: "Hela Sverige", count: 1984 },
];

const EMPLOYMENT_OPTIONS = [
  { id: "heltid", label: "Heltid", count: 1861 },
  { id: "deltid", label: "Deltid", count: 243 },
  { id: "projekt", label: "Projekt", count: 39 },
  { id: "visstid", label: "Visstid", count: 187 },
  { id: "timanstallning", label: "Timanställning", count: 38 },
  { id: "praktik", label: "Praktik / LIA", count: 17 },
];

const LEVEL_OPTIONS = [
  { id: "junior", label: "Junior (0–2 år)", count: 412 },
  { id: "medior", label: "Medior (3–5 år)", count: 891 },
  { id: "senior", label: "Senior (5+ år)", count: 640 },
  { id: "alla", label: "Alla nivåer", count: 2219 },
];

const SETUP_OPTIONS: { id: Setup; label: string; count: number }[] = [
  { id: "plats", label: "På plats", count: 401 },
  { id: "hybrid", label: "Hybrid", count: 856 },
  { id: "remote", label: "Remote", count: 1162 },
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

const LEVEL_LABEL = Object.fromEntries(LEVEL_OPTIONS.map((o) => [o.id, o.label]));
const SETUP_LABEL = Object.fromEntries(SETUP_OPTIONS.map((o) => [o.id, o.label])) as Record<Setup, string>;
const EMPLOYMENT_LABEL = Object.fromEntries(EMPLOYMENT_OPTIONS.map((o) => [o.id, o.label]));

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

/** What the screenshot shows as pre-selected. */
const DEFAULT_FILTERS: Filters = {
  keyword: "",
  categories: ["it"],
  cities: ["stockholm", "remote"],
  employment: ["heltid"],
  levels: ["medior", "senior"],
  setups: ["remote"],
  salary: [20000, SALARY_MAX],
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
  count: number;
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
      <span className="text-xs tabular-nums text-slate-400">{nf.format(count)}</span>
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
  const mainSetup = job.setups.includes("hybrid") ? "hybrid" : job.setups[0];
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
          <Meta icon={Briefcase}>{EMPLOYMENT_LABEL[job.employment]}</Meta>
          <Meta icon={Clock}>{publishedLabel(job.publishedDays)}</Meta>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{job.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((t) => (
            <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:self-start">
        <button
          type="button"
          onClick={onApply}
          disabled={applied}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
            applied
              ? "cursor-default bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-[#6366f1] text-white hover:bg-[#5558e6]"
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
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [applied, setApplied] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const keywordRef = useRef<HTMLInputElement>(null);

  const setF = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setVisible(PAGE_SIZE);
  };

  const submitSearch = () => {
    setQuery(queryInput.trim());
    setVisible(PAGE_SIZE);
  };

  const pickQuickTag = (tag: string) => {
    const next = query.toLowerCase() === tag.toLowerCase() ? "" : tag;
    setQueryInput(next);
    setQuery(next);
    setVisible(PAGE_SIZE);
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQueryInput("");
    setQuery("");
    setCityQuery("");
    setVisible(PAGE_SIZE);
  };

  const openMoreFilters = () => {
    setFiltersOpen(true);
    setTimeout(() => keywordRef.current?.focus(), 0);
  };

  const filtered = useMemo(() => {
    const terms = [query, filters.keyword].flatMap((s) => s.toLowerCase().split(/\s+/).filter(Boolean));
    const [minSalary, maxSalary] = filters.salary;

    const list = JOBS.filter((job) => {
      if (filters.categories.length && !filters.categories.includes(job.category)) return false;

      if (filters.cities.length) {
        const ok =
          filters.cities.includes("hela") ||
          filters.cities.includes(job.city) ||
          (filters.cities.includes("remote") && job.setups.includes("remote"));
        if (!ok) return false;
      }

      if (filters.employment.length && !filters.employment.includes(job.employment)) return false;

      if (filters.levels.length && !filters.levels.includes("alla") && !job.levels.some((l) => filters.levels.includes(l)))
        return false;

      if (filters.setups.length && !job.setups.some((s) => filters.setups.includes(s))) return false;

      if (job.salary[1] < minSalary) return false;
      if (maxSalary < SALARY_MAX && job.salary[0] > maxSalary) return false;

      if (filters.published !== "any" && job.publishedDays > Number(filters.published)) return false;

      if (terms.length) {
        const hay = [
          job.title,
          job.company,
          job.description,
          job.location,
          job.tags.join(" "),
          job.levels.map((l) => LEVEL_LABEL[l]).join(" "),
          job.setups.map((s) => SETUP_LABEL[s]).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "aldst") return b.publishedDays - a.publishedDays;
      if (sort === "foretag") return a.company.localeCompare(b.company, "sv");
      return a.publishedDays - b.publishedDays;
    });
  }, [filters, query, sort]);

  const total = filtered.length === JOBS.length ? DEMO_TOTAL : filtered.length;
  const shown = filtered.slice(0, visible);

  const pins = useMemo(
    () => filtered.map((j) => ({ id: j.id, title: j.title, company: j.company, location: j.location, pos: j.pos })),
    [filtered]
  );

  const categoryRows = showAllCats
    ? CATEGORY_OPTIONS
    : CATEGORY_OPTIONS.filter(
        (c, i) => i < COLLAPSED_CATEGORY_COUNT || filters.categories.includes(c.id)
      );

  const cityRows = CITY_OPTIONS.filter((c) => c.label.toLowerCase().includes(cityQuery.trim().toLowerCase()));

  return (
    <div className="min-h-full bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
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
                        count={c.count}
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
                          count={c.count}
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
                        count={o.count}
                        checked={filters.employment.includes(o.id)}
                        onToggle={() => setF("employment", toggleIn(filters.employment, o.id))}
                      />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Erfarenhetsnivå">
                  <div className="space-y-0.5">
                    {LEVEL_OPTIONS.map((o) => (
                      <CheckRow
                        key={o.id}
                        label={o.label}
                        count={o.count}
                        checked={filters.levels.includes(o.id)}
                        onToggle={() => setF("levels", toggleIn(filters.levels, o.id))}
                      />
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Lön (SEK/mån)">
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
                    <RangeSlider
                      value={filters.salary}
                      onChange={(v) => setF("salary", v)}
                      max={SALARY_MAX}
                      step={5000}
                    />
                    <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                      {SALARY_TICKS.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </FilterGroup>

                <FilterGroup title="Publiceringsdatum">
                  <Select
                    value={filters.published}
                    onChange={(v) => setF("published", v)}
                    options={PUBLISHED_OPTIONS}
                    ariaLabel="Publiceringsdatum"
                  />
                </FilterGroup>

                <FilterGroup title="Work setup">
                  <div className="space-y-0.5">
                    {SETUP_OPTIONS.map((o) => (
                      <CheckRow
                        key={o.id}
                        label={o.label}
                        count={o.count}
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
              <h2 className="text-base font-semibold text-slate-900">{nf.format(total)} lediga tjänster</h2>

              <div className="flex items-center gap-2">
                <Select
                  value={sort}
                  onChange={setSort}
                  options={SORT_OPTIONS}
                  ariaLabel="Sortera"
                  className="w-44"
                />
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

            {filtered.length === 0 ? (
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
                  {shown.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      applied={applied.includes(job.id)}
                      saved={saved.includes(job.id)}
                      onApply={() => setApplied((p) => (p.includes(job.id) ? p : [...p, job.id]))}
                      onSave={() => setSaved((p) => toggleIn(p, job.id))}
                    />
                  ))}
                </div>

                {filtered.length > visible && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      Visa fler tjänster ({filtered.length - visible})
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}