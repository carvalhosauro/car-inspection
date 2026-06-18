import type { FC } from "react";
import { resolveChange, type StatCardProps } from "./StatCard.logic";
import styles from "./StatCard.module.css";

export const StatCard: FC<StatCardProps> = (props) => {
  const change = resolveChange(props);
  return (
    <div className={styles.card}>
      <span className={styles.value}>{props.value}</span>
      <span className={styles.label}>{props.label}</span>
      {change ? (
        <span className={styles.change} style={{ color: change.color }}>
          {change.arrow} {props.change}
        </span>
      ) : null}
    </div>
  );
};
