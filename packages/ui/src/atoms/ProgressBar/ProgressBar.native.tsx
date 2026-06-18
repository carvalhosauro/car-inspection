import type { FC } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../tokens";
import { resolveProgress, type ProgressBarProps } from "./ProgressBar.logic";

const styles = StyleSheet.create({
  track: { width: "100%", height: 8, backgroundColor: colors.neutral300, borderRadius: 9999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 9999 }
});

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const { pct, color } = resolveProgress(value);
  return (
    <View style={styles.track} accessibilityRole="progressbar">
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
};
