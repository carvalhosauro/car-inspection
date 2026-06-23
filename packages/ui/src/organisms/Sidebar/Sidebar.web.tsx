import type { FC } from "react";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  Car,
  Search,
  BarChart3,
  Settings,
  Users,
  Circle,
} from "lucide-react";
import { DEFAULT_LINKS, isActive, type SidebarProps } from "./Sidebar.logic";
import styles from "./Sidebar.module.css";

const SIDEBAR_ICONS = {
  dashboard: LayoutDashboard,
  frota: Truck,
  checklist: ClipboardList,
  vistorias: Car,
  auditoria: Search,
  relatorios: BarChart3,
  configuracoes: Settings,
  usuarios: Users,
} as const;

export const Sidebar: FC<SidebarProps> = ({ links = DEFAULT_LINKS, activeId, collapsed, onNavigate }) => (
  <nav
    className={styles.sidebar}
    data-testid="sidebar"
    data-collapsed={collapsed ? "true" : "false"}
    aria-label="Navegação principal"
  >
    <span className={styles.logo}>{collapsed ? "V" : "Vistoria AI"}</span>
    {links.map((link) => {
      const Icon = SIDEBAR_ICONS[link.id] ?? Circle;
      return (
        <button
          key={link.id}
          type="button"
          className={styles.link}
          aria-label={link.label}
          aria-current={isActive(link.id, activeId) ? "page" : undefined}
          onClick={() => onNavigate?.(link.id)}
        >
          <Icon size={18} aria-hidden="true" />
          <span className={styles.label}>{link.label}</span>
        </button>
      );
    })}
  </nav>
);
