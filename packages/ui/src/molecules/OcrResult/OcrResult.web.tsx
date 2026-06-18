import type { FC } from "react";
import { OCR_LABEL, type OcrResultProps } from "./OcrResult.logic";
import styles from "./OcrResult.module.css";

export const OcrResult: FC<OcrResultProps> = ({ type, result, imageUrl, validated }) => (
  <div className={styles.row}>
    {imageUrl ? (
      <img className={styles.thumb} src={imageUrl} alt={`Captura de ${OCR_LABEL[type]}`} />
    ) : (
      <div className={styles.thumb} role="img" aria-label={`Captura de ${OCR_LABEL[type]}`} />
    )}
    <div className={styles.body}>
      <span className={styles.type}>{OCR_LABEL[type]}</span>
      <span className={styles.value}>{result}</span>
    </div>
    {validated ? (
      <span className={styles.pill}>
        <span aria-hidden="true">✓ </span>
        <span>Validado</span>
      </span>
    ) : null}
  </div>
);
