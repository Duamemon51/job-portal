import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  desc,
  icon: Icon,
  iconBg,
  iconColor,
  children,
}: {
  title: string;
  desc?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        {Icon && (
          <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconBg, iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function Field({
  label,
  hint,
  span2,
  children,
}: {
  label: string;
  hint?: string;
  span2?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", span2 && "md:col-span-2")}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function ReadOnlyField({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex h-10 items-center rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
        {value || "—"}
      </div>
    </Field>
  );
}
