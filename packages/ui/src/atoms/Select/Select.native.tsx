import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { findSelectedOption, type SelectProps } from "./Select.logic";
import { NativeFieldShell } from "../shared/NativeFieldShell";

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

export const Select: FC<SelectProps> = ({ label, value, options, placeholder, errorMessage }) => {
  const selected = findSelectedOption(options, value);
  return (
    <NativeFieldShell label={label} errorMessage={errorMessage}>
      <View style={s.field}>
        <Text style={selected ? s.value : s.placeholder}>
          {selected ? selected.label : placeholder ?? "Selecione..."}
        </Text>
      </View>
    </NativeFieldShell>
  );
};
