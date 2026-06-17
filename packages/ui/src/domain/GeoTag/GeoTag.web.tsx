import type { FC } from "react";
import { MapPin } from "lucide-react";
import { formatLocation, type GeoTagProps } from "./GeoTag.logic";
import styles from "./GeoTag.module.css";

export const GeoTag: FC<GeoTagProps> = ({ city, state, validated }) => (
  <span className={styles.tag}>
    <MapPin className={styles.pin} size={16} aria-hidden="true" />
    <span className={styles.location}>{formatLocation(city, state)}</span>
    {validated ? <span className={styles.validated}>Localização validada</span> : null}
  </span>
);
