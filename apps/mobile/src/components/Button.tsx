import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/theme";

type Variant = "primary" | "success" | "danger" | "secondary";

const VARIANT_BG: Record<Variant, string> = {
  primary: colors.primary,
  success: colors.success,
  danger: colors.danger,
  secondary: colors.surface,
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: colors.primaryText,
  success: colors.primaryText,
  danger: colors.primaryText,
  secondary: colors.text,
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  testID,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === "secondary";
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: VARIANT_BG[variant] },
        isSecondary && styles.secondaryBorder,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.primaryText} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, { color: VARIANT_TEXT[variant] }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBorder: { borderWidth: 1, borderColor: colors.border },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: "700" },
});
