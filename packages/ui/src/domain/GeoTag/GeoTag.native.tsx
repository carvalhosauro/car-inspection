import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { GEO_STATUS_CONFIG, formatLocation, type GeoTagProps } from "./GeoTag.logic";
import { GEO_TAG_GLYPHS } from "../../native-glyphs";

const styles = StyleSheet.create({
  tag: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { fontSize: 16 },
  location: { fontSize: 16, color: colors.dark },
  statusLabel: { fontSize: 12, fontWeight: "600" },
});

export const GeoTag: FC<GeoTagProps> = ({ lat, lng, status = 'pending', address }) => {
  const cfg = GEO_STATUS_CONFIG[status];

  return (
    <View style={styles.tag}>
      <Text style={styles.icon}>{GEO_TAG_GLYPHS[status]}</Text>
      <Text style={styles.location}>{address ?? formatLocation(lat, lng)}</Text>
      <Text style={[styles.statusLabel, { color: cfg.colorVar }]}>{cfg.label}</Text>
    </View>
  );
};
