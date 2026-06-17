import { colors } from "../../tokens";

export type ChecklistState = "conforme" | "pendente" | "nao-conforme";

export const CHECKLIST_CONFIG: Record<ChecklistState, { icon: string; color: string }> = {
  conforme: { icon: "✓", color: colors.success },
  pendente: { icon: "○", color: colors.warning },
  "nao-conforme": { icon: "⚠", color: colors.error },
};

export interface ChecklistItemProps {
  state: ChecklistState;
  label: string;
  sublabel?: string;
}
