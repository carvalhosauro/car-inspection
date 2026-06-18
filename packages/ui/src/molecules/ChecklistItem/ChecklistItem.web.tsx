import type { FC } from "react";
import { CHECKLIST_CONFIG, type ChecklistItemProps } from "./ChecklistItem.logic";
import styles from "./ChecklistItem.module.css";

export const ChecklistItem: FC<ChecklistItemProps> = ({ state, label, sublabel }) => {
  const cfg = CHECKLIST_CONFIG[state];
  return (
    <div className={styles.item} data-state={state}>
      <span className={styles.icon} style={{ color: cfg.color }} aria-hidden="true">
        {cfg.icon}
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {sublabel ? <span className={styles.sublabel}>{sublabel}</span> : null}
      </span>
    </div>
  );
};
