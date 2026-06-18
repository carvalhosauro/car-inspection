import type { FC } from "react";
import { CheckCircle2, Clock3, AlertCircle, XCircle, CalendarClock } from "lucide-react";
import { BADGE_CONFIG, type BadgeIcon, type BadgeProps } from "./Badge.logic";
import styles from "./Badge.module.css";

const BADGE_ICONS: Record<BadgeIcon, typeof CheckCircle2> = {
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
  CalendarClock
};

export const Badge: FC<BadgeProps> = ({ variant }) => {
  const cfg = BADGE_CONFIG[variant];
  const Icon = BADGE_ICONS[cfg.icon];
  return (
    <span
      className={styles.badge}
      data-variant={variant}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon className={styles.icon} size={14} aria-hidden="true" />
      {cfg.label}
    </span>
  );
};
