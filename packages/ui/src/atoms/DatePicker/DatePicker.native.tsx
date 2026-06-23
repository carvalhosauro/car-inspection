import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { formatDisplayDate, type DatePickerProps } from "./DatePicker.logic";
import { NativeFieldShell } from "../shared/NativeFieldShell";

// Native DatePicker fallback. Consumer apps should wire up a platform
// date picker (e.g. @react-native-community/datetimepicker) on top of this.
const s = StyleSheet.create({
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
  placeholder: { fontSize: 16, color: colors.neutral300 }
});

export const DatePicker: FC<DatePickerProps> = ({ value, label, placeholder, errorMessage }) => {
  return (
    <NativeFieldShell label={label} errorMessage={errorMessage}>
      <View style={s.field}>
        <Text style={value ? s.value : s.placeholder}>
          {value ? formatDisplayDate(value) : placeholder ?? "DD/MM/AAAA"}
        </Text>
      </View>
    </NativeFieldShell>
  );
};
