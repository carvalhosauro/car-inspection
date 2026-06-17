import type { FC } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AI_CONFIG, type AiIcon, type AiPhotoResultProps } from "./AiPhotoResult.logic";
import styles from "./AiPhotoResult.module.css";

const AI_ICONS: Record<AiIcon, typeof CheckCircle2> = {
  CheckCircle2,
  XCircle
};

export const AiPhotoResult: FC<AiPhotoResultProps> = ({ verdict, reason }) => {
  const cfg = AI_CONFIG[verdict];
  const Icon = AI_ICONS[cfg.icon];
  return (
    <div className={styles.box} data-testid="ai-result" data-verdict={verdict}>
      <div className={styles.header}>
        <Icon className={styles.icon} size={24} style={{ color: cfg.color }} aria-hidden="true" />
        <span className={styles.message}>{cfg.message}</span>
      </div>
      {verdict === "recusada" && reason ? (
        <span className={styles.reason}>{reason}</span>
      ) : null}
    </div>
  );
};
