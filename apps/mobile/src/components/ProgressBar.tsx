import { StyleSheet, Text, View } from "react-native";

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text testID="progress-label" style={styles.label}>
        {done}/{total} concluídos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  track: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  fill: { height: 8, backgroundColor: "#16a34a" },
  label: { fontSize: 13, color: "#475569" },
});
