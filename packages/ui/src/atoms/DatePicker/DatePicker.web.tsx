import { useState, type FC } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";
import { formatDisplayDate, toISODate, type DatePickerProps } from "./DatePicker.logic";
import styles from "./DatePicker.module.css";

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onValueChange,
  label,
  placeholder,
  disabled,
  errorMessage
}) => {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <div className={styles.wrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={styles.trigger}
            disabled={disabled}
            aria-label={label ?? "Selecionar data"}
          >
            <span className={value ? styles.value : styles.placeholder}>
              {value ? formatDisplayDate(value) : placeholder ?? "DD/MM/AAAA"}
            </span>
            <Calendar size={16} className={styles.triggerIcon} aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.content} sideOffset={4} align="start">
            <DayPicker
              mode="single"
              locale={ptBR}
              selected={selected}
              onSelect={(day) => {
                if (day) {
                  onValueChange?.(toISODate(day));
                  setOpen(false);
                }
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {errorMessage ? <span className={styles.error}>{errorMessage}</span> : null}
    </div>
  );
};
