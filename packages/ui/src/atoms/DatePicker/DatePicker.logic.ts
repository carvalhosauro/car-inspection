export interface DatePickerProps {
  value?: string; // ISO date string: "2026-01-15"
  onValueChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export function formatDisplayDate(iso: string): string {
  // Intl.DateTimeFormat is avoided to stay timezone-neutral (no UTC conversion)
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function toISODate(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
