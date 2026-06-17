export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "md" | "sm";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function resolveButtonState(props: ButtonProps): {
  isInteractive: boolean;
  variant: ButtonVariant;
  size: ButtonSize;
} {
  return {
    isInteractive: !props.disabled && !props.loading,
    variant: props.variant ?? "primary",
    size: props.size ?? "md"
  };
}
