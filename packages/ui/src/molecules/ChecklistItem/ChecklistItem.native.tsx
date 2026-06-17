import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { CHECKLIST_CONFIG, type ChecklistItemProps } from "./ChecklistItem.logic";

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral300,
  },
  icon: { width: 20, fontWeight: "700", textAlign: "center" },
  label: { fontSize: 16, color: colors.dark },
  sublabel: { fontSize: 12, color: colors.neutral600 },
});

export const ChecklistItem: FC<ChecklistItemProps> = ({ state, label, sublabel }) => {
  const cfg = CHECKLIST_CONFIG[state];
  return (
    <View style={styles.item}>
      <Text style={[styles.icon, { color: cfg.color }]}>{cfg.icon}</Text>
      <View>
        <Text style={styles.label}>{label}</Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
    </View>
  );
};
