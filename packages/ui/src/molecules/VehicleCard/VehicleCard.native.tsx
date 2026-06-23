import type { FC } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { Badge } from "../../atoms/Badge/Badge.native";
import { ProgressBar } from "../../atoms/ProgressBar/ProgressBar.native";
import { formatKm, type VehicleCardProps } from "./VehicleCard.logic";

const CARD_RADIUS = 12;
const IMAGE_RADIUS = 8;
const IMAGE_HEIGHT = 140;

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: CARD_RADIUS,
    padding: spacing.md,
    backgroundColor: colors.neutralWhite,
  },
  image: { width: "100%", height: IMAGE_HEIGHT, borderRadius: IMAGE_RADIUS, backgroundColor: colors.neutral50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  plate: { fontSize: 24, fontWeight: "600", color: colors.dark },
  model: { fontSize: 16, color: colors.dark },
  meta: { fontSize: 12, color: colors.neutral600 },
});

export const VehicleCard: FC<VehicleCardProps> = (props) => {
  const body = (
    <>
      {props.imageUrl ? (
        <Image style={styles.image} source={{ uri: props.imageUrl }} />
      ) : (
        <View style={styles.image} />
      )}
      <View style={styles.header}>
        <Text style={styles.plate}>{props.plate}</Text>
        <Badge variant={props.status} />
      </View>
      <Text style={styles.model}>{props.model}</Text>
      <Text style={styles.meta}>
        {props.year} • {formatKm(props.km)}
      </Text>
      <ProgressBar value={props.progress} />
    </>
  );

  if (props.onPress) {
    return (
      <Pressable style={styles.card} onPress={props.onPress}>
        {body}
      </Pressable>
    );
  }

  return <View style={styles.card}>{body}</View>;
};
