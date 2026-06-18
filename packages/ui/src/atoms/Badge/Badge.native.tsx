import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { spacing } from "../../tokens";
import { BADGE_CONFIG, type BadgeIcon, type BadgeProps } from "./Badge.logic";

const ICON_GLYPH: Record<BadgeIcon, string> = {
  CheckCircle2: "✓",
  Clock3: "•",
  AlertCircle: "!",
  XCircle: "✕",
  CalendarClock: "◷",
};

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
      <Text style={[styles.label, { color: cfg.color }]}>{ICON_GLYPH[cfg.icon]}</Text>
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};
