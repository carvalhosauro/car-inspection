import { notFound } from "next/navigation";
import { serverApi } from "@/lib/api-server";
import { ApiError } from "@/lib/web-api";
import { InspectionLaudo } from "@/components/inspection-laudo";

export default async function LaudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = await serverApi();
  try {
    const laudo = await api.inspections.laudo(id);
    return <InspectionLaudo laudo={laudo} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}
