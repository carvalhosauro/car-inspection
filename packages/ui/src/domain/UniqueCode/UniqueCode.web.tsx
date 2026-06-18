import { useEffect, useState, type FC } from "react";
import { Copy, Check } from "lucide-react";
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
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopied?.();
    } catch {
      // clipboard unavailable (e.g. http context) — silently fail
    }
  };

  return (
    <span className={styles.wrapper}>
      <span className={styles.code}>{code}</span>
      {copied ? (
        <span className={styles.copied}>
          <Check size={14} aria-hidden="true" />
          Copiado!
        </span>
      ) : (
        <button type="button" className={styles.copy} onClick={copy} aria-label="Copiar código">
          <Copy size={14} aria-hidden="true" />
          Copiar
        </button>
      )}
    </span>
  );
};
