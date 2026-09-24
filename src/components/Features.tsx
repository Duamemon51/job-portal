/* Free Unsplash photo (woman with laptop). Swap the ID to change it, e.g.
   photo-1524508762098-fd966ffb6ef9, photo-1441015401724-70d16b783f5c, photo-1503945438517-f65904a52ce6 */
const PHOTO = "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80";

const Icon = ({ d, size = 30 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const P = {
  plane: "M21 3 3 10.5l7 3 3 7L21 3ZM10 13.5 21 3",
  camera: "M4 8h3l2-2h6l2 2h3v11H4V8Zm8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  mail: "M4 5h16v14H4V5Zm0 0 8 8 8-8",
  chat: "M5 4h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6l-4 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM10 8v5l4-2.5L10 8Z",
  calendar: "M4 6h16v14H4V6Zm0 5h16M8 3v4m8-4v4",
  check: "m5 12 4 4 10-10",
};

const features = [
  { t: "Automatisk jobbsökning", x: "Vi hittar relevanta jobb baserat på dina preferenser och skickar ansökningar åt dig.", d: P.plane, c: "bg-gradient-to-br from-[#F6EDFF] to-[#EEE3FF] text-[#A24CF0]" },
  { t: "Personliga ansökningar med AI", x: "Unika och relevanta ansökningar som matchar varje tjänst.", d: P.camera, c: "bg-gradient-to-br from-[#EAF4FF] to-[#E0EEFF] text-[#2F8CE8]" },
  { t: "E-postintegration", x: "Koppla Gmail, Outlook eller annan e-post för att skicka ansökningar via ditt eget konto.", d: P.mail, c: "bg-gradient-to-br from-[#E6F8EE] to-[#DBF3E6] text-[#22A35E]" },
  { t: "Full kontroll", x: "Se alla ansökta jobb, status, svar och intervjuer på ett ställe.", d: P.chat, c: "bg-gradient-to-br from-[#FFF1E6] to-[#FFE8D6] text-[#F07A1A]" },
];

const sends = [
  { co: "Spotify", lead: "bg-[#3B82F6]", end: "check" },
  { co: "Klarna", lead: "bg-[#22A35E]", end: "check" },
  { co: "Northvolt", lead: "bg-[#3B82F6]", end: "spin" },
  { co: "ICA", lead: "bg-[#3B82F6]", end: "empty" },
];

const End = ({ k }: { k: string }) =>
  k === "check" ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22A35E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={P.check} /></svg>
  ) : k === "spin" ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" opacity=".25" /><path d="M12 3a9 9 0 0 1 9 9" /></svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C3CCDA" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>
  );

const Stat = ({ d, n, l, color, className }: { d: string; n: string; l: string; color: string; className: string }) => (
  <div className={`absolute bg-white rounded-2xl shadow-xl shadow-[#4F5BE8]/10 px-6 py-4 ${className}`}>
    <div className="flex items-center gap-4">
      <span className={color}><Icon d={d} size={30} /></span>
      <span className="text-3xl font-bold text-[#0B1220]">{n}</span>
    </div>
    <div className="mt-1 text-sm text-[#6B7A99]">{l}</div>
  </div>
);

export default function Features() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 bg-white font-['Inter']">
      <div className="max-w-[1400px] mx-auto grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 items-center">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight text-[#0B1220]">
            Allt du behöver<br />för en effektiv jobbsökning
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#5B6B82] max-w-xl leading-relaxed">
            JobbAuto samlar alla verktyg i en plattform – från sökning till uppföljning. Enkelt, smidigt och helt automatiskt.
          </p>

          <div className="mt-10 space-y-7">
            {features.map((f) => (
              <div key={f.t} className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                <span className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${f.c}`}>
                  <Icon d={f.d} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#0B1220]">{f.t}</h3>
                  <p className="mt-1 text-base text-[#6B7A90] max-w-md leading-relaxed">{f.x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative lg:ml-10">
          <div
            className="rounded-3xl min-h-[360px] sm:min-h-[460px] lg:min-h-[680px] bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url(${PHOTO}), linear-gradient(135deg,#E9EEF8,#D3DDF0)` }}
          />

          <Stat d={P.calendar} n="12" l="Intervjuer" color="text-[#3B82F6]" className="top-8 left-8" />
          <Stat d={P.plane} n="48" l="Ansökningar" color="text-[#4F5BE8]" className="top-[30%] -left-12 hidden sm:block" />

          <div className="absolute bottom-8 right-6 w-[340px] max-w-[85%] bg-white rounded-2xl shadow-xl shadow-[#4F5BE8]/10 p-5 space-y-3.5">
            {sends.map((s) => (
              <div key={s.co} className="flex items-center gap-3 text-sm text-[#12294D]">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${s.lead}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d={P.check} /></svg>
                </span>
                <span className="flex-1">Skickar ansökan till {s.co}...</span>
                <End k={s.end} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}