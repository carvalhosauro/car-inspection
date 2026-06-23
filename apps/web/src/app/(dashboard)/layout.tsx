import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api-server";
import { isWebRoleAllowed } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session || !isWebRoleAllowed(session.role)) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen">
      <AppSidebar role={session.role} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
