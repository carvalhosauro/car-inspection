import { serverApi, getServerSession } from "@/lib/api-server";
import { redirect } from "next/navigation";
import { VehiclesTable } from "@/components/vehicles-table";

export default async function VehiclesPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  const api = await serverApi();
  const { items } = await api.base.vehicles.list();
  return <VehiclesTable role={session.role} initialVehicles={items} />;
}
