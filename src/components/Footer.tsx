import Link from "next/link";

const columns = [
  { title: "Produkt", links: ["Funktioner", "Priser", "Integritetspolicy", "Användarvillkor"] },
  { title: "Support", links: ["Hjälpcenter", "Kontakta oss", "Vanliga frågor", "Status"] },
  { title: "Företaget", links: ["Om oss", "Blogg", "Karriär", "Press"] },
];

const INK = "text-[#2B2F55]";

const socials = [
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="currentColor" />
        <text x="12" y="17.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">in</text>
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="currentColor" />
        <g fill="none" stroke="#fff" strokeWidth="1.8">
          <rect x="5" y="5" width="14" height="14" rx="4" />
          <circle cx="12" cy="12" r="3.3" />
        </g>
        <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 34 24" width="34" height="28" aria-hidden="true">
        <rect width="34" height="24" rx="6" fill="currentColor" />
        <path d="M14 7.5v9l8-4.5-8-4.5Z" fill="#fff" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="px-6 pt-16 pb-8 bg-white font-['Inter']">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="jaLogoGrad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#3B9CF0" />
                    <stop offset="1" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                <path d="M21.5 2.5 2.5 10l7.5 3 3 7.5 8.5-18Z" fill="url(#jaLogoGrad)" />
                <path d="M10 13 21.5 2.5" stroke="#fff" strokeWidth="1" opacity=".5" />
              </svg>
              <span className="text-2xl font-bold tracking-tight text-[#0B1220]">JobbAuto</span>
            </Link>
            <p className="mt-5 max-w-xs text-lg leading-relaxed text-[#5B6B82]">
              Automatiska jobbansökningar för din karriär.
            </p>
            <div className={`mt-6 flex items-center gap-5 ${INK}`}>
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="hover:opacity-80 transition-opacity">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-lg font-bold text-[#0B1220]">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-base text-[#5B6B82] hover:text-[#12294D] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#EEF1FA] pt-8">
          <p className="text-base text-[#5B6B82]">
            © {new Date().getFullYear()} JobbAuto. Alla rättigheter förbehållna.
          </p>
          <button className="flex items-center gap-3 text-base text-[#5B6B82] hover:text-[#12294D] transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
            </svg>
            Svenska
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}