import { colors } from "../../tokens";

export type ChangeDirection = "up" | "down";

export interface StatCardProps {
  value: string;
  label: string;
  change?: string;
  changeDirection?: ChangeDirection;
}

export function resolveChange(p: StatCardProps): { arrow: string; color: string } | null {
  if (!p.change || !p.changeDirection) return null;
  return p.changeDirection === "up"
    ? { arrow: "↑", color: colors.successText }
    : { arrow: "↓", color: colors.error };
}
