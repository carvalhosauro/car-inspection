import type { FC, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";

export interface NativeFieldShellProps {
  label?: string;
  errorMessage?: string;
  children: ReactNode;
}

const s = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: 12, color: colors.neutral600 },
  error: { fontSize: 12, color: colors.error }
});

export const NativeFieldShell: FC<NativeFieldShellProps> = ({ label, errorMessage, children }) => (
  <View style={s.wrapper}>
    {label ? <Text style={s.label}>{label}</Text> : null}
    {children}
    {errorMessage ? <Text style={s.error}>{errorMessage}</Text> : null}
  </View>
);
