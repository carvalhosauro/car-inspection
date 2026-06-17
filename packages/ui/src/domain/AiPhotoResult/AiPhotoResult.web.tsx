import type { FC } from "react";
import { AI_CONFIG, type AiPhotoResultProps } from "./AiPhotoResult.logic";
import styles from "./AiPhotoResult.module.css";

export const AiPhotoResult: FC<AiPhotoResultProps> = ({ verdict, reason }) => {
  const cfg = AI_CONFIG[verdict];
  return (
    <div className={styles.box} data-testid="ai-result" data-verdict={verdict}>
      <div className={styles.header}>
        <span className={styles.icon} style={{ color: cfg.color }} aria-hidden="true">
          {cfg.icon}
        </span>
        <span className={styles.message}>{cfg.message}</span>
      </div>
      {verdict === "recusada" && reason ? (
        <span className={styles.reason}>{reason}</span>
      ) : null}
    </div>
  );
};
