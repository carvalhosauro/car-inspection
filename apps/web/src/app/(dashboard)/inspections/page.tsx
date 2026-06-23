import { redirect } from "next/navigation";
import { serverApi, getServerSession } from "@/lib/api-server";
import { InspectionsList } from "@/components/inspections-list";

export default async function InspectionsPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  const api = await serverApi();
  const { items } = await api.inspections.list({});
  return <InspectionsList initial={items} role={session.role} />;
}
