import type { FC } from "react";
import { Home, ClipboardCheck, Camera, Bell, User } from "lucide-react";
import {
  DEFAULT_TABS,
  formatBadge,
  type BottomNavProps,
} from "./BottomNav.logic";
import styles from "./BottomNav.module.css";

const BOTTOM_NAV_ICONS = {
  inicio: Home,
  vistorias: ClipboardCheck,
  camera: Camera,
  alertas: Bell,
  perfil: User,
} as const;

export const BottomNav: FC<BottomNavProps> = ({
  activeId,
  alertCount = 0,
  onTab,
}) => {
  const badge = formatBadge(alertCount);
  return (
    <nav className={styles.bar} aria-label="Navegação inferior">
      {DEFAULT_TABS.map((tab) => {
        const Icon = BOTTOM_NAV_ICONS[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            className={styles.tab}
            data-center={tab.center ? "true" : "false"}
            aria-current={tab.id === activeId ? "page" : undefined}
            onClick={() => onTab?.(tab.id)}
          >
            {Icon ? <Icon size={tab.center ? 24 : 20} aria-hidden="true" /> : null}
            <span>{tab.label}</span>
            {tab.id === "alertas" && badge ? (
              <span className={styles.badge} data-testid="alert-badge">
                {badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};
