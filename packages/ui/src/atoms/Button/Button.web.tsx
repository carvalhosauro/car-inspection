import type { FC } from "react";
import { resolveButtonState, type ButtonProps, type ButtonVariant } from "./Button.logic";
import styles from "./Button.module.css";

const variantClass: Record<ButtonVariant, string | undefined> = {
  primary: styles.primary,
  secondary: styles.secondary,
  success: styles.success,
  danger: styles.danger
};

export const Button: FC<ButtonProps> = (props) => {
  const { isInteractive, variant, size } = resolveButtonState(props);
  const className = [
    styles.button,
    variantClass[variant],
    size === "sm" ? styles.sizeSm : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      data-variant={variant}
      data-size={size}
      disabled={!isInteractive}
      aria-busy={props.loading ? "true" : undefined}
      onClick={isInteractive ? props.onPress : undefined}
    >
      {props.loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {props.label}
    </button>
  );
};
