"use client";

type JobMapProps = {
  cities: string[];
  radiusMil: number;
  mode: "ort" | "distans" | "avstand";
  nationwide: boolean;
};

export default function JobMap({ cities, nationwide }: JobMapProps) {
  const location = nationwide || cities.length === 0 ? "Sweden" : cities[0];
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className="relative isolate h-[280px] overflow-hidden rounded-xl border border-slate-200 lg:h-auto lg:min-h-[260px]">
      <iframe
        title={`Karta över ${location}`}
        src={mapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
