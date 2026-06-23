import { Pressable, StyleSheet, Text, View } from "react-native";
import type { InspectionDto } from "@vistoria/contracts";
import { colors, radius, shadow, spacing } from "@/theme";
import {
  INSPECTION_STATUS_LABEL,
  INSPECTION_STATUS_TONE,
  INSPECTION_TYPE_LABEL,
} from "@/theme/status";
import { StatusBadge } from "@/components/StatusBadge";

export function InspectionCard({
  inspection,
  onPress,
}: {
  inspection: InspectionDto;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={`inspection-card-${inspection.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Text style={styles.type}>{INSPECTION_TYPE_LABEL[inspection.type]}</Text>
        <StatusBadge
          label={INSPECTION_STATUS_LABEL[inspection.status]}
          tone={INSPECTION_STATUS_TONE[inspection.status]}
        />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Veículo</Text>
        <Text style={styles.metaValue}>{inspection.vehicleId.slice(0, 8)}</Text>
      </View>
      {inspection.uniqueCode ? (
        <View style={styles.codePill}>
          <Text style={styles.code}>Código: {inspection.uniqueCode}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  pressed: { opacity: 0.9 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  type: { fontSize: 17, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  metaLabel: { fontSize: 13, color: colors.textSubtle },
  metaValue: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  codePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.successBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  code: { fontSize: 12, color: colors.successText, fontWeight: "700" },
});
