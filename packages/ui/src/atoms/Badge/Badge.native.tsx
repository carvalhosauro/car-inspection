import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { spacing } from "../../tokens";
import { BADGE_CONFIG, type BadgeProps } from "./Badge.logic";
import { BADGE_GLYPHS } from "../../native-glyphs";

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: 9999,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    alignSelf: "flex-start",
  },
  label: { fontSize: 12, fontWeight: "600" },
});

export const Badge: FC<BadgeProps> = ({ variant }) => {
  const cfg = BADGE_CONFIG[variant];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.label, { color: cfg.color }]}>{BADGE_GLYPHS[cfg.icon]}</Text>
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};
