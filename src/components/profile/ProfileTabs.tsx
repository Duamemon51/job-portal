"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, PenSquare, Briefcase, Settings, Mail, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon; enabled: boolean }[] = [
  { href: "/app/profil", label: "Grundinformation", icon: User, enabled: true },
  { href: "/app/cv-och-dokument", label: "CV & dokument", icon: FileText, enabled: true },
  { href: "/app/personligt-brev", label: "Personligt brev", icon: PenSquare, enabled: false },
  { href: "/app/jobbpreferenser", label: "Jobbpreferenser", icon: Briefcase, enabled: false },
  { href: "/app/ansokningsinstallningar", label: "Ansökningsinställningar", icon: Settings, enabled: false },
  { href: "/app/epostintegration", label: "E-postintegration", icon: Mail, enabled: false },
];

export function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;

        if (!tab.enabled) {
          return (
            <button
              key={tab.href}
              type="button"
              disabled
              title="Kommer snart"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground/50"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                : "border border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
