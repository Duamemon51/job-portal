"use client";

/**
 * Jobbpreferenser page
 * Place at: app/app/jobbpreferenser/page.tsx  (route: /app/jobbpreferenser)
 * JobMap.tsx lives in src/components and uses Leaflet on the client only.
 * Stack: Next.js (app router) + Tailwind + lucide-react
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  MapPin,
  Info,
  Lightbulb,
  Code2,
  ClipboardList,
  PenTool,
  Headphones,
  Megaphone,
  Wrench,
  TrendingUp,
  GraduationCap,
  Calculator,
  HeartPulse,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

const JobMap = dynamic(() => import("@/components/JobMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] animate-pulse rounded-xl border border-slate-200 bg-slate-100 lg:h-auto lg:min-h-[260px]" />
  ),
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const CATEGORIES: { id: string; label: string; sub: string; icon: IconType }[] = [
  { id: "it", label: "IT & Tech", sub: "Utveckling, data, system, IT-stöd", icon: Code2 },
  { id: "admin", label: "Administration", sub: "Kontor, assistent, koordinator", icon: ClipboardList },
  { id: "design", label: "Design & UX", sub: "Grafisk design, UX/UI, produktdesign", icon: PenTool },
  { id: "kundservice", label: "Kundservice", sub: "Support, service, kundsuccess", icon: Headphones },
  { id: "marknad", label: "Marknad & Kommunikation", sub: "Marknadsföring, SEO, innehåll", icon: Megaphone },
  { id: "ingenjor", label: "Ingenjör & Teknik", sub: "Bygg, mekanik, el, teknik", icon: Wrench },
  { id: "forsaljning", label: "Försäljning", sub: "Sälj, kundansvar, business development", icon: TrendingUp },
  { id: "utbildning", label: "Utbildning & Pedagogik", sub: "Lärare, pedagog, förskola", icon: GraduationCap },
  { id: "ekonomi", label: "Ekonomi & Finans", sub: "Redovisning, analys", icon: Calculator },
  { id: "vard", label: "Vård & Omsorg", sub: "Sjukvård, omsorg", icon: HeartPulse },
  { id: "hr", label: "HR & Personal", sub: "HR, rekrytering, bemanning", icon: Users },
  { id: "ovrigt", label: "Övrigt", sub: "Övriga jobb", icon: MoreHorizontal },
];

const POPULAR_CITIES = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping",
  "Örebro",
  "Västerås",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
  "Lund",
  "Umeå",
];

const EMPLOYMENT_TYPES = [
  { id: "heltid", label: "Heltid", sub: "Vanlig heltid" },
  { id: "deltid", label: "Deltid", sub: "1–99 %" },
  { id: "timanstallning", label: "Timanställning", sub: "Vid behov" },
  { id: "projekt", label: "Projekt", sub: "Tidsbegränsat" },
  { id: "vikariat", label: "Vikariat", sub: "Tillfällig ersättare" },
  { id: "visstid", label: "Visstidsanställning", sub: "Tidsbegränsad" },
  { id: "konsult", label: "Konsultuppdrag", sub: "Frilans / konsult" },
  { id: "praktik", label: "Praktik/LIA", sub: "Student/utbildningsnära" },
];

const EXPERIENCE_LEVELS = [
  { id: "junior", label: "Junior / Nyexaminerad", sub: "0–2 år" },
  { id: "medior", label: "Medior", sub: "3–5 år" },
  { id: "senior", label: "Senior", sub: "5+ år" },
  { id: "alla", label: "Alla nivåer", sub: "Alla erfarenhetsnivåer" },
];

const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 30];

const LOCATION_TABS = [
  { id: "ort", label: "Ort" },
  { id: "distans", label: "Distans" },
  { id: "avstand", label: "Avstånd" },
] as const;

type LocationMode = (typeof LOCATION_TABS)[number]["id"];

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Box({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors",
        checked ? "border-[#6366f1] bg-[#6366f1] text-white" : "border-slate-300 bg-white"
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-slate-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Ta bort ${label}`}
        className="grid h-4 w-4 place-items-center rounded text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
          checked ? "bg-[#6366f1]" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-4"
          )}
        />
      </button>
      <span className="text-sm text-slate-700">{label}</span>
      {hint && (
        <span title={hint} className="text-slate-400">
          <Info className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Option card used for employment type + experience level. */
function OptionCard({
  checked,
  label,
  sub,
  onClick,
}: {
  checked: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
        checked ? "border-[#6366f1]/60 bg-indigo-50/70" : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <Box checked={checked} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900">{label}</span>
        <span className="block truncate text-xs text-slate-500">{sub}</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function JobbpreferenserPage() {
  // 1. Categories (kept in selection order, like the "Valda kategorier" panel)
  const [categories, setCategories] = useState<string[]>(["it", "marknad", "kundservice", "ingenjor"]);
  const [categoryQuery, setCategoryQuery] = useState("");

  // 2. Location
  const [mode, setMode] = useState<LocationMode>("ort");
  const [cities, setCities] = useState<string[]>(["Stockholm", "Solna", "Sundbyberg"]);
  const [cityQuery, setCityQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [nationwide, setNationwide] = useState(false);

  // 3 + 4
  const [employment, setEmployment] = useState<string[]>(["heltid"]);
  const [experience, setExperience] = useState<string[]>(["medior"]);

  const [saved, setSaved] = useState(false);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q));
  }, [categoryQuery]);

  const selectedCategories = categories
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((c): c is (typeof CATEGORIES)[number] => Boolean(c));

  const addCity = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    const cap = name.charAt(0).toUpperCase() + name.slice(1);
    setCities((prev) => (prev.some((c) => c.toLowerCase() === cap.toLowerCase()) ? prev : [...prev, cap]));
    setCityQuery("");
  };

  const handleSave = () => {
    const payload = { categories, mode, cities, radius, nationwide, employment, experience };
    // TODO: send `payload` to your API
    console.log("Jobbpreferenser", payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Breadcrumb + heading */}
        <header>
          <nav aria-label="Brödsmula" className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/app/profil" className="transition-colors hover:text-slate-800">
              Profil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-800">Jobbpreferenser</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Jobbpreferenser</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Ställ in vilka typer av jobb du vill söka. Vi hittar och ansöker automatiskt till relevanta tjänster åt dig.
          </p>
        </header>

        {/* 1. Jobbkategori */}
        <Section
          title="1. Jobbkategori"
          description="Välj vilka typer av tjänster du vill söka. Du kan välja flera kategorier."
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  placeholder="Sök jobbkategorier…"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                />
              </label>

              {filteredCategories.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  Inga kategorier matchar din sökning.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {filteredCategories.map((c) => {
                    const checked = categories.includes(c.id);
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => setCategories((prev) => toggleIn(prev, c.id))}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50",
                          checked ? "border-[#6366f1]/60 bg-indigo-50/70" : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <Box checked={checked} />
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                            checked ? "bg-indigo-100 text-[#6366f1]" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-900">{c.label}</span>
                          <span className="block truncate text-xs text-slate-500">{c.sub}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Valda kategorier ({selectedCategories.length})</h3>
                  {selectedCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCategories([])}
                      className="text-xs font-medium text-[#6366f1] hover:underline"
                    >
                      Ta bort alla
                    </button>
                  )}
                </div>
                {selectedCategories.length === 0 ? (
                  <p className="mt-3 text-xs text-slate-500">Du har inte valt några kategorier än.</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCategories.map((c) => (
                      <Chip key={c.id} label={c.label} onRemove={() => setCategories((p) => p.filter((id) => id !== c.id))} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-[#6366f1]">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Tips</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Välj 3–5 kategorier för bäst resultat. Ju fler kategorier du väljer, desto fler relevanta jobb kan vi
                    hitta.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Section>

        {/* 2. Ort och arbetsplats */}
        <Section
          title="2. Ort och arbetsplats"
          description="Välj var du vill arbeta och om du är öppen för distans."
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_200px]">
            {/* Controls */}
            <div className="space-y-4">
              <div role="tablist" aria-label="Typ av plats" className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                {LOCATION_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === t.id}
                    onClick={() => setMode(t.id)}
                    className={cn(
                      "rounded-md py-1.5 text-sm font-medium transition-colors",
                      mode === t.id ? "bg-white text-[#6366f1] shadow-sm ring-1 ring-[#6366f1]/30" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {mode === "distans" ? (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-slate-600">
                  Vi söker bara jobb som kan utföras helt på distans, oavsett var du bor.
                </div>
              ) : (
                <>
                  <label className="relative block">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCity(cityQuery);
                        }
                      }}
                      placeholder="Sök en eller flera orter…"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                    />
                    {cityQuery && (
                      <button
                        type="button"
                        onClick={() => setCityQuery("")}
                        aria-label="Rensa"
                        className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </label>

                  <div className="flex items-stretch gap-2">
                    <div className="flex min-h-10 flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                      {cities.length === 0 ? (
                        <span className="px-1 text-xs text-slate-400">Inga orter valda</span>
                      ) : (
                        cities.map((c) => (
                          <Chip key={c} label={c} onRemove={() => setCities((p) => p.filter((x) => x !== c))} />
                        ))
                      )}
                    </div>
                    <label className="relative shrink-0">
                      <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        aria-label="Avstånd"
                        className="h-full min-h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                      >
                        {RADIUS_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            Inom {r} mil
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </label>
                  </div>

                  <Switch
                    checked={nationwide}
                    onChange={setNationwide}
                    label="Öppen för arbete i hela Sverige"
                    hint="Vi söker jobb i hela landet, oavsett vilka orter du valt."
                  />
                </>
              )}
            </div>

            {/* Map */}
            <JobMap cities={cities} radiusMil={radius} mode={mode} nationwide={nationwide} />

            {/* Populära orter */}
            <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 p-3">
              <h3 className="text-sm font-semibold text-slate-900">Populära orter</h3>
              <ul className="mt-2 max-h-[190px] space-y-0.5 overflow-y-auto pr-1">
                {POPULAR_CITIES.map((city) => {
                  const checked = cities.includes(city);
                  return (
                    <li key={city}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => setCities((p) => toggleIn(p, city))}
                        className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <Box checked={checked} />
                        {city}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Section>

        {/* 3 + 4 */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Section title="3. Anställningsform" description="Välj vilka anställningstyper du är intresserad av.">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {EMPLOYMENT_TYPES.map((t) => (
                <OptionCard
                  key={t.id}
                  checked={employment.includes(t.id)}
                  label={t.label}
                  sub={t.sub}
                  onClick={() => setEmployment((p) => toggleIn(p, t.id))}
                />
              ))}
            </div>
          </Section>

          <Section title="4. Erfarenhetsnivå" description="Välj vilken erfarenhetsnivå du vill söka.">
            <div className="grid gap-3 sm:grid-cols-2">
              {EXPERIENCE_LEVELS.map((l) => (
                <OptionCard
                  key={l.id}
                  checked={experience.includes(l.id)}
                  label={l.label}
                  sub={l.sub}
                  onClick={() => setExperience((p) => toggleIn(p, l.id))}
                />
              ))}
            </div>
          </Section>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pb-4">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600" role="status">
              <Check className="h-4 w-4" /> Preferenser sparade
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5558e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/50 focus-visible:ring-offset-2"
          >
            Spara preferenser
          </button>
        </div>
      </div>
    </div>
  );
}