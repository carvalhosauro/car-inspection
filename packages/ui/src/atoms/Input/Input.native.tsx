import type { FC } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { resolveInputState, type InputProps } from "./Input.logic";

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: 12, color: colors.neutral600 },
  field: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.dark
  },
  error: { fontSize: 12, color: colors.error },
  errorBorder: { borderColor: colors.error }
});

export const Input: FC<InputProps> = (props) => {
  const state = resolveInputState(props);
  return (
    <View style={styles.wrapper}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <TextInput
        style={[styles.field, state === "error" ? styles.errorBorder : null]}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      {props.errorMessage ? <Text style={styles.error}>{props.errorMessage}</Text> : null}
    </View>
  );
};
