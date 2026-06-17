import type { FC } from "react";
import { BADGE_CONFIG, type BadgeProps } from "./Badge.logic";
import styles from "./Badge.module.css";

export const Badge: FC<BadgeProps> = ({ variant }) => {
  const cfg = BADGE_CONFIG[variant];
  return (
    <span
      className={styles.badge}
      data-variant={variant}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className={styles.icon} aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};
