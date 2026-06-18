import type { ReactNode } from "react";

export type ModalVariant = "default" | "warning";

export interface ModalProps {
  open: boolean;
  title: string;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  children?: ReactNode;
}

export function resolveModalLabels(p: {
  confirmLabel?: string;
  cancelLabel?: string;
}): { confirm: string; cancel: string } {
  return {
    confirm: p.confirmLabel ?? "Confirmar",
    cancel: p.cancelLabel ?? "Cancelar"
  };
}
