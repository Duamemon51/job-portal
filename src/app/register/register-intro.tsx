"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, FileUser } from "lucide-react";
import { Button } from "@/components/ui/button";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <defs>
            <linearGradient
              id="brandPlaneGradientRegister"
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
            fill="url(#brandPlaneGradientRegister)"
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

const FEATURES = [
  "Automatiska jobbansökningar",
  "Personliga ansökningar med AI",
  "Koppla din e-post",
  "Full kontroll och statistik",
];

const COMPANIES = [
  { label: "Spotify", initial: "S", bg: "bg-[#1DB954]", text: "text-white" },
  { label: "Klarna", initial: "K", bg: "bg-[#FFB3C7]", text: "text-black" },
  { label: "Northvolt", initial: "N", bg: "bg-black", text: "text-white" },
  { label: "ICA", initial: "ICA", bg: "bg-[#E3000F]", text: "text-white" },
];

export default function RegisterIntro() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        {/* TOP NAV */}
        <header className="flex items-center justify-between py-2">
          <BrandMark />
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Logga in
          </Link>
        </header>

        {/* HERO */}
        <section className="flex flex-col items-center pb-6 pt-5 text-center sm:pt-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Kom igång gratis
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Skapa ett konto och börja söka jobb automatiskt på bara några
            minuter.
          </p>

          <ul className="mt-6 w-full max-w-xs space-y-2.5 text-left">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>

          {/* SOCIAL PROOF CARD */}
          <div className="relative mt-8 w-full rounded-[10px] border border-border bg-white p-4 text-left shadow-lg">
            <div className="absolute -top-2.5 -right-2.5 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileUser className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Ansökan skickad
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Frontend Developer · Spotify
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                  2 minuter sedan
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {COMPANIES.map((company) => (
                <div
                  key={company.label}
                  className={`grid h-8 flex-1 place-items-center rounded-lg text-[11px] font-bold ${company.bg} ${company.text}`}
                  title={company.label}
                >
                  {company.initial}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/register/formular")}
            className="mt-6 h-11 w-full gap-2 rounded-xl bg-indigo-600 text-sm font-semibold hover:bg-indigo-700"
          >
            Skapa konto
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Logga in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}