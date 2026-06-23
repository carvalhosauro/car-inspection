"use client";

import { usePathname } from "next/navigation";
import type { UserRole } from "@vistoria/contracts";

const SECTION_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  vehicles: "Frota",
  checklists: "Checklists",
  inspections: "Vistorias",
  audit: "Auditoria",
  users: "Usuários",
};

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  gestor: "Gestor",
  supervisor: "Supervisor",
  vistoriador: "Vistoriador",
};

export function Topbar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "dashboard";
  const title = SECTION_TITLES[segment] ?? "Painel";

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur lg:flex">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Vistoria AI</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground ring-1 ring-inset ring-primary/20">
          {ROLE_LABELS[role]}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {ROLE_LABELS[role].charAt(0)}
        </span>
      </div>
    </header>
  );
}
