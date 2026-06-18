import { redirect } from "next/navigation";
import { serverApi, getServerSession } from "@/lib/api-server";
import { AuditQueue } from "@/components/audit-queue";

export default async function AuditPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  const api = await serverApi();
  const { items } = await api.inspections.list({ status: "concluida" });
  return <AuditQueue role={session.role} initial={items} />;
}
