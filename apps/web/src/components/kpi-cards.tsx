import { StatCard } from "@vistoria/ui/molecules/StatCard";
import type { ReportsSummary } from "@/lib/web-api";

export function KpiCards({ summary }: { summary: ReportsSummary }) {
  const cards = [
    { label: "Vistorias", value: String(summary.inspections) },
    { label: "Pendentes", value: String(summary.pending) },
    { label: "Aprovadas", value: String(summary.approved) },
    { label: "Reprovadas", value: String(summary.rejected) },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <StatCard key={c.label} value={c.value} label={c.label} />
      ))}
    </div>
  );
}
