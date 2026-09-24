const plans = [
  {
    name: "Gratis",
    desc: "Kom igång och testa.",
    price: "0",
    features: ["Upp till 5 ansökningar/dag", "Grundläggande funktioner", "AI-genererade ansökningar", "E-postintegration"],
    cta: "Kom igång gratis",
  },
  {
    name: "Pro",
    desc: "För aktiv jobbsökning.",
    price: "199",
    popular: true,
    features: ["Obegränsade ansökningar", "Avancerade filter", "Prioriterad jobbsökning", "Statistik och uppföljning", "Full tillgång till alla funktioner"],
    cta: "Välj Pro",
  },
  {
    name: "Premium",
    desc: "För maximal kontroll.",
    price: "299",
    features: ["Allt i Pro", "Flera e-postkonton", "Anpassade mallar", "Prioriterad support", "Exportera ansökningar (PDF)"],
    cta: "Välj Premium",
  },
];

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22A35E" strokeWidth="2.6"
    strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
    <path d="m5 12 4 4 10-10" />
  </svg>
);

export default function Pricing() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-white to-[#F4F7FE] font-['Inter']">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B1220]">Priser som passar alla</h2>
          <p className="mt-4 text-lg text-[#5B6B82] max-w-3xl mx-auto leading-relaxed">
            Kom igång gratis och uppgradera när du vill. Alla planer inkluderar AI-genererade ansökningar och full tillgång till plattformen.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm shadow-[#4F5BE8]/5 ${
                p.popular ? "border border-[#4F5BE8]/60 md:-my-4 md:py-12" : "border border-[#EEF1FA]"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-lg bg-[#4F5BE8] px-5 py-1.5 text-sm font-semibold text-white">
                  Populärast
                </span>
              )}

              <h3 className="text-2xl font-bold text-[#0B1220]">{p.name}</h3>
              <p className="mt-1 text-base text-[#6B7A90]">{p.desc}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-6xl font-extrabold tracking-tight text-[#0B1220]">{p.price}</span>
                <span className="text-base font-medium text-[#12294D]">kr / månad</span>
              </div>

              <ul className="mt-7 mb-10 space-y-3.5 text-base text-[#5B6B82]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3"><Check />{f}</li>
                ))}
              </ul>

              <button
                className={`mt-auto w-full rounded-lg py-3.5 text-base font-semibold transition-colors ${
                  p.popular
                    ? "bg-[#4F5BE8] text-white shadow-md shadow-[#4F5BE8]/25 hover:bg-[#3F4AD0]"
                    : "bg-white text-[#4F5BE8] border border-[#4F5BE8]/50 hover:bg-[#F5F6FE]"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}