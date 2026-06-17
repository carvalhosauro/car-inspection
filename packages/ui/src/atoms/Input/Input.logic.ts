export type InputType = "text" | "select" | "search" | "datepicker";
export type InputState = "default" | "filled" | "error";

export interface InputOption {
  label: string;
  value: string;
}

export interface InputProps {
  type?: InputType;
  value?: string;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  options?: InputOption[];
  onChangeText?: (value: string) => void;
}

export function resolveInputState(props: InputProps): InputState {
  if (props.errorMessage) return "error";
  if (props.value && props.value.length > 0) return "filled";
  return "default";
}
