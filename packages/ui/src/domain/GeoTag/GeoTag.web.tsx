import type { FC } from "react";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import { GEO_STATUS_CONFIG, formatLocation, type GeoTagProps } from "./GeoTag.logic";
import styles from "./GeoTag.module.css";

const ICONS = { pending: Loader2, acquired: MapPin, error: AlertCircle } as const;

export const GeoTag: FC<GeoTagProps> = ({ lat, lng, status = 'pending', address }) => {
  const resolvedStatus = status ?? 'pending';
  const cfg = GEO_STATUS_CONFIG[resolvedStatus];
  const Icon = ICONS[resolvedStatus];

  return (
    <span className={styles.tag}>
      <Icon
        className={resolvedStatus === 'pending' ? styles.spin : styles.pin}
        size={16}
        aria-hidden="true"
        style={{ color: cfg.colorVar }}
      />
      <span className={styles.location}>{address ?? formatLocation(lat, lng)}</span>
      <span className={styles.statusLabel} style={{ color: cfg.colorVar }}>{cfg.label}</span>
    </span>
  );
};
