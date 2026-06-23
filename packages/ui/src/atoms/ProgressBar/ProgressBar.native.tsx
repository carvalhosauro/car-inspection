import type { FC } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../tokens";
import { resolveProgress, type ProgressBarProps } from "./ProgressBar.logic";

const PILL_RADIUS = 9999;
const TRACK_HEIGHT = 8;

const styles = StyleSheet.create({
  track: { width: "100%", height: TRACK_HEIGHT, backgroundColor: colors.neutral300, borderRadius: PILL_RADIUS, overflow: "hidden" },
  fill: { height: "100%", borderRadius: PILL_RADIUS }
});

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const { pct, color } = resolveProgress(value);
  return (
    <View style={styles.track} accessibilityRole="progressbar">
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
};
