import { redirect } from "next/navigation";
import { serverApi, getServerSession } from "@/lib/api-server";
import { can } from "@/lib/rbac";
import { ReportCharts } from "@/components/report-charts";

export default async function ReportsPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!can(session.role, "viewReports")) {
    return <p className="text-muted-foreground">Sem permissão para ver relatórios.</p>;
  }

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
