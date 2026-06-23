"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sidebar, type NavLink } from "@vistoria/ui/organisms/Sidebar";
import type { UserRole } from "@vistoria/contracts";
import { can, type Action } from "@/lib/rbac";
import { Button } from "@vistoria/ui/atoms/Button";
import { setAccessToken } from "@/lib/token-store";

interface NavItem {
  id: NavLink["id"];
  label: string;
  href: string;
  action: Action | null; // null = always visible
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", action: null },
  { id: "frota", label: "Frota", href: "/vehicles", action: "crudVehicles" },
  { id: "checklist", label: "Checklists", href: "/checklists", action: "crudTemplates" },
  { id: "vistorias", label: "Vistorias", href: "/inspections", action: "assignInspections" },
  { id: "auditoria", label: "Auditoria", href: "/audit", action: "auditInspections" },
  { id: "relatorios", label: "Relatórios", href: "/reports", action: "viewReports" },
  { id: "usuarios", label: "Usuários", href: "/users", action: "manageUsers" },
];

/** Maps a pathname to the nav item id (uses the first segment after /). */
function pathnameToActiveId(pathname: string): string {
  const segment = pathname.split("/")[1] ?? "dashboard";
  // /dashboard → "dashboard", /vehicles → "frota", etc.
  const found = NAV.find((n) => n.href === `/${segment}`);
  return found?.id ?? segment;
}

export function AppSidebar({ role }: { role: UserRole }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = NAV.filter((n) => n.action === null || can(role, n.action)).map((n) => ({
    id: n.id,
    label: n.label,
  }));

  const hrefMap = Object.fromEntries(NAV.map((n) => [n.id, n.href]));

  function handleNavigate(id: string) {
    const href = hrefMap[id];
    if (href) router.push(href as Parameters<typeof router.push>[0]);
  }

  async function logout() {
    setAccessToken(null);
    await fetch("/api/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col">
      <Sidebar
        links={links}
        activeId={pathnameToActiveId(pathname)}
        onNavigate={handleNavigate}
      />
      <div className="p-4">
        <Button
          label="Sair"
          onPress={logout}
          variant="secondary"
        />
      </div>
    </div>
  );
}
