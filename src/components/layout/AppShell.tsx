"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
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
