import type { FC } from "react";
import { TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { resolveInputState, type InputProps } from "./Input.logic";
import { NativeFieldShell } from "../shared/NativeFieldShell";

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.dark
  },
  errorBorder: { borderColor: colors.error }
});

export const Input: FC<InputProps> = (props) => {
  const state = resolveInputState(props);
  return (
    <NativeFieldShell label={props.label} errorMessage={props.errorMessage}>
      <TextInput
        style={[styles.field, state === "error" ? styles.errorBorder : null]}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </NativeFieldShell>
  );
};
