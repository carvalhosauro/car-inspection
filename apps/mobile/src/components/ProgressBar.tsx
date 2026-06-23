import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text testID="progress-label" style={styles.label}>
          {done}/{total} concluídos
        </Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  track: { height: 10, backgroundColor: colors.border, borderRadius: radius.sm, overflow: "hidden" },
  fill: { height: 10, backgroundColor: colors.success, borderRadius: radius.sm },
  label: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  pct: { fontSize: 13, color: colors.success, fontWeight: "700" },
});
