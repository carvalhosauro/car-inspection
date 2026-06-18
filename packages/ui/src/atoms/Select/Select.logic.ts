export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export function findSelectedOption(
  options: SelectOption[],
  value?: string
): SelectOption | undefined {
  if (value === undefined) return undefined;
  return options.find((o) => o.value === value);
}
