"use client";

type JobPin = {
  id: string;
  title: string;
  company: string;
  location: string;
  pos: [number, number];
};

export default function JobsMap({ pins }: { pins: JobPin[] }) {
  const location = pins[0]?.location ?? "Sweden";
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className="relative isolate h-[640px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <iframe
        title={`Jobbkarta för ${location}`}
        src={mapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
        {pins.length} {pins.length === 1 ? "ledig tjänst" : "lediga tjänster"}
      </div>
    </div>
  );
}
