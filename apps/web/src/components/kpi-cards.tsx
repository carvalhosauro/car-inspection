import { ClipboardList, Clock, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";
import type { ReportsSummary } from "@/lib/web-api";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Kpi {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass: string;
}

export function KpiCards({ summary }: { summary: ReportsSummary }) {
  const cards: Kpi[] = [
    { label: "Vistorias", value: summary.inspections, icon: ClipboardList, iconClass: "bg-accent text-accent-foreground" },
    { label: "Pendentes", value: summary.pending, icon: Clock, iconClass: "bg-amber-50 text-amber-600" },
    { label: "Aprovadas", value: summary.approved, icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-600" },
    { label: "Reprovadas", value: summary.rejected, icon: XCircle, iconClass: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{c.value}</p>
              </div>
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", c.iconClass)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
