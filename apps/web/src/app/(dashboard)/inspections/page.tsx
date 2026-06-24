import { redirect } from "next/navigation";
import { serverApi, getServerSession } from "@/lib/api-server";
import { InspectionsList } from "@/components/inspections-list";

export default async function InspectionsPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  const api = await serverApi();
  const [{ items }, vehicles, templates, inspectors] = await Promise.all([
    api.inspections.list({}),
    api.base.vehicles.list(),
    api.base.templates.list(),
    api.inspectors.list(),
  ]);
  return (
    <InspectionsList
      initial={items}
      role={session.role}
      vehicles={vehicles.items}
      templates={templates.items}
      inspectors={inspectors.items}
    />
  );
}
