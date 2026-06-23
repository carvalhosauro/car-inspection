import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, tones, type Tone } from "@/theme";

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const palette = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <View style={[styles.dot, { backgroundColor: palette.text }]} />
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: "700" },
});
