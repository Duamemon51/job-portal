"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";

function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // The proxy already blocks unauthenticated requests to /app/*, but the session
  // can still expire client-side between navigations — bounce to /login if so.
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Gate on `user` too, not just `loading`: this keeps every page under /app from
  // ever rendering with a null user, since `children` is a page component that
  // reads useCurrentUser() and assumes it's non-null.
  if (loading || !user) {
    return <FullPageLoader />;
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar reads the ?category= query param (to highlight the active document
            category), which Next.js requires a Suspense boundary around for static builds. */}
        <Suspense fallback={<div className="hidden lg:block w-[260px] shrink-0" style={{ background: "var(--sidebar-gradient)" }} />}>
          <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        </Suspense>

        {/* min-w-0 lets this column shrink below its widest descendant, so a wide table
            scrolls internally instead of dragging the whole page sideways. */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="shrink-0 rounded-lg border border-border p-2 text-foreground transition hover:bg-muted lg:hidden"
                aria-label="Öppna meny"
              >
                <Menu className="h-5 w-5" />
              </button>

              <label className="relative hidden w-full max-w-[500px] sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Sök lediga tjänster, företag eller branscher..."
                  aria-label="Sök lediga tjänster, företag eller branscher"
                  className="h-11 w-full rounded-xl border-0 bg-muted pl-10 pr-4 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-5">
              <button
                type="button"
                className="relative rounded-lg p-2 text-foreground transition hover:bg-muted"
                aria-label="Notiser"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-card" />
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-muted"
                aria-label="Öppna användarmeny"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {initials}
                </span>
                <span className="hidden text-sm font-semibold text-foreground md:block">{user.name}</span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
              </button>
            </div>
          </header>

          <main className="min-w-0 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
