import { serverApi, getServerSession } from "@/lib/api-server";
import { KpiCards } from "@/components/kpi-cards";
import { ReportCharts } from "@/components/report-charts";
import { PageHeader } from "@/components/ui/page-header";

export default async function DashboardPage() {
  const session = await getServerSession();

  // Superadmin is cross-tenant and isn't bound to a locadora, so the
  // tenant-scoped indicators below don't apply (and would 400 server-side).
  if (!session?.tenantId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Visão geral das vistorias." />
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Sua conta de superadmin não está vinculada a uma locadora. Os indicadores são exibidos por locadora.
        </div>
      </div>
    );
  }

  const api = await serverApi();
  const [summary, damages, pending, avgTime] = await Promise.all([
    api.reports.summary(),
    api.reports.damagesByVehicle(),
    api.reports.pendingByInspector(),
    api.reports.avgInspectionTime(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral das vistorias da locadora em tempo real."
      />
      <KpiCards summary={summary} />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Relatórios</h2>
        <ReportCharts damages={damages} pending={pending} avgTime={avgTime} />
      </div>
    </div>
  );
}
