const people = [
  {
    quote: "Jag fick betydligt fler svar och bokade tre intervjuer första veckan. Superenkelt att komma igång!",
    name: "Sara N.",
    role: "Marknadskoordinator",
    initials: "SN",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "JobbAuto har gjort min jobbsökning mycket mer effektiv. Jag sparar flera timmar i veckan.",
    name: "Ali H.",
    role: "Systemutvecklare",
    initials: "AH",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Smidigt, professionellt och enkelt att använda. Rekommenderar starkt!",
    name: "Emma L.",
    role: "Projektledare",
    initials: "EL",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-[#F4F7FE] to-[#EEF2FD] font-['Inter']">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B1220]">Vad våra användare säger</h2>
          <p className="mt-4 text-lg text-[#5B6B82]">
            Tusentals jobbsökare har redan sparat tid och fått fler intervjuer med JobbAuto.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {people.map((p) => (
            <figure
              key={p.name}
              className="flex flex-col sm:flex-row items-center sm:items-center gap-6 rounded-2xl bg-white p-8 shadow-sm shadow-[#4F5BE8]/5 border border-[#EEF1FA]"
            >
              {/* Avatar: initials show if the photo fails to load */}
              <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-[#DDE4FB] to-[#C7D2F8] flex items-center justify-center text-xl font-bold text-[#4F5BE8]">
                {p.initials}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.photo})` }}
                  role="img"
                  aria-label={p.name}
                />
              </div>

              <div className="text-center sm:text-left">
                <blockquote className="text-base leading-relaxed text-[#4A5A73]">“{p.quote}”</blockquote>
                <figcaption className="mt-4">
                  <div className="text-lg font-bold text-[#0B1220]">{p.name}</div>
                  <div className="text-sm text-[#6B7A90]">{p.role}</div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}