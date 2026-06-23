import { colors } from "../../tokens";

const PROGRESS_COMPLETE_THRESHOLD = 100;
const PROGRESS_WARN_THRESHOLD = 50;

export interface ProgressBarProps {
  value: number;
}

export function resolveProgress(value: number): { pct: number; color: string } {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  let color: string;
  if (pct >= PROGRESS_COMPLETE_THRESHOLD) color = colors.success;
  else if (pct >= PROGRESS_WARN_THRESHOLD) color = colors.primary;
  else color = colors.warning;
  return { pct, color };
}
