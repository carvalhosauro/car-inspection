import { useId, type FC } from "react";
import { Button } from "../../atoms/Button";
import { resolveModalLabels, type ModalProps } from "./Modal.logic";
import styles from "./Modal.module.css";

export const Modal: FC<ModalProps> = (props) => {
  const titleId = useId();
  if (!props.open) return null;
  const { confirm, cancel } = resolveModalLabels(props);
  const variant = props.variant ?? "default";

  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-variant={variant}
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
