import type { FC } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import type { SelectProps } from "./Select.logic";
import styles from "./Select.module.css";

export const Select: FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  label,
  disabled,
  errorMessage
}) => {
  return (
    <label className={styles.wrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger className={styles.trigger} aria-label={label}>
          <RadixSelect.Value placeholder={placeholder ?? "Selecione..."} />
          <RadixSelect.Icon className={styles.triggerIcon}>
            <ChevronDown size={16} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((opt) => (
                <RadixSelect.Item key={opt.value} value={opt.value} className={styles.item}>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={styles.itemIndicator}>
                    <Check size={14} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {errorMessage ? <span className={styles.error}>{errorMessage}</span> : null}
    </label>
  );
};
