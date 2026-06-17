import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { resolveChange, type StatCardProps } from "./StatCard.logic";

const styles = StyleSheet.create({
  card: { gap: spacing.xs, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 12, padding: spacing.md, backgroundColor: colors.neutralWhite },
  value: { fontSize: 40, fontWeight: "700", color: colors.dark },
  label: { fontSize: 12, color: colors.neutral600 },
  change: { fontSize: 12, fontWeight: "600" }
});

export const StatCard: FC<StatCardProps> = (props) => {
  const change = resolveChange(props);
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{props.value}</Text>
      <Text style={styles.label}>{props.label}</Text>
      {change ? <Text style={[styles.change, { color: change.color }]}>{change.arrow} {props.change}</Text> : null}
    </View>
  );
};
