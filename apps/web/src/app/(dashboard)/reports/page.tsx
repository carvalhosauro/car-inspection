import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { ReportCharts } from "@/components/report-charts";

export default async function ReportsPage() {
  const { denied } = await requireAction("viewReports");
  if (denied) return <p className="text-muted-foreground">Sem permissão para ver relatórios.</p>;

  const api = await serverApi();
  const [damages, pending, avgTime] = await Promise.all([
    api.reports.damagesByVehicle(),
    api.reports.pendingByInspector(),
    api.reports.avgInspectionTime(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <ReportCharts damages={damages} pending={pending} avgTime={avgTime} />
    </div>
  );
}
