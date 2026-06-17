import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { formatLocation, type GeoTagProps } from "./GeoTag.logic";

const styles = StyleSheet.create({
  tag: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pin: { color: colors.primary, fontSize: 16 },
  location: { fontSize: 16, color: colors.dark },
  validated: { fontSize: 12, color: colors.success, fontWeight: "600" },
});

export const GeoTag: FC<GeoTagProps> = ({ city, state, validated }) => (
  <View style={styles.tag}>
    <Text style={styles.pin}>📍</Text>
    <Text style={styles.location}>{formatLocation(city, state)}</Text>
    {validated ? <Text style={styles.validated}>Localização validada</Text> : null}
  </View>
);
