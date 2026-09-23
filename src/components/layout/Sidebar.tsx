"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  FileSignature,
  Mail,
  IdCard,
  LayoutTemplate,
  LogOut,
  UserRound,
  Settings,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/mock-data";
import type { DocumentCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/arbetsgivare", label: "Arbetsgivare", icon: Building2 },
  { href: "/app/jobbsokande", label: "Jobbsökande", icon: Users },
];

const DOCUMENT_CATEGORIES = Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, string][];

const DOCUMENT_CATEGORY_ICONS: Record<DocumentCategory, typeof FileText> = {
  resumes: FileText,
  contracts: FileSignature,
  offer_letters: Mail,
  id_verification: IdCard,
  templates: LayoutTemplate,
};

function NavItem({
  href,
  label,
  icon,
  collapsed,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        collapsed ? "justify-center px-2" : "",
        active
          ? "bg-white/20 text-white shadow-lg shadow-black/20 backdrop-blur-sm border border-white/25"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}>{icon}</span>
      {!collapsed && <span className="font-medium tracking-wide">{label}</span>}
    </Link>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/20 text-sm font-bold text-white shadow-md">
        JP
      </div>
      {!collapsed && <div className="text-sm font-bold leading-tight text-white">Jobbportal</div>}
    </div>
  );
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [docsOpen, setDocsOpen] = useState(true);
  const iconSize = collapsed ? "h-5 w-5" : "h-4 w-4";

  const onDocuments = pathname === "/app/dokument";
  const activeCategory = searchParams.get("category");

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full flex-col transition-all duration-300 relative overflow-hidden shrink-0",
        collapsed ? "w-[64px]" : "w-[260px]"
      )}
      style={{ background: "var(--sidebar-gradient)" }}
    >
      {/* Background shades / depth layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 10% 20%, rgba(255,255,255,0.10) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 90% 80%, rgba(0,0,0,0.08) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid texture — the small squares visible across the whole sidebar background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px), " +
            "repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px)",
        }}
      />

      {/* Brand + collapse toggle */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-between px-4 py-4",
          collapsed && "flex-col gap-2 px-2 py-3"
        )}
        style={{ background: "rgba(0,0,0,0.08)" }}
      >
        <Brand collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
          title={collapsed ? "Expandera menyn" : "Minimera menyn"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation — same set of tabs for every role; only actions inside each tab change. */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-3 py-2"
        style={{ background: "rgba(0,0,0,0.08)" }}
      >

        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon className={iconSize} />}
              collapsed={collapsed}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              onNavigate={onMobileClose}
            />
          ))}

          {/* Dokument: a non-clickable heading; the +/− toggle expands or
              collapses the five sub-categories below it. */}
          {!collapsed && (
            <div className="flex items-center justify-between px-3 pt-3 pb-1 select-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Dokument
              </span>
              <button
                type="button"
                onClick={() => setDocsOpen((v) => !v)}
                aria-label={docsOpen ? "Dölj dokumentkategorier" : "Visa dokumentkategorier"}
                aria-expanded={docsOpen}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white/50 transition-all duration-200 hover:text-white focus:outline-none"
              >
                {docsOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}

          {!collapsed && docsOpen && (
            <div className="ml-5 space-y-0.5 border-l border-white/15 pl-3">
              {DOCUMENT_CATEGORIES.map(([key, label]) => {
                const Icon = DOCUMENT_CATEGORY_ICONS[key];
                const active = onDocuments && activeCategory === key;
                return (
                  <Link
                    key={key}
                    href={`/app/dokument?category=${key}`}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-all duration-200",
                      active
                        ? "text-white font-semibold"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="tracking-wide">{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: signed-in user email, quick actions, logout */}
      <div className={cn("relative z-10 px-4 py-4 space-y-3", collapsed && "px-2")} style={{ background: "rgba(0,0,0,0.08)" }}>
        {!collapsed && (
          <div className="truncate text-sm font-medium text-white">{user.email}</div>
        )}

        <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
          {!collapsed && (
            <>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/85 transition-all duration-200 hover:bg-white/20 hover:text-white"
                title="Inställningar"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/85 transition-all duration-200 hover:bg-white/20 hover:text-white"
                title="Profil"
              >
                <UserRound className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/25 hover:text-red-100",
              collapsed ? "h-8 w-8 justify-center" : "flex-1 px-4 py-2"
            )}
            title="Logga ut"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logga ut"}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">{sidebarContent}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onMobileClose} aria-hidden="true" />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-full lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
