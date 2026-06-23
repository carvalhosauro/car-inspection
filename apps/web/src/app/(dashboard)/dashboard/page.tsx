import { serverApi } from "@/lib/api-server";
import { KpiCards } from "@/components/kpi-cards";
import { PageHeader } from "@/components/ui/page-header";

export default async function DashboardPage() {
  const api = await serverApi();
  const summary = await api.reports.summary();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral das vistorias da locadora em tempo real."
      />
      <KpiCards summary={summary} />
    </div>
  );
}
