"use client";

import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import LogoStrip from "@/components/LogoStrip";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Link from "next/link";
import { ReactNode, useState } from "react";
import Footer from "@/components/Footer";
const links = [
  { href: "#jobb", label: "Hitta jobb" },
  { href: "#kategorier", label: "Kategorier" },
  { href: "#foretag", label: "Företag" },
  { href: "#omdomen", label: "Omdömen" },
];
const BLUE = "#4F5BE8";
 
const Icon = ({ d, size = 14, className = "" }: { d: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);
 
const P = {
  plane: "M21 3 3 10.5l7 3 3 7L21 3Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-3.5-3.5",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  mail: "M4 5h16v14H4V5Zm0 0 8 8 8-8",
  sliders: "M4 6h16M4 12h16M4 18h16",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-11v3m0 10v3M4 12h3m10 0h3",
  inbox: "M4 13l2-8h12l2 8v6H4v-6Zm0 0h5l1 2h4l1-2h5",
  check: "m5 12 4 4 10-10",
  briefcase: "M4 8h16v11H4V8Zm5 0V5h6v3",
};
 
const nav = [
  { label: "Översikt", d: P.search, active: true },
  { label: "Lediga tjänster", d: P.search },
  { label: "Mina ansökta jobb", d: P.file },
  { label: "Profil", d: P.user },
  { label: "CV & dokument", d: P.file },
  { label: "Personligt brev", d: P.mail },
  { label: "Jobbpreferenser", d: P.sliders },
  { label: "E-postintegration", d: P.mail },
  { label: "Inställningar", d: P.gear },
];
 
const stats = [
  { v: "48", l: "Ansökningar", d: P.plane, c: "bg-[#EEF0FF] text-[#4F5BE8]" },
  { v: "12", l: "Intervjuer", d: P.inbox, c: "bg-[#E3F1FF] text-[#2F8CE8]" },
  { v: "73%", l: "Svarsfrekvens", d: P.mail, c: "bg-[#DFF6E8] text-[#22A35E]" },
  { v: "3", l: "Kommande intervjuer", d: P.briefcase, c: "bg-[#EFE9FE] text-[#7C5CE8]" },
];
 
const bars = [22, 10, 14, 20, 38, 50, 20, 12, 60, 42, 40, 55, 62, 45, 78, 48, 82, 56, 66, 30, 22, 40, 26, 18, 30, 44, 76, 50];
 
const rows = [
  { job: "Frontend Developer", co: "Spotify", date: "2025-09-01", st: "Skickad", tile: "S", tc: "bg-[#1FBF63]", pill: "bg-[#E8EEFE] text-[#4F5BE8]" },
  { job: "Systemutvecklare", co: "Klarna", date: "2025-08-20", st: "Svar mottaget", tile: "K", tc: "bg-[#F472A8]", pill: "bg-[#EFE9FE] text-[#7C5CE8]" },
  { job: "Backend Developer", co: "Northvolt", date: "2025-08-19", st: "Intervju", tile: "K", tc: "bg-[#DC2F3E]", pill: "bg-[#FFF1E0] text-[#E8890C]" },
  { job: "Fullstack Developer", co: "ICA", date: "2025-08-19", st: "Skickad", tile: "n", tc: "bg-[#111]", pill: "bg-[#E8EEFE] text-[#4F5BE8]" },
];
 
const CheckDot = () => (
  <span className="w-5 h-5 rounded-full bg-[#22A35E] flex items-center justify-center shrink-0">
    <Icon d={P.check} size={12} className="text-white" />
  </span>
);
 
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-[#EEF1FA] shadow-sm shadow-[#4F5BE8]/5 ${className}`}>{children}</div>
);
 
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="font-[Inter] text-[#152238] bg-[#F4F9FF]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.7s ease-out forwards; }
      `}</style>
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#DCE7F5]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo: icon + wordmark */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-[#4F5BE8]"
          >
            <path
              d="M21 3 3 10.5l7 3 3 7L21 3Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#12294D] tracking-tight">
            JobbAuto
          </span>
        </Link>
 
        {/* Centered links */}
        <div className="hidden md:flex items-center justify-center gap-6 xl:gap-8 text-sm font-medium text-[#12294D]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[#4F5BE8] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
 
        {/* Actions: outlined secondary + solid primary */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-xs sm:text-sm font-medium px-3 py-2 sm:px-4 rounded-lg bg-white text-[#12294D] border border-[#DCE7F5] shadow-sm hover:bg-[#F5F8FD] transition-colors"
          >
            Logga in
          </Link>
          <button className="hidden md:inline-flex text-[11px] sm:text-sm font-medium px-3 py-2 sm:px-4 rounded-lg bg-[#4F5BE8] text-white shadow-sm shadow-[#4F5BE8]/25 hover:bg-[#3F4AD0] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F5BE8]">
            Annonsera jobb
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE7F5] bg-white text-[#12294D] shadow-sm md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition-all ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#DCE7F5] bg-white/95 md:hidden">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-2 px-4 py-3 text-sm font-medium text-[#12294D]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-[#EEF0FF] hover:text-[#4F5BE8] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg border border-[#DCE7F5] bg-white px-3 py-2 text-center text-[#12294D]"
            >
              Logga in
            </Link>
            <button className="rounded-lg bg-[#4F5BE8] px-3 py-2 text-white shadow-sm shadow-[#4F5BE8]/25">
              Annonsera jobb
            </button>
          </div>
        </div>
      )}
    </nav>
  <section className="relative overflow-hidden font-['Inter'] pt-24 pb-16 px-4 sm:px-6 md:pt-28 md:pb-20 bg-gradient-to-br from-[#F1F5FE] via-white to-[#EEF1FD]">
      <div className="relative max-w-[1400px] mx-auto grid gap-8 lg:grid-cols-[0.95fr_1.55fr] lg:gap-14 items-center">
        {/* LEFT */}
        <div>
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#4F5BE8] bg-[#ECEFFD] px-4 py-2 rounded-full">
            <span>• Spara tid</span>
            <span>• Få fler intervjuer</span>
            <span>• Helt automatiskt</span>
          </span>
 
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-[#0B1220]">
            Automatiska
            <br />
            jobbansökningar
            <br />
            som{" "}
            <span className="bg-gradient-to-r from-[#3B4FD8] to-[#6D5CF0] bg-clip-text text-transparent">
              gör jobbet åt dig.
            </span>
          </h1>
 
          <p className="mt-6 text-base sm:text-lg text-[#5B6B82] max-w-lg leading-relaxed">
            Skapa din profil, välj vilka jobb du vill söka och låt JobbAuto skicka personliga
            ansökningar automatiskt – så att du kan fokusera på intervjuer och nästa steg i karriären.
          </p>
 
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#4F5BE8] shadow-md shadow-[#4F5BE8]/25 hover:bg-[#3F4AD0] transition-colors">
              Kom igång gratis <span aria-hidden>→</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg text-sm font-semibold text-[#12294D] bg-white border border-[#4F5BE8]/60 hover:bg-[#F5F6FE] transition-colors">
              <span className="w-6 h-6 rounded-full bg-[#4F5BE8] flex items-center justify-center text-white">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4V1Z" /></svg>
              </span>
              Se hur det fungerar
            </button>
          </div>
 
          <ul className="mt-8 space-y-3 text-[15px] text-[#5B6B82]">
            {["Personliga ansökningar med AI", "Koppla din egen e-post – tryggt och säkert", "Spara timmar varje vecka"].map((t) => (
              <li key={t} className="flex items-center gap-3"><CheckDot />{t}</li>
            ))}
          </ul>
        </div>
 
        {/* RIGHT — app window */}
        <div className="w-full max-w-[820px] justify-self-end rounded-xl bg-white border border-[#E6EAF7] shadow-2xl shadow-[#4F5BE8]/10 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
            <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
            <span className="w-2 h-2 rounded-full bg-[#28C840]" />
            <span className="ml-4 h-2 w-1/3 rounded-full bg-[#F1F4FA]" />
          </div>
 
          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-44 shrink-0 flex-col gap-0.5 px-3 pb-6 text-[11px]">
              <div className="flex items-center gap-2 px-2 py-2 mb-2 font-bold text-[#12294D]">
                <Icon d={P.plane} size={18} className="text-[#4F5BE8] fill-[#4F5BE8]" /> JobbAuto
              </div>
              {nav.map((n) => (
                <div key={n.label}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${n.active ? "bg-[#EEF0FF] text-[#4F5BE8] font-semibold" : "text-[#5B6B82]"}`}>
                  <Icon d={n.d} size={13} /> {n.label}
                </div>
              ))}
            </aside>
 
            {/* Main */}
            <div className="flex-1 min-w-0 bg-[#FAFBFE] p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0B1220]">Hej Erik!</h3>
                <p className="text-[10px] text-[#8A99AE] mt-0.5">Här är en översikt över din jobbsökning.</p>
              </div>
 
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <Card key={s.l} className="p-3.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.c}`}><Icon d={s.d} size={14} /></span>
                    <div className="mt-3 text-lg font-bold text-[#0B1220] leading-none">{s.v}</div>
                    <div className="mt-1 text-[9px] text-[#8A99AE]">{s.l}</div>
                  </Card>
                ))}
              </div>
 
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0B1220]">Ansökningar över tid</span>
                  <span className="text-[9px] text-[#5B6B82] border border-[#E6EAF7] rounded-md px-2 py-1">Senaste 30 dagarna ⌄</span>
                </div>
                <div className="mt-4 flex items-end gap-[3%] h-28 border-b border-[#EEF1FA]">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#B8C0FA] to-[#4F5BE8]" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[8px] text-[#8A99AE]">
                  {["26 aug", "2 sep", "9 sep", "16 sep", "23 sep", "30 sep"].map((d) => <span key={d}>{d}</span>)}
                </div>
              </Card>
 
              <Card className="p-4">
                <div className="text-[11px] font-semibold text-[#0B1220] mb-2">Senaste ansökningar</div>
                <div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr] text-[9px] font-semibold text-[#0B1220] pb-2">
                  <span>Tjänst</span><span>Företag</span><span>Datum</span><span>Status</span>
                </div>
                {rows.map((r) => (
                  <div key={r.job + r.date + r.co} className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr] items-center text-[9px] py-2 border-t border-[#F0F3FA]">
                    <span className="flex items-center gap-2 font-semibold text-[#0B1220]">
                      <span className={`w-5 h-5 rounded-md text-white text-[9px] font-bold flex items-center justify-center ${r.tc}`}>{r.tile}</span>
                      <span className="truncate">{r.job}</span>
                    </span>
                    <span className="text-[#5B6B82]">{r.co}</span>
                    <span className="text-[#8A99AE]">{r.date}</span>
                    <span className={`w-fit px-2 py-1 rounded-md font-medium ${r.pill}`}>{r.st}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
   <LogoStrip />
   <HowItWorks  />
   <Features />
   <Pricing />
   <Testimonials />
   <Faq />
   <Footer />
    
    </main>
  );
}