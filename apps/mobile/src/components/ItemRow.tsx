import { Pressable, StyleSheet, Text, View } from "react-native";
import type { InspectionItemDto } from "@vistoria/contracts";
import { colors, radius, spacing } from "@/theme";
import { ITEM_STATUS_LABEL, ITEM_STATUS_TONE } from "@/theme/status";
import { StatusBadge } from "@/components/StatusBadge";

export function ItemRow({
  item,
  onPress,
}: {
  item: InspectionItemDto;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={`item-row-${item.id}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.label}>{item.labelSnapshot}</Text>
        <StatusBadge label={ITEM_STATUS_LABEL[item.status]} tone={ITEM_STATUS_TONE[item.status]} />
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.9 },
  left: { gap: spacing.xs, flexShrink: 1 },
  label: { fontSize: 16, color: colors.text, fontWeight: "600" },
  chevron: { fontSize: 24, color: colors.borderStrong },
});
