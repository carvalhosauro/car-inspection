import type { FC } from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { resolveButtonState, type ButtonProps, type ButtonVariant } from "./Button.logic";

const bg: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.neutral50,
  success: colors.success,
  danger: colors.error
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  label: { color: colors.neutralWhite, fontWeight: "600", fontSize: 16 },
  secondaryLabel: { color: colors.dark },
  disabled: { opacity: 0.5 }
});

export const Button: FC<ButtonProps> = (props) => {
  const { isInteractive, variant, size } = resolveButtonState(props);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!isInteractive}
      onPress={isInteractive ? props.onPress : undefined}
      style={[
        styles.base,
        { backgroundColor: bg[variant] },
        size === "sm" ? styles.sm : null,
        !isInteractive ? styles.disabled : null
      ]}
    >
      {props.loading ? <ActivityIndicator color={colors.neutralWhite} /> : null}
      <Text style={[styles.label, variant === "secondary" ? styles.secondaryLabel : null]}>
        {props.label}
      </Text>
    </Pressable>
  );
};
