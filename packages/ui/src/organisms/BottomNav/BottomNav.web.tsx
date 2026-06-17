import type { FC } from "react";
import {
  DEFAULT_TABS,
  formatBadge,
  type BottomNavProps,
} from "./BottomNav.logic";
import styles from "./BottomNav.module.css";

export const BottomNav: FC<BottomNavProps> = ({
  activeId,
  alertCount = 0,
  onTab,
}) => {
  const badge = formatBadge(alertCount);
  return (
    <nav className={styles.bar} aria-label="Navegação inferior">
      {DEFAULT_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={styles.tab}
          data-center={tab.center ? "true" : "false"}
          aria-current={tab.id === activeId ? "page" : undefined}
          onClick={() => onTab?.(tab.id)}
        >
          <span>{tab.label}</span>
          {tab.id === "alertas" && badge ? (
            <span className={styles.badge} data-testid="alert-badge">
              {badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
};
