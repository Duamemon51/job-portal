"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  FileCheck,
  User,
  Folder,
  SlidersHorizontal,
  Settings,
  Mail,
  FileText,
  BarChart3,
  Bell,
  Crown,
  HelpCircle,
  LogOut,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

/**
 * Theme (from the reference screenshot)
 * - Sidebar bg:      #192436
 * - Active item:     #6366f1 pill, white text
 * - Inactive text:   white, hover -> white + white/5 bg
 * - Dividers:        slate-600 (dark grey)
 */

type NavLink = {
  href: string;
  label: string;
  icon: typeof Home;
  badgeKey?: "notifications";
};

// TODO: adjust hrefs to your real routes.
const MAIN_LINKS: NavLink[] = [
  { href: "/app/oversikt", label: "Översikt", icon: Home },
  { href: "/app/lediga-tjanster", label: "Lediga tjänster", icon: Search },
  { href: "/app/mina-ansokta-jobb", label: "Mina ansökta jobb", icon: FileCheck },
  { href: "/app/profil", label: "Profil", icon: User },
  { href: "/app/cv-och-dokument", label: "CV och dokument", icon: Folder },
  { href: "/app/jobbpreferenser", label: "Jobbpreferenser", icon: SlidersHorizontal },
  { href: "/app/ansokningsinstallningar", label: "Ansökningsinställningar", icon: Settings },
  { href: "/app/epostintegration", label: "E-postintegration", icon: Mail },
  { href: "/app/mallar", label: "Mallar", icon: FileText },
  { href: "/app/aktivitet", label: "Aktivitet & statistik", icon: BarChart3 },
  { href: "/app/notiser", label: "Notiser", icon: Bell, badgeKey: "notifications" },
];

const SECONDARY_LINKS: NavLink[] = [
  { href: "/app/prenumeration", label: "Prenumeration", icon: Crown },
];

const HELP_HREF = "/app/hjalp";

function rowClass(active: boolean, collapsed: boolean) {
  return cn(
    "relative flex items-center rounded-lg text-[13px] font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/60",
    collapsed ? "mx-auto h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
    active ? "bg-[#6366f1] text-white" : "text-white hover:bg-white/5"
  );
}

function NavItem({
  href,
  label,
  icon,
  collapsed,
  active,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  const showBadge = !!badge && badge > 0;
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={rowClass(active, collapsed)}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {showBadge &&
        (collapsed ? (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#192436]" />
        ) : (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
            {badge}
          </span>
        ))}
    </Link>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Send className="h-6 w-6 shrink-0 fill-[#818cf8] text-[#818cf8]" strokeWidth={1.5} />
      {!collapsed && <div className="text-[17px] font-bold tracking-tight text-white">JobbAuto</div>}
    </div>
  );
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
  notificationCount = 0,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
  /** Unread notifications, shown as the red badge on "Notiser". */
  notificationCount?: number;
  collapsed?: boolean;
  onCollapsedChange?: (nextCollapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const iconSize = "h-[18px] w-[18px]";
  const collapsed = controlledCollapsed ?? internalCollapsed;

  const setCollapsed = (next: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(next);
      return;
    }
    setInternalCollapsed(next);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const renderLink = (item: NavLink) => (
    <NavItem
      key={item.href}
      href={item.href}
      label={item.label}
      icon={<item.icon className={iconSize} />}
      collapsed={collapsed}
      active={isActive(item.href)}
      badge={item.badgeKey === "notifications" ? notificationCount : undefined}
      onNavigate={onMobileClose}
    />
  );

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r !border-slate-600 bg-[#192436] transition-all duration-300 lg:fixed lg:left-0 lg:top-0 lg:z-30",
        collapsed ? "w-[68px]" : "w-[250px]"
      )}
    >
      {/* Brand + collapse toggle */}
      <div className={cn("flex items-center justify-between px-4 py-5", collapsed && "flex-col gap-3 px-2")}>
        <Brand collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/60"
          title={collapsed ? "Expandera menyn" : "Minimera menyn"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          collapsed ? "px-2" : "px-3"
        )}
      >
        <div className="space-y-1">{MAIN_LINKS.map(renderLink)}</div>

        <div className="my-3 border-t !border-slate-600" />

        <div className="space-y-1">{SECONDARY_LINKS.map(renderLink)}</div>
      </nav>

      {/* Bottom: Hjälp + Logga ut */}
      <div className={cn("space-y-1  py-3", collapsed ? "px-2" : "px-3")}>
        <NavItem
          href={HELP_HREF}
          label="Hjälp"
          icon={<HelpCircle className={iconSize} />}
          collapsed={collapsed}
          active={isActive(HELP_HREF)}
          onNavigate={onMobileClose}
        />

        <button
          type="button"
          onClick={async () => {
            setLoggingOut(true);
            await logout();
            router.push("/login");
          }}
          disabled={loggingOut}
          title="Logga ut"
          className={cn(
            rowClass(false, collapsed),
            "w-full cursor-pointer hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          <LogOut className={cn(iconSize, "shrink-0")} />
          {!collapsed && <span>{loggingOut ? "Loggar ut…" : "Logga ut"}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{sidebarContent}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} aria-hidden="true" />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}