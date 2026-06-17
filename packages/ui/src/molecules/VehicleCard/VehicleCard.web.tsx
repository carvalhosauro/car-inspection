import type { FC, ReactNode } from "react";
import { Badge } from "../../atoms/Badge";
import { ProgressBar } from "../../atoms/ProgressBar";
import { formatKm, type VehicleCardProps } from "./VehicleCard.logic";
import styles from "./VehicleCard.module.css";

export const VehicleCard: FC<VehicleCardProps> = (props) => {
  const content: ReactNode = (
    <>
      {props.imageUrl ? (
        <img className={styles.image} src={props.imageUrl} alt={`Veículo ${props.plate}`} />
      ) : (
        <div className={styles.image} role="img" aria-label={`Veículo ${props.plate}`} />
      )}
      <div className={styles.header}>
        <span className={styles.plate}>{props.plate}</span>
        <Badge variant={props.status} />
      </div>
      <span className={styles.model}>{props.model}</span>
      <span className={styles.meta}>
        <span>{props.year}</span>
        {" • "}
        <span>{formatKm(props.km)}</span>
      </span>
      <ProgressBar value={props.progress} />
    </>
  );

  if (props.onPress) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.pressable}`}
        data-status={props.status}
        onClick={props.onPress}
      >
        {content}
      </button>
    );
  }

  return (
    <article className={styles.card} data-status={props.status}>
      {content}
    </article>
  );
};
