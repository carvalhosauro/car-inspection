"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  Car,
  Search,
  BarChart3,
  Users,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@vistoria/contracts";
import { can, type Action } from "@/lib/rbac";
import { setAccessToken } from "@/lib/token-store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  action: Action | null;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, action: null },
  { label: "Frota", href: "/vehicles", icon: Truck, action: "crudVehicles" },
  { label: "Checklists", href: "/checklists", icon: ClipboardList, action: "crudTemplates" },
  { label: "Vistorias", href: "/inspections", icon: Car, action: "assignInspections" },
  { label: "Auditoria", href: "/audit", icon: Search, action: "auditInspections" },
  { label: "Relatórios", href: "/reports", icon: BarChart3, action: "viewReports" },
  { label: "Usuários", href: "/users", icon: Users, action: "manageUsers" },
];

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  gestor: "Gestor",
  supervisor: "Supervisor",
  vistoriador: "Vistoriador",
};

function isActiveHref(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ role }: { role: UserRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = NAV.filter((n) => n.action === null || can(role, n.action));

  async function logout() {
    setAccessToken(null);
    await fetch("/api/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <>
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Vistoria AI</p>
          <p className="text-[11px] text-sidebar-foreground">Painel administrativo</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Navegação principal">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActiveHref(pathname, link.href);
          return (
            <button
              key={link.href}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => {
                router.push(link.href as Parameters<typeof router.push>[0]);
                setMobileOpen(false);
              }}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                active
                  ? "bg-sidebar-accent text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {ROLE_LABELS[role].charAt(0)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-white">{ROLE_LABELS[role]}</p>
            <p className="truncate text-[11px] text-sidebar-foreground">Sessão ativa</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar with menu trigger */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold">Vistoria AI</span>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-overlay-in absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar p-4">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-sidebar-foreground hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar p-4 lg:flex">
        {nav}
      </aside>
    </>
  );
}
