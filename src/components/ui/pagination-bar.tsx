"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total]);
  for (let p = current - 1; p <= current + 1; p++) if (p > 1 && p < total) pages.add(p);
  if (current <= 3) [2, 3, 4, 5].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3, total - 4].forEach((p) => p > 1 && pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev: number | null = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  itemLabel,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemLabel: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur lg:left-[var(--app-sidebar-width,260px)]">
      <span className="text-xs text-muted-foreground">{itemLabel}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Föregående sida"
          className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-muted-foreground select-none">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-medium transition ${
                p === page ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Nästa sida"
          className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
