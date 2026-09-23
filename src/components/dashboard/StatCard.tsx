import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="text-2xl font-semibold leading-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}
