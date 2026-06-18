import type { FC } from "react";
import { resolveProgress, type ProgressBarProps } from "./ProgressBar.logic";
import styles from "./ProgressBar.module.css";

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const { pct, color } = resolveProgress(value);
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.fill} style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
};
