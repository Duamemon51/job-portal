const INK = "text-[#3A3E66]";

const Spotify = () => (
  <span className={`flex items-center gap-2 ${INK}`}>
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="17" fill="currentColor" />
      <g fill="none" stroke="#F1F5FE" strokeWidth="2.4" strokeLinecap="round">
        <path d="M8 12.5c6-1.8 12-1.4 18 1.4" />
        <path d="M9 17.5c5-1.4 10-1 15 1.2" />
        <path d="M10 22c4-1 8-.7 12 1" />
      </g>
    </svg>
    <span className="text-lg font-semibold tracking-tight">Spotify</span>
  </span>
);

const Ericsson = () => (
  <span className={`flex items-center gap-2 ${INK}`}>
    <svg width="22" height="34" viewBox="0 0 22 34" aria-hidden="true" fill="currentColor">
      <path d="M3 3l16 4v5L3 8V3Zm0 9l16 4v5L3 17v-5Zm0 9l16 4v5L3 26v-5Z" />
    </svg>
    <span className="text-sm font-extrabold tracking-tight">ERICSSON</span>
  </span>
);

const SEB = () => (
  <span className={`flex items-stretch gap-1.5 text-3xl font-black leading-none ${INK}`}>
    <span>S</span>
    <span className="w-px bg-current opacity-60" />
    <span>E</span>
    <span className="w-px bg-current opacity-60" />
    <span>B</span>
  </span>
);

export default function LogoStrip() {
  return (
    <section className="px-6 py-10 bg-gradient-to-b from-[#EEF1FD] to-[#F4F7FE] font-['Inter']">
      <div className="max-w-[1800px] mx-auto text-center">
        <p className="text-[11px] font-semibold tracking-wider text-[#6B7A99]">
          JOBBAUTO ANVÄNDS AV JOBBSÖKARE ÖVER HELA SVERIGE
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          <Spotify />
          <span className={`text-2xl font-extrabold tracking-tight ${INK}`}>Klarna.</span>
          <span className={`text-2xl font-bold tracking-tighter ${INK}`}>northvolt</span>
          <span className={`text-3xl font-black italic tracking-tighter ${INK}`}>ICA</span>
          <Ericsson />
          <SEB />
        </div>
      </div>
    </section>
  );
}