import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { ReportCharts } from "@/components/report-charts";
import { PageHeader } from "@/components/ui/page-header";

export default async function ReportsPage() {
  const { denied } = await requireAction("viewReports");
  if (denied)
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
        Sem permissão para ver relatórios.
      </p>
    );

  const api = await serverApi();
  const [damages, pending, avgTime] = await Promise.all([
    api.reports.damagesByVehicle(),
    api.reports.pendingByInspector(),
    api.reports.avgInspectionTime(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Indicadores de avarias, pendências e tempo médio de vistoria."
      />
      <ReportCharts damages={damages} pending={pending} avgTime={avgTime} />
    </div>
  );
}
