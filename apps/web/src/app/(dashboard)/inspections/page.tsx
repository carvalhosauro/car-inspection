import { serverApi } from "@/lib/api-server";
import { InspectionsList } from "@/components/inspections-list";

export default async function InspectionsPage() {
  const api = await serverApi();
  const { items } = await api.inspections.list({});
  return <InspectionsList initial={items} />;
}
