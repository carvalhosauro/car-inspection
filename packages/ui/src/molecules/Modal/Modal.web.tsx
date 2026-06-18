import { useEffect, useId, type FC } from "react";
import { Button } from "../../atoms/Button";
import { resolveModalLabels, type ModalProps } from "./Modal.logic";
import styles from "./Modal.module.css";

export const Modal: FC<ModalProps> = (props) => {
  const titleId = useId();
  const { onClose } = props;

  useEffect(() => {
    if (!props.open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [props.open, onClose]);

  if (!props.open) return null;
  const { confirm, cancel } = resolveModalLabels(props);
  const variant = props.variant ?? "default";

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-variant={variant}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {variant === "warning" ? (
            <span className={styles.warnIcon} aria-hidden="true">⚠</span>
          ) : null}
          <span id={titleId} className={styles.title}>{props.title}</span>
        </div>
        {props.children ? <div className={styles.body}>{props.children}</div> : null}
        <div className={styles.actions}>
          <Button label={cancel} variant="secondary" onPress={props.onCancel} />
          <Button
            label={confirm}
            variant={variant === "warning" ? "success" : "primary"}
            onPress={props.onConfirm}
          />
        </div>
      </div>
    </div>
  );
};
