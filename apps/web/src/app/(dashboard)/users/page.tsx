import { redirect } from "next/navigation";
import { serverApi, getServerSession } from "@/lib/api-server";
import { can } from "@/lib/rbac";
import { UsersTable } from "@/components/users-table";

export default async function UsersPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!can(session.role, "manageUsers")) {
    return <p className="text-muted-foreground">Apenas o gestor gerencia usuários da locadora.</p>;
  }
  const api = await serverApi();
  const { items } = await api.users.list();
  return <UsersTable initial={items} />;
}
