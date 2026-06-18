import type { FC } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import type { UploadAreaProps } from "./UploadArea.logic";

const styles = StyleSheet.create({
  area: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.neutral300,
    borderRadius: 12,
    padding: spacing.xl,
    backgroundColor: colors.neutral50,
  },
  text: { color: colors.neutral600 },
  small: { color: colors.neutral600, fontSize: 12 },
});

export const UploadArea: FC<UploadAreaProps> = () => (
  <Pressable style={styles.area} accessibilityRole="button">
    <Text style={styles.text}>Toque para selecionar uma imagem</Text>
    <Text style={styles.small}>PNG ou JPG até 10MB</Text>
  </Pressable>
);
