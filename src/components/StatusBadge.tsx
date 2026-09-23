import { Badge } from "@/components/ui/badge";
import type { EmployerStatus, JobSeekerStatus } from "@/lib/types";

const CONFIG: Record<EmployerStatus | JobSeekerStatus, { label: string; variant: "success" | "warning" | "muted" }> = {
  active: { label: "Aktiv", variant: "success" },
  pending: { label: "Väntande", variant: "warning" },
  inactive: { label: "Inaktiv", variant: "muted" },
  hired: { label: "Anställd", variant: "success" },
};

export function StatusBadge({ status }: { status: EmployerStatus | JobSeekerStatus }) {
  const { label, variant } = CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
