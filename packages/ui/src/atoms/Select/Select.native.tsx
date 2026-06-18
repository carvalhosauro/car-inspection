import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { findSelectedOption, type SelectProps } from "./Select.logic";

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

export const Select: FC<SelectProps> = ({ label, value, options, placeholder, errorMessage }) => {
  const selected = findSelectedOption(options, value);
  return (
    <View style={s.wrapper}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.field}>
        <Text style={selected ? s.value : s.placeholder}>
          {selected ? selected.label : placeholder ?? "Selecione..."}
        </Text>
      </View>
      {errorMessage ? <Text style={s.error}>{errorMessage}</Text> : null}
    </View>
  );
};
