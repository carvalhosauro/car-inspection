export type InputType = "text" | "select" | "search" | "datepicker";
export type InputState = "default" | "filled" | "error";

export interface Option {
  label: string;
  value: string;
}

/** @deprecated Use {@link Option} */
export type InputOption = Option;

export interface InputProps {
  type?: InputType;
  value?: string;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  options?: Option[];
  onChangeText?: (value: string) => void;
  disabled?: boolean;
}

export function resolveInputState(props: InputProps): InputState {
  if (props.errorMessage) return "error";
  if (props.value && props.value.length > 0) return "filled";
  return "default";
}
