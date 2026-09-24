const steps = [
  {
    title: "1. Skapa din profil",
    text: "Ladda upp CV, skriv personligt brev och välj dina preferenser.",
    d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h6",
  },
  {
    title: "2. Välj jobbpreferenser",
    text: "Välj roller, orter, branscher och hur många jobb du vill söka varje dag.",
    d: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-3.5-3.5",
  },
  {
    title: "3. Vi skickar ansökningar",
    text: "JobbAuto skriver och skickar personliga ansökningar automatiskt via din e-post.",
    d: "M21 3 3 10.5l7 3 3 7L21 3ZM10 13.5 21 3",
  },
  {
    title: "4. Få fler intervjuer",
    text: "Följ dina ansökningar, se svar och förbered dig för intervjuer.",
    d: "M4 6h16v14H4V6Zm0 5h16M8 3v4m8-4v4",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-20 bg-gradient-to-b from-[#F4F7FE] to-white font-['Inter']">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight text-[#0B1220]">Så fungerar det</h2>
          <p className="mt-4 text-xl text-[#5B6B82]">Från profil till fler intervjuer – på några minuter.</p>
        </div>

        <div className="mt-16 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="contents">
              <div className="flex-1 max-w-[380px] text-center">
                <div className="mx-auto w-[92px] h-[92px] rounded-full bg-[#EEF2FE] flex items-center justify-center text-[#4F5BE8]">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </div>
                <h3 className="mt-7 text-xl font-bold text-[#0B1220]">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#6B7A90]">{s.text}</p>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden className="hidden md:block mt-[36px] text-2xl font-bold text-[#12294D]">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}