"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl border border-border p-2 hover:bg-muted transition"
          aria-label="Öppna meny"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Jobbportal</span>
      </header>

      <div className="flex">
        {/* Sidebar reads the ?category= query param (to highlight the active document
            category), which Next.js requires a Suspense boundary around for static builds. */}
        <Suspense fallback={<div className="hidden lg:block w-[260px] shrink-0" style={{ background: "var(--sidebar-gradient)" }} />}>
          <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        </Suspense>

        {/* min-w-0 lets this column shrink below its widest descendant, so a wide table
            scrolls internally instead of dragging the whole page sideways. */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
