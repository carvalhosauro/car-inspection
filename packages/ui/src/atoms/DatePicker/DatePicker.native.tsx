import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { formatDisplayDate, type DatePickerProps } from "./DatePicker.logic";

// Native DatePicker fallback. Consumer apps should wire up a platform
// date picker (e.g. @react-native-community/datetimepicker) on top of this.
const s = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: 12, color: colors.neutral600 },
  field: {
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutralWhite
  },
  value: { fontSize: 16, color: colors.dark },
  placeholder: { fontSize: 16, color: colors.neutral300 },
  error: { fontSize: 12, color: colors.error }
});

export const DatePicker: FC<DatePickerProps> = ({ value, label, placeholder, errorMessage }) => {
  return (
    <View style={s.wrapper}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.field}>
        <Text style={value ? s.value : s.placeholder}>
          {value ? formatDisplayDate(value) : placeholder ?? "DD/MM/AAAA"}
        </Text>
      </View>
      {errorMessage ? <Text style={s.error}>{errorMessage}</Text> : null}
    </View>
  );
};
