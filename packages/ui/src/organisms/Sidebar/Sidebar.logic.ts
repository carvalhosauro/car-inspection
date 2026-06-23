export type NavLinkId =
  | "dashboard"
  | "frota"
  | "checklist"
  | "vistorias"
  | "auditoria"
  | "relatorios"
  | "configuracoes"
  | "usuarios";

export interface NavLink {
  id: NavLinkId;
  label: string;
}

export const DEFAULT_LINKS: NavLink[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "frota", label: "Frota" },
  { id: "checklist", label: "Checklist" },
  { id: "vistorias", label: "Vistorias" },
  { id: "auditoria", label: "Auditoria" },
  { id: "relatorios", label: "Relatórios" },
  { id: "configuracoes", label: "Configurações" },
  { id: "usuarios", label: "Usuários" },
];

export interface SidebarProps {
  links?: NavLink[];
  activeId: string;
  collapsed?: boolean;
  onNavigate?: (id: string) => void;
}

export function isActive(linkId: NavLinkId, activeId: string): boolean {
  return linkId === activeId;
}
