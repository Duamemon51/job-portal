const left = [
  {
    q: "Hur fungerar JobbAuto?",
    a: "Du skapar din profil och väljer dina jobbpreferenser. Sedan skriver och skickar JobbAuto personliga ansökningar åt dig via din e-post.",
  },
  {
    q: "Är det säkert att koppla min e-post?",
    a: "Ja. Anslutningen sker via en säker inloggning hos din e-postleverantör, och du kan när som helst koppla bort ditt konto.",
  },
  {
    q: "Vilka jobbtyper söker ni på?",
    a: "Vi söker inom många branscher och roller. Du väljer själv vilka jobbtyper, orter och branscher som passar dig.",
  },
];

const right = [
  {
    q: "Kan jag redigera ansökningarna?",
    a: "Ja. Du kan granska och redigera varje ansökan innan den skickas, eller låta JobbAuto skicka automatiskt.",
  },
  {
    q: "Vilka typer av jobb kan jag söka?",
    a: "Du väljer roller, orter, branscher och anställningsform, till exempel heltid, deltid eller vikariat.",
  },
  {
    q: "Kan jag avsluta när som helst?",
    a: "Ja. Det finns ingen bindningstid, så du kan avsluta din prenumeration när du vill.",
  },
];

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0 text-[#12294D] transition-transform group-open:rotate-180" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Item = ({ q, a }: { q: string; a: string }) => (
  <details className="group rounded-xl bg-white border border-[#EEF1FA] shadow-sm shadow-[#4F5BE8]/5">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-6 text-lg font-semibold text-[#0B1220] [&::-webkit-details-marker]:hidden">
      {q}
      <Chevron />
    </summary>
    <p className="px-7 pb-6 -mt-1 text-base leading-relaxed text-[#5B6B82]">{a}</p>
  </details>
);

export default function Faq() {
  return (
    <section id="faq" className="px-6 py-24 bg-gradient-to-b from-[#EEF2FD] to-white font-['Inter']">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B1220]">Vanliga frågor</h2>
            <p className="mt-3 text-lg text-[#5B6B82]">Här hittar du svar på de vanligaste frågorna om JobbAuto.</p>
          </div>
          <button className="rounded-lg border border-[#4F5BE8]/60 bg-white px-7 py-3 text-base font-semibold text-[#4F5BE8] hover:bg-[#F5F6FE] transition-colors">
            Se alla frågor
          </button>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-x-6 gap-y-4 items-start">
          <div className="space-y-4">{left.map((i) => <Item key={i.q} {...i} />)}</div>
          <div className="space-y-4">{right.map((i) => <Item key={i.q} {...i} />)}</div>
        </div>
      </div>
    </section>
  );
}