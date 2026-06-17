import { colors } from "../../tokens";

export interface ProgressBarProps {
  value: number;
}

export function resolveProgress(value: number): { pct: number; color: string } {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  let color: string;
  if (pct >= 100) color = colors.success;
  else if (pct >= 50) color = colors.primary;
  else color = colors.warning;
  return { pct, color };
}
