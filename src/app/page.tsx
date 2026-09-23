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
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#DCE9FA]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="font-['Space_Grotesk'] text-xl font-bold text-[#0B2D5C] tracking-tight">
            Hire<span className="text-[#2E7BF6]">Path</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#3F5875]">
            <a href="#jobb" className="hover:text-[#0B2D5C] transition-colors">Hitta jobb</a>
            <a href="#kategorier" className="hover:text-[#0B2D5C] transition-colors">Kategorier</a>
            <a href="#foretag" className="hover:text-[#0B2D5C] transition-colors">Företag</a>
            <a href="#omdomen" className="hover:text-[#0B2D5C] transition-colors">Omdömen</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-[#3F5875] hover:text-[#0B2D5C] transition-colors">
              Logga in
            </button>
            <button className="text-sm px-4 py-2 rounded-md bg-[#2E7BF6] text-white font-medium hover:bg-[#1f68dd] transition-colors">
              Annonsera jobb
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#CFE6FF] rounded-full blur-3xl opacity-60" />
        <div className="absolute top-40 right-0 w-[28rem] h-[28rem] bg-[#E4F0FF] rounded-full blur-3xl opacity-70" />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span
              className="fade-up inline-block text-sm font-medium text-[#2E7BF6] bg-[#E4F0FF] px-3 py-1 rounded-full"
              style={{ animationDelay: "0.05s" }}
            >
              12 400 lediga tjänster just nu
            </span>
            <h1
              className="fade-up font-['Space_Grotesk'] text-5xl md:text-6xl font-bold text-[#0B2D5C] leading-[1.08] tracking-tight mt-5"
              style={{ animationDelay: "0.15s" }}
            >
              Hitta jobbet som hittar tillbaka till dig
            </h1>
            <p
              className="fade-up mt-6 text-lg text-[#4A6280] max-w-md leading-relaxed"
              style={{ animationDelay: "0.25s" }}
            >
              Berätta vad du är bra på, så berättar vi vilka som anställer.
              Inget brus, bara tjänsterna som passar dig.
            </p>

            <div
              className="fade-up mt-9 bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-lg shadow-lg shadow-[#BFDBFF]/60 border border-[#E4F0FF]"
              style={{ animationDelay: "0.35s" }}
            >
              <input
                type="text"
                placeholder="Jobbtitel eller kompetens"
                className="flex-1 px-4 py-3 rounded-lg outline-none text-sm text-[#152238] placeholder:text-[#9AAEC4]"
              />
              <button className="px-6 py-3 bg-[#2E7BF6] text-white text-sm font-medium rounded-lg hover:bg-[#1f68dd] transition-colors">
                Sök
              </button>
            </div>
            <p
              className="fade-up mt-4 text-sm text-[#7B93AF]"
              style={{ animationDelay: "0.45s" }}
            >
              Frontendutvecklare · Produktdesigner · Dataanalytiker · Distans
            </p>
          </div>

          <div className="fade-up relative" style={{ animationDelay: "0.3s" }}>
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-[#BFDBFF]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                alt="Team som samarbetar på en modern arbetsplats"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-8 top-10 bg-white rounded-xl shadow-lg shadow-[#BFDBFF]/70 px-4 py-3 flex items-center gap-3 border border-[#E4F0FF]">
              <div className="w-9 h-9 rounded-full bg-[#E4F0FF] flex items-center justify-center text-[#2E7BF6] font-bold text-sm">
                ✓
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B2D5C]">Erbjudande accepterat</div>
                <div className="text-xs text-[#7B93AF]">Tjänst som produktdesigner</div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-10 bg-white rounded-xl shadow-lg shadow-[#BFDBFF]/70 px-5 py-4 border border-[#E4F0FF]">
              <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#0B2D5C]">
                68 000+
              </div>
              <div className="text-xs text-[#7B93AF] mt-0.5">tillsatta kandidater</div>
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