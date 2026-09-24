"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  Mail,
  Upload,
  FileText,
  Sparkles,
  Bell,
  BarChart3,
  Zap,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RegisterIntro from "./register-intro";

/* ---------------------------------------------------------------------- */
/*  Brand mark                                                             */
/* ---------------------------------------------------------------------- */

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <defs>
            <linearGradient
              id="brandPlaneGradientFlow"
              x1="2"
              y1="20"
              x2="21"
              y2="3"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="55%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path
            fill="url(#brandPlaneGradientFlow)"
            d="M21.71 2.29a1 1 0 0 0-1.06-.23L2.35 8.9a1 1 0 0 0 .02 1.87l7.06 2.6 2.6 7.06a1 1 0 0 0 1.87.02l6.84-18.3a1 1 0 0 0-.23-1.06zM10.1 12.71 4.9 10.79l13.5-5.06zm3.19 6.31-1.92-5.2 8.63-8.64z"
          />
        </svg>
      </div>
      <span className="text-sm font-bold tracking-tight text-foreground">
        JobbAuto
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------------- */
/*  Shared bits                                                            */
/* ---------------------------------------------------------------------- */

const STEP_LABELS = ["Konto", "Profil", "Preferenser", "Dokument", "Kanal"];

function Stepper({ current }: { current: number }) {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-between sm:max-w-sm">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition ${
                  isDone
                    ? "bg-indigo-600 text-white"
                    : isActive
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : stepNum}
              </div>
              <span
                className={`hidden text-[10px] font-medium sm:block ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum !== STEP_LABELS.length && (
              <div
                className={`mx-1.5 h-px flex-1 ${
                  isDone ? "bg-indigo-600" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TopNav({ rightLabel = "Logga in", rightHref = "/login" }: { rightLabel?: string; rightHref?: string }) {
  return (
    <header className="flex items-center justify-between py-5">
      <BrandMark />
      <Link
        href={rightHref}
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {rightLabel}
      </Link>
    </header>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      {hint}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-indigo-600" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
        selected
          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  Form data shape                                                        */
/* ---------------------------------------------------------------------- */

type FormData = {
  name: string;
  email: string;
  password: string;
  title: string;
  phone: string;
  city: string;
  jobTypes: string[];
  areas: string[];
  locations: string[];
  cvFileName: string | null;
  letterFileName: string | null;
  emailProvider: "gmail" | "outlook" | "imap" | null;
  autoApply: boolean;
  notifyNewJobs: boolean;
  weeklyReport: boolean;
};

const INITIAL_DATA: FormData = {
  name: "",
  email: "",
  password: "",
  title: "",
  phone: "",
  city: "",
  jobTypes: ["Heltid"],
  areas: ["Systemutveckling", "Frontend"],
  locations: ["Stockholm", "Sundsvall", "Solna", "Remote"],
  cvFileName: null,
  letterFileName: null,
  emailProvider: null,
  autoApply: true,
  notifyNewJobs: true,
  weeklyReport: true,
};

/* ---------------------------------------------------------------------- */
/*  Wizard                                                                 */
/* ---------------------------------------------------------------------- */

export function RegisterFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1-5 stepper, 6 = allt klart, 7 = nästa steg
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInArray(key: "jobTypes" | "areas", value: string) {
    setData((prev) => {
      const set = new Set(prev[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [key]: Array.from(set) };
    });
  }

  function addLocation() {
    const trimmed = locationInput.trim();
    if (!trimmed) return;

    setData((prev) => {
      if (prev.locations.includes(trimmed)) {
        return prev;
      }
      return {
        ...prev,
        locations: [...prev.locations, trimmed],
      };
    });
    setLocationInput("");
  }

  function removeLocation(loc: string) {
    setData((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== loc),
    }));
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStep(2);
  }

  async function finishRegistration() {
    setStep(6);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <TopNav
          rightLabel={step === 7 ? "Hoppa över" : "Logga in"}
          rightHref={step === 7 ? "/app/dashboard" : "/login"}
        />

        {step <= 5 && (
          <div className="mb-8">
            <Stepper current={step} />
          </div>
        )}

        {/* STEP 1 — Skapa konto */}
        {step === 1 && (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight">Skapa ditt konto</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Ange dina uppgifter för att komma igång.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleAccountSubmit}>
              <Field label="Namn">
                <Input
                  required
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Erik Svensson"
                  className="h-11 rounded-xl"
                />
              </Field>

              <Field label="E-postadress">
                <Input
                  required
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="erik.svensson@mail.se"
                  className="h-11 rounded-xl"
                />
              </Field>

              <Field
                label="Lösenord"
                hint={
                  <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    Minst 8 tecken, gärna med bokstäver och siffror.
                  </p>
                }
              >
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full gap-2 rounded-xl bg-indigo-600 text-sm font-semibold hover:bg-indigo-700"
              >
                {isSubmitting ? "Skapar konto…" : "Fortsätt"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Har du redan ett konto?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Logga in
              </Link>
            </p>
          </section>
        )}

        {/* STEP 2 — Berätta om dig */}
        {step === 2 && (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight">Berätta lite om dig</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Vi använder informationen för att skapa bättre förslag på jobb och personliga
              ansökningar.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Ladda upp profilbild
                </button>
                <p className="text-xs text-muted-foreground">JPG, PNG (max 5 MB)</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Titel">
                <Input
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Systemutvecklare"
                  className="h-11 rounded-xl"
                />
              </Field>

              <Field label="Telefonnummer">
                <div className="flex gap-2">
                  <div className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-sm text-muted-foreground">
                    🇸🇪
                  </div>
                  <Input
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="070-123 45 67"
                    className="h-11 flex-1 rounded-xl"
                  />
                </div>
              </Field>

              <Field label="Ort">
                <Input
                  value={data.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Stockholm"
                  className="h-11 rounded-xl"
                />
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Tillbaka
              </button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold hover:bg-indigo-700"
              >
                Fortsätt
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 3 — Preferenser */}
        {step === 3 && (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight">Vad vill du jobba med?</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Välj dina preferenser så vi kan hitta relevanta jobb som matchar dig.
            </p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Jobbtyper</p>
              <div className="flex flex-wrap gap-2">
                {["Heltid", "Deltid", "Projekt", "Tillsvidare", "Timanställning", "Praktik / LIA"].map(
                  (type) => (
                    <Pill
                      key={type}
                      label={type}
                      selected={data.jobTypes.includes(type)}
                      onClick={() => toggleInArray("jobTypes", type)}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Yrkesområden (välj en eller flera)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Systemutveckling",
                  "Frontend",
                  "DevOps",
                  "Data & AI",
                  "IT-support",
                  "Projektledning",
                  "Produktutveckling",
                ].map((area) => (
                  <Pill
                    key={area}
                    label={area}
                    selected={data.areas.includes(area)}
                    onClick={() => toggleInArray("areas", area)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Önskade orter</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addLocation();
                    }
                  }}
                  placeholder="Sök orter..."
                  className="h-11 rounded-xl pl-9"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.locations.map((loc) => (
                  <span
                    key={loc}
                    className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => removeLocation(loc)}
                      aria-label={`Ta bort ${loc}`}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Tillbaka
              </button>
              <Button
                type="button"
                onClick={() => setStep(4)}
                className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold hover:bg-indigo-700"
              >
                Fortsätt
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 4 — Dokument */}
        {step === 4 && (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight">Lägg till dina dokument</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Vi använder ditt CV och personliga brev för att skräddarsy dina ansökningar.
            </p>

            <div className="mt-6 space-y-3">
              <DocumentUpload
                label="CV"
                hint="Ladda upp ditt CV (PDF, DOC, DOCX)"
                fileName={data.cvFileName}
                onUpload={(name) => update("cvFileName", name)}
              />
              <DocumentUpload
                label="Personligt brev (valfritt)"
                hint="Ladda upp ditt personliga brev (valfritt)"
                fileName={data.letterFileName}
                onUpload={(name) => update("letterFileName", name)}
              />

              <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Eller skapa med AI</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Vill du att vi skapar ett professionellt CV och personligt brev baserat på
                      din profil?
                    </p>
                    <button
                      type="button"
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Skapa med AI
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Tillbaka
              </button>
              <Button
                type="button"
                onClick={() => setStep(5)}
                className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold hover:bg-indigo-700"
              >
                Fortsätt
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 5 — Koppla e-post */}
        {step === 5 && (
          <section>
            <h1 className="text-2xl font-semibold tracking-tight">
              Koppla din e-post <span className="text-muted-foreground">(valfritt)</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Koppla din e-post så vi kan skicka ansökningar automatiskt och hålla koll på svar.
            </p>

            <div className="mt-6 space-y-2.5">
              <EmailProviderRow
                label="Gmail"
                hint="Koppla ditt Google-konto"
                selected={data.emailProvider === "gmail"}
                onClick={() => update("emailProvider", "gmail")}
                icon={<span className="text-lg">📧</span>}
              />
              <EmailProviderRow
                label="Outlook"
                hint="Koppla ditt Microsoft-konto"
                selected={data.emailProvider === "outlook"}
                onClick={() => update("emailProvider", "outlook")}
                icon={<Mail className="h-4 w-4 text-blue-600" />}
              />
              <EmailProviderRow
                label="Annan e-post (IMAP/SMTP)"
                hint="Använd en egen e-postserver"
                selected={data.emailProvider === "imap"}
                onClick={() => update("emailProvider", "imap")}
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="mt-4 rounded-xl bg-muted/60 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Säkert och tryggt.</span> Vi
                använder säkra autentiseringstjänster och delar aldrig tillgång till mer än det
                som behövs för att skicka ansökningar.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Tillbaka
              </button>
              <Button
                type="button"
                onClick={finishRegistration}
                disabled={isSubmitting}
                className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Slutför registrering
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </section>
        )}

        {/* STEP 6 — Allt klart */}
        {step === 6 && (
          <section className="flex flex-col items-center text-center">
            <div className="relative grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">Allt klart!</h1>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Ditt konto är skapat och du är redo att börja söka jobb automatiskt med JobbAuto.
            </p>

            <ul className="mt-6 w-full max-w-xs space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-left">
              {[
                "Konto skapat",
                "Profil sparad",
                "Jobbpreferenser inställda",
                "CV och dokument uppladdade",
                "E-post kopplad",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              onClick={() => setStep(7)}
              className="mt-6 h-11 w-full max-w-xs gap-2 rounded-xl bg-indigo-600 text-sm font-semibold hover:bg-indigo-700"
            >
              Gå till din dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        )}

        {/* STEP 7 — Nästa steg */}
        {step === 7 && (
          <section>
            <h1 className="text-center text-2xl font-bold tracking-tight">Nästa steg</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Vill du att vi ska börja söka jobb åt dig direkt nu?
            </p>

            <div className="mt-6 space-y-3">
              <SettingRow
                icon={<Zap className="h-4 w-4 text-indigo-600" />}
                title="Aktivera automatisk ansökan"
                description="Vi söker och skickar relevanta ansökningar baserat på dina preferenser."
                checked={data.autoApply}
                onChange={(v) => update("autoApply", v)}
              />
              <SettingRow
                icon={<Bell className="h-4 w-4 text-indigo-600" />}
                title="Få notiser om nya jobb"
                description="Få ett mejl när vi hittar nya relevanta tjänster."
                checked={data.notifyNewJobs}
                onChange={(v) => update("notifyNewJobs", v)}
              />
              <SettingRow
                icon={<BarChart3 className="h-4 w-4 text-indigo-600" />}
                title="Veckorapport"
                description="Få en sammanfattning av dina ansökningar varje vecka."
                checked={data.weeklyReport}
                onChange={(v) => update("weeklyReport", v)}
              />
            </div>

            <Button
              type="button"
              onClick={() => router.push("/app/dashboard")}
              className="mt-6 h-11 w-full gap-2 rounded-xl bg-indigo-600 text-sm font-semibold hover:bg-indigo-700"
            >
              Starta JobbAuto
              <ArrowRight className="h-4 w-4" />
            </Button>
            <button
              type="button"
              onClick={() => router.push("/app/dashboard")}
              className="mt-3 w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Jag gör det senare
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------------- */
/*  Small subcomponents                                                    */
/* ---------------------------------------------------------------------- */

function DocumentUpload({
  label,
  hint,
  fileName,
  onUpload,
}: {
  label: string;
  hint: string;
  fileName: string | null;
  onUpload: (name: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border p-3 transition hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {fileName ? (
            <p className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3 w-3" />
              Uppladdad: {fileName}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 text-xs font-semibold text-primary">
        {fileName ? "Byt fil" : "Ladda upp"}
      </span>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file.name);
        }}
      />
    </label>
  );
}

function EmailProviderRow({
  label,
  hint,
  icon,
  selected,
  onClick,
}: {
  label: string;
  hint: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
        selected ? "border-indigo-600 bg-indigo-50/60" : "border-border hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-border">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      {selected && (
        <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-600 text-white">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
}

function SettingRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterIntro />;
}