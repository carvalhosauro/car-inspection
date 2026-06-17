import { useEffect, useState, type FC } from "react";
import type { UniqueCodeProps } from "./UniqueCode.logic";
import styles from "./UniqueCode.module.css";

export const UniqueCode: FC<UniqueCodeProps> = ({ code, onCopied }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    onCopied?.();
  };

  return (
    <span className={styles.wrapper}>
      <span className={styles.code}>{code}</span>
      {copied ? (
        <span className={styles.copied}>Copiado!</span>
      ) : (
        <button type="button" className={styles.copy} onClick={copy} aria-label="Copiar código">
          Copiar
        </button>
      )}
    </span>
  );
};
