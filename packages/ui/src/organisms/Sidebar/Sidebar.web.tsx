import type { FC } from "react";
import { DEFAULT_LINKS, isActive, type SidebarProps } from "./Sidebar.logic";
import styles from "./Sidebar.module.css";

export const Sidebar: FC<SidebarProps> = ({ links = DEFAULT_LINKS, activeId, collapsed, onNavigate }) => (
  <nav
    className={styles.sidebar}
    data-testid="sidebar"
    data-collapsed={collapsed ? "true" : "false"}
    aria-label="Navegação principal"
  >
    <span className={styles.logo}>{collapsed ? "V" : "Vistoria AI"}</span>
    {links.map((link) => (
      <button
        key={link.id}
        type="button"
        className={styles.link}
        aria-current={isActive(link.id, activeId) ? "page" : undefined}
        onClick={() => onNavigate?.(link.id)}
      >
        <span className={styles.label}>{link.label}</span>
      </button>
    ))}
  </nav>
);
