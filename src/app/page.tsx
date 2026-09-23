import Link from "next/link";
export default function Home() {
  return (
    <main className="font-[Inter] text-[#152238] bg-[#F4F9FF]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.7s ease-out forwards; }
      `}</style>
{/* NAVBAR */}
<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#DCE7F5]">
  <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
    <span className="font-['Space_Grotesk'] text-xl font-bold text-[#12294D] tracking-tight">
      Hire<span className="text-[#2F7BE0]">Path</span>
    </span>
    <div className="hidden md:flex items-center gap-8 text-sm text-[#4A6076]">
      <a href="#jobb" className="hover:text-[#12294D] transition-colors">Hitta jobb</a>
      <a href="#kategorier" className="hover:text-[#12294D] transition-colors">Kategorier</a>
      <a href="#foretag" className="hover:text-[#12294D] transition-colors">Företag</a>
      <a href="#omdomen" className="hover:text-[#12294D] transition-colors">Omdömen</a>
    </div>
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm text-[#4A6076] hover:text-[#12294D] transition-colors"
      >
        Logga in
      </Link>
      <button className="text-sm px-4 py-2 rounded-md bg-[#2F7BE0] text-white font-medium hover:bg-[#1E5FC2] transition-colors shadow-sm shadow-[#2F7BE0]/20">
        Annonsera jobb
      </button>
    </div>
  </div>
</nav>

    {/* HERO */}
<section className="relative pt-20 pb-24 px-6 overflow-hidden bg-gradient-to-br from-white via-white to-[#EEF5FF]">
  {/* Background glow */}
  <div className="absolute top-0 right-0 w-[36rem] h-[36rem] bg-[#CFE6FF] rounded-full blur-3xl opacity-50 -translate-y-1/3 translate-x-1/4" />

  <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
    {/* LEFT COLUMN */}
    <div>
      <span className="inline-block text-xs font-bold tracking-wide text-[#2F7BE0] bg-[#E4F0FF] px-4 py-2 rounded-full border border-[#CFE1FA]">
        SVERIGES SMARTASTE REKRYTERINGSPLATTFORM
      </span>

      <h1 className="font-['Space_Grotesk'] text-6xl font-extrabold leading-[1.05] tracking-tight mt-6">
        <span className="text-[#0A0F1A]">Hitta kandidaten<br />som passar<br />tjänsten.</span>
        <br />
        <span className="text-[#2F7BE0]">Inte bara CV:t.</span>
      </h1>

      <p className="mt-6 text-lg text-[#4A6076] max-w-md leading-relaxed">
        Jobbportal samlar ansökningar, CV:n och verklig kandidataktivitet på
        ett ställe — så att du snabbt hittar rätt person, skickar
        erbjudande och håller koll på hela rekryteringsprocessen.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
       <button className="flex items-center gap-2 px-6 py-3.5 bg-[#2F7BE0] text-white text-sm font-semibold rounded-full hover:bg-[#1E5FC2] hover:shadow-lg hover:shadow-[#2F7BE0]/25 transition-all">
  Sök jobb
  <span aria-hidden>→</span>
</button>
<button className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#12294D] text-sm font-semibold rounded-full border border-[#DCE7F5] hover:border-[#2F7BE0]/40 transition-colors">
  <span className="w-6 h-6 rounded-full bg-[#2F7BE0] flex items-center justify-center text-white text-xs">▶</span>
  Skapa CV gratis
</button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-[#12294D]">
        <span className="flex items-center gap-1.5">
          <span className="text-[#2F7BE0]">✓</span> Verifierade kandidater
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[#2F7BE0]">✓</span> Automatiska CV-matchningar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[#2F7BE0]">✓</span> Klart på under 5 minuter
        </span>
      </div>
    </div>

    {/* RIGHT COLUMN — dashboard mockup */}
    <div className="relative">
      <div className="rounded-2xl bg-white shadow-2xl shadow-[#2F7BE0]/10 border border-[#E4F0FF] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4F0FF]">
          <span className="font-['Space_Grotesk'] text-lg font-bold text-[#12294D]">Jobbportal</span>
          <div className="flex-1 max-w-xs mx-6 flex items-center gap-2 bg-[#F4F8FE] rounded-lg px-3 py-2">
            <span className="text-[#9AAEC4] text-xs">🔍</span>
            <span className="text-xs text-[#9AAEC4]">Sök kandidat eller roll...</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#CFE6FF]" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-36 border-r border-[#E4F0FF] py-4 px-3 flex flex-col gap-1 text-sm">
            {[
              { label: "Dashboard", active: true },
              { label: "Arbetsgivare" },
              { label: "Jobbsökande" },
              { label: "CV & Ansökningar" },
              { label: "Avtal" },
              { label: "Mallar" },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-3 py-2 rounded-lg ${
                  item.active
                    ? "bg-[#E4F0FF] text-[#2F7BE0] font-semibold"
                    : "text-[#6B7E96]"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Table area */}
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2 bg-[#F4F8FE] rounded-lg px-3 py-2.5 mb-4">
              <span className="text-xs text-[#9AAEC4] flex-1">
                Frontend-utvecklare med 3+ års erfarenhet, Stockholm
              </span>
              <button className="px-4 py-1.5 bg-[#2F7BE0] text-white text-xs font-semibold rounded-md">
                Sök
              </button>
            </div>

            <div className="grid grid-cols-4 text-[11px] font-semibold text-[#9AAEC4] px-2 pb-2">
              <span>Kandidat</span>
              <span>Roll</span>
              <span>Ort</span>
              <span>Matchning</span>
            </div>

            {[
              { name: "Ella Nyström", role: "UX-designer", city: "Stockholm", pct: "94%", color: "#22A55A" },
              { name: "Amina Yusuf", role: "Frontend-utv.", city: "Stockholm", pct: "91%", color: "#22A55A" },
              { name: "Fatima Al-Sayed", role: "Sjuksköterska", city: "Malmö", pct: "87%", color: "#22A55A" },
              { name: "Daniel Berg", role: "Backend-utv.", city: "Linköping", pct: "76%", color: "#F5A623" },
              { name: "Erik Holm", role: "Lagerarbetare", city: "Uppsala", pct: "68%", color: "#F5A623" },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-4 items-center text-xs px-2 py-2.5 border-t border-[#F0F4FA]"
              >
                <span className="flex items-center gap-2 font-medium text-[#12294D]">
                  <span className="w-6 h-6 rounded-full bg-[#E4F0FF]" />
                  {row.name}
                </span>
                <span className="text-[#6B7E96]">{row.role}</span>
                <span className="text-[#6B7E96]">{row.city}</span>
                <span
                  className="text-white text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit"
                  style={{ backgroundColor: row.color }}
                >
                  {row.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating stat card */}
      <div className="absolute -left-6 -bottom-8 bg-white rounded-xl shadow-xl shadow-[#2F7BE0]/15 border border-[#E4F0FF] px-5 py-4 w-56">
        <div className="text-xs text-[#6B7E96] font-medium mb-1">Nya matchande ansökningar</div>
        <div className="flex items-end justify-between">
          <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#12294D]">1 248</span>
          <span className="text-xs font-semibold text-[#2F7BE0] bg-[#E4F0FF] px-2 py-1 rounded-full mb-1">↑ +24%</span>
        </div>
        <svg viewBox="0 0 200 50" className="w-full h-10 mt-2">
          <polyline
            points="0,40 20,38 40,30 60,32 80,24 100,26 120,18 140,20 160,10 180,8 200,4"
            fill="none"
            stroke="#2F7BE0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</section>
      {/* TRUSTED BY */}
      <section className="py-10 border-y border-[#E4F0FF] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs tracking-wide text-[#9AAEC4] mb-6">
            Företag som redan anställer via HirePath
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[#3F5875] font-['Space_Grotesk'] font-semibold text-lg opacity-70">
            <span>Northlight</span>
            <span>Ferrous</span>
            <span>Marrow</span>
            <span>Cascade</span>
            <span>Polarigo</span>
            <span>Ombra</span>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#0B2D5C] py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["12 400", "lediga tjänster"],
            ["3 900", "anställande företag"],
            ["68 000", "tillsatta kandidater"],
            ["4,8/5", "genomsnittligt betyg"],
          ].map(([n, label]) => (
            <div key={label}>
              <div className="font-['Space_Grotesk'] text-3xl font-bold text-white">{n}</div>
              <div className="text-sm text-[#8FB4E8] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C] text-center">
            Så funkar det
          </h2>
          <p className="text-[#7B93AF] text-center mt-3 max-w-lg mx-auto">
            Tre steg mellan dig och din nästa roll.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-[#DCE9FA]" />
            {[
              { step: "1", title: "Skapa din profil", text: "Lägg till din erfarenhet, dina kompetenser och vad du letar efter." },
              { step: "2", title: "Matchas med roller", text: "Vi visar tjänster som faktiskt passar din bakgrund, inte allt som finns." },
              { step: "3", title: "Sök med ett klick", text: "Ansök direkt genom plattformen och följ status i realtid." },
            ].map((s) => (
              <div key={s.step} className="relative bg-[#F4F9FF] text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-[#2E7BF6] text-white font-['Space_Grotesk'] font-bold flex items-center justify-center mx-auto md:mx-0 relative z-10">
                  {s.step}
                </div>
                <h3 className="mt-5 font-semibold text-lg text-[#0B2D5C]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#7B93AF] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="kategorier" className="py-24 px-6 bg-white border-y border-[#E4F0FF]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C]">
              Populära kategorier
            </h2>
            <a href="#" className="text-sm text-[#2E7BF6] hover:text-[#1f68dd] font-medium">
              Visa alla
            </a>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: "Utveckling", count: "3 240 tjänster", icon: "M4 6h16M4 12h10M4 18h16" },
              { name: "Design", count: "1 180 tjänster", icon: "M12 4l3 3-9 9-3 1 1-3 8-8-3-3z" },
              { name: "Data & analys", count: "960 tjänster", icon: "M4 19V9m6 10V4m6 15v-6" },
              { name: "Marknadsföring", count: "1 420 tjänster", icon: "M4 4l16 8-16 8V4z" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="group p-6 rounded-xl border border-[#E4F0FF] hover:border-[#2E7BF6] hover:shadow-md hover:shadow-[#BFDBFF]/50 transition-all cursor-pointer"
              >
                <svg
                  className="w-8 h-8 text-[#2E7BF6]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={cat.icon} />
                </svg>
                <h3 className="mt-4 font-semibold text-[#0B2D5C]">{cat.name}</h3>
                <p className="text-sm text-[#7B93AF] mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section id="jobb" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C]">
              Nytt denna vecka
            </h2>
            <a href="#" className="text-sm text-[#2E7BF6] hover:text-[#1f68dd] font-medium">
              Visa alla tjänster
            </a>
          </div>

          <div className="divide-y divide-[#E4F0FF]">
            {[
              { title: "Senior frontendutvecklare", company: "Northlight Labs", location: "Distans · Heltid", pay: "95 000–120 000 kr" },
              { title: "Produktdesigner", company: "Ferrous Studio", location: "Stockholm · Hybrid", pay: "60 000–80 000 kr" },
              { title: "Dataanalytiker", company: "Marrow Health", location: "Distans · Konsult", pay: "50 000–70 000 kr" },
              { title: "Backendutvecklare (Go)", company: "Cascade Systems", location: "Göteborg · På plats", pay: "70 000–95 000 kr" },
            ].map((job) => (
              <div
                key={job.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group cursor-pointer"
              >
                <div>
                  <h3 className="font-medium text-lg text-[#152238] group-hover:text-[#2E7BF6] transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[#7B93AF] mt-1">
                    {job.company} — {job.location}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-sm font-medium text-[#0B2D5C]">
                  {job.pay}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP COMPANIES */}
      <section id="foretag" className="py-24 px-6 bg-white border-y border-[#E4F0FF]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C] mb-12">
            Företag som anställer nu
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Northlight Labs", desc: "Produktutveckling för fintech.", roles: "12 lediga roller" },
              { name: "Ferrous Studio", desc: "Designbyrå för digitala produkter.", roles: "5 lediga roller" },
              { name: "Marrow Health", desc: "Hälsoteknik och patientdata.", roles: "8 lediga roller" },
            ].map((c) => (
              <div key={c.name} className="p-6 rounded-xl bg-[#F4F9FF] border border-[#E4F0FF]">
                <div className="w-10 h-10 rounded-lg bg-[#2E7BF6]/10 flex items-center justify-center font-['Space_Grotesk'] font-bold text-[#2E7BF6]">
                  {c.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold text-[#0B2D5C]">{c.name}</h3>
                <p className="text-sm text-[#7B93AF] mt-1">{c.desc}</p>
                <p className="text-sm text-[#2E7BF6] mt-4 font-medium">{c.roles}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="omdomen" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C] text-center mb-14">
            Vad kandidater säger
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Jag fick tre intervjuer på en vecka. Matchningarna var faktiskt relevanta.", name: "Elin Berg", role: "Frontendutvecklare" },
              { quote: "Sökprocessen kändes för första gången inte som ett heltidsjobb i sig.", name: "Marcus Holm", role: "Produktdesigner" },
              { quote: "Bytte bransch helt via en roll jag hittade här. Rekommenderar starkt.", name: "Sara Lindqvist", role: "Dataanalytiker" },
            ].map((t) => (
              <div key={t.name} className="p-7 rounded-xl border border-[#E4F0FF] bg-white">
                <p className="text-[#152238] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E4F0FF] flex items-center justify-center text-[#2E7BF6] font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0B2D5C]">{t.name}</div>
                    <div className="text-xs text-[#7B93AF]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B2D5C] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white">
            Din nästa roll är bara en sökning bort
          </h2>
          <p className="mt-4 text-[#BFDBFF]">
            Skapa en profil en gång. Låt rätt företag komma till dig.
          </p>
          <button className="mt-8 px-8 py-3.5 bg-[#2E7BF6] text-white font-medium rounded-md hover:bg-[#1f68dd] transition-colors">
            Skapa din profil
          </button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 px-6 bg-white border-t border-[#E4F0FF]">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#0B2D5C]">
            Få nya tjänster i din inkorg
          </h3>
          <p className="text-sm text-[#7B93AF] mt-2">
            En gång i veckan, inga extra utskick.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Din e-postadress"
              className="flex-1 px-4 py-3 rounded-lg outline-none text-sm border border-[#E4F0FF] text-[#152238] placeholder:text-[#9AAEC4]"
            />
            <button className="px-6 py-3 bg-[#2E7BF6] text-white text-sm font-medium rounded-lg hover:bg-[#1f68dd] transition-colors">
              Prenumerera
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B2D5C] py-14 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Hire<span className="text-[#5B9BFF]">Path</span>
            </span>
            <p className="text-sm text-[#8FB4E8] mt-3 max-w-xs">
              Vi kopplar samman skickliga människor med företag som letar efter dem.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">För kandidater</h4>
            <div className="flex flex-col gap-2 text-sm text-[#8FB4E8]">
              <a href="#" className="hover:text-white transition-colors">Sök jobb</a>
              <a href="#" className="hover:text-white transition-colors">Skapa profil</a>
              <a href="#" className="hover:text-white transition-colors">Karriärguider</a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">För företag</h4>
            <div className="flex flex-col gap-2 text-sm text-[#8FB4E8]">
              <a href="#" className="hover:text-white transition-colors">Annonsera jobb</a>
              <a href="#" className="hover:text-white transition-colors">Priser</a>
              <a href="#" className="hover:text-white transition-colors">Rekryteringshjälp</a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Företaget</h4>
            <div className="flex flex-col gap-2 text-sm text-[#8FB4E8]">
              <a href="#" className="hover:text-white transition-colors">Om oss</a>
              <a href="#" className="hover:text-white transition-colors">Integritet</a>
              <a href="#" className="hover:text-white transition-colors">Villkor</a>
              <a href="#" className="hover:text-white transition-colors">Kontakt</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10 text-sm text-[#6D93C4]">
          © 2026 HirePath. Alla rättigheter förbehållna.
        </div>
      </footer>
    </main>
  );
}