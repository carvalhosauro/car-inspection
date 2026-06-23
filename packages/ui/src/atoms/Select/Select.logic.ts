import type { Option } from "../Input/Input.logic";

/** @deprecated Use {@link Option} */
export type SelectOption = Option;

export interface SelectProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export function findSelectedOption(
  options: Option[],
  value?: string
): Option | undefined {
  if (value === undefined) return undefined;
  return options.find((o) => o.value === value);
}
