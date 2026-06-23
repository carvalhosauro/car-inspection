import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api-server";
import { isWebRoleAllowed } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session || !isWebRoleAllowed(session.role)) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={session.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-up mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
