import type { FC, ChangeEvent } from "react";
import { resolveInputState, type InputProps } from "./Input.logic";
import styles from "./Input.module.css";

export const Input: FC<InputProps> = (props) => {
  const state = resolveInputState(props);
  const isError = state === "error";
  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => props.onChangeText?.(e.target.value);

  return (
    <label className={styles.wrapper}>
      {props.label ? <span className={styles.label}>{props.label}</span> : null}
      {props.type === "select" ? (
        <select
          className={styles.field}
          data-state={state}
          aria-invalid={isError || undefined}
          value={props.value}
          onChange={handle}
          disabled={props.disabled}
        >
          {(props.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={styles.field}
          data-state={state}
          aria-invalid={isError || undefined}
          type={
            props.type === "search"
              ? "search"
              : props.type === "datepicker"
                ? "date"
                : "text"
          }
          placeholder={props.placeholder}
          value={props.value}
          onChange={handle}
          disabled={props.disabled}
        />
      )}
      {props.errorMessage ? (
        <span className={styles.error}>{props.errorMessage}</span>
      ) : null}
    </label>
  );
};
