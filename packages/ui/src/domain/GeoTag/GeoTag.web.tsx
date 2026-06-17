import type { FC } from "react";
import { formatLocation, type GeoTagProps } from "./GeoTag.logic";
import styles from "./GeoTag.module.css";

export const GeoTag: FC<GeoTagProps> = ({ city, state, validated }) => (
  <span className={styles.tag}>
    <span className={styles.pin} aria-hidden="true">📍</span>
    <span className={styles.location}>{formatLocation(city, state)}</span>
    {validated ? <span className={styles.validated}>Localização validada</span> : null}
  </span>
);
