import { serverApi } from "@/lib/api-server";
import { KpiCards } from "@/components/kpi-cards";

export default async function DashboardPage() {
  const api = await serverApi();
  const summary = await api.reports.summary();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <KpiCards summary={summary} />
    </div>
  );
}
