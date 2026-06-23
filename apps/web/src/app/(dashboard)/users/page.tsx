import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { UsersTable } from "@/components/users-table";

export default async function UsersPage() {
  const { denied } = await requireAction("manageUsers");
  if (denied)
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
        Apenas o gestor gerencia usuários da locadora.
      </p>
    );
  const api = await serverApi();
  const { items } = await api.users.list();
  return <UsersTable initial={items} />;
}
