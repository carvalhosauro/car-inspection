import type { FC, ChangeEvent } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { resolveInputState, type InputProps } from "./Input.logic";
import styles from "./Input.module.css";

type HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

interface FieldProps {
  props: InputProps;
  state: ReturnType<typeof resolveInputState>;
  handle: HandleChange;
}

function SelectField({ props, state, handle }: FieldProps) {
  const isError = state === "error";
  return (
    <div className={styles.selectWrapper}>
      <select
        className={`${styles.field} ${styles.select}`}
        data-state={state}
        aria-invalid={isError || undefined}
        value={props.value}
        onChange={handle}
        disabled={props.disabled}
      >
          <option value="" disabled hidden>{props.placeholder ?? "Selecione..."}</option>
        {(props.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className={styles.fieldIcon} aria-hidden="true">
        <ChevronDown size={16} />
      </span>
    </div>
  );
}

function DateField({ props, state, handle }: FieldProps) {
  const isError = state === "error";
  return (
    <div className={styles.dateWrapper}>
      <input
        className={`${styles.field} ${styles.dateField}`}
        data-state={state}
        aria-invalid={isError || undefined}
        type="date"
        placeholder={props.placeholder}
        value={props.value}
        onChange={handle}
        disabled={props.disabled}
      />
      <span className={styles.fieldIcon} aria-hidden="true">
        <Calendar size={16} />
      </span>
    </div>
  );
}

function TextField({ props, state, handle }: FieldProps) {
  const isError = state === "error";
  return (
    <input
      className={styles.field}
      data-state={state}
      aria-invalid={isError || undefined}
      type={props.type === "search" ? "search" : "text"}
      placeholder={props.placeholder}
      value={props.value}
      onChange={handle}
      disabled={props.disabled}
    />
  );
}

export const Input: FC<InputProps> = (props) => {
  const state = resolveInputState(props);
  const handle: HandleChange = (e) => props.onChangeText?.(e.target.value);

  return (
    <label className={styles.wrapper}>
      {props.label ? <span className={styles.label}>{props.label}</span> : null}
      {props.type === "select" ? (
        <SelectField props={props} state={state} handle={handle} />
      ) : props.type === "datepicker" ? (
        <DateField props={props} state={state} handle={handle} />
      ) : (
        <TextField props={props} state={state} handle={handle} />
      )}
      {props.errorMessage ? (
        <span className={styles.error}>{props.errorMessage}</span>
      ) : null}
    </label>
  );
};
