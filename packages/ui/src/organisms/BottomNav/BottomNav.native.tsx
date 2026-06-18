import type { FC } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import {
  DEFAULT_TABS,
  formatBadge,
  type BottomNavProps,
} from "./BottomNav.logic";

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: colors.neutralWhite,
    borderTopWidth: 1,
    borderTopColor: colors.neutral300,
    padding: spacing.sm,
  },
  tab: { alignItems: "center", gap: 2 },
  label: { fontSize: 12, color: colors.neutral600 },
  activeLabel: { color: colors.primary },
  center: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -12 }],
  },
  centerLabel: { color: colors.neutralWhite },
  badge: {
    position: "absolute",
    top: -4,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.neutralWhite, fontSize: 10 },
});

export const BottomNav: FC<BottomNavProps> = ({
  activeId,
  alertCount = 0,
  onTab,
}) => {
  const badge = formatBadge(alertCount);
  return (
    <View style={styles.bar}>
      {DEFAULT_TABS.map((tab) => (
        <Pressable
          key={tab.id}
          style={[styles.tab, tab.center ? styles.center : null]}
          onPress={() => onTab?.(tab.id)}
        >
          {/* TODO: add icons via lucide-react-native (not installed) */}
          <Text
            style={[
              styles.label,
              tab.center ? styles.centerLabel : null,
              tab.id === activeId ? styles.activeLabel : null,
            ]}
          >
            {tab.label}
          </Text>
          {tab.id === "alertas" && badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
};
