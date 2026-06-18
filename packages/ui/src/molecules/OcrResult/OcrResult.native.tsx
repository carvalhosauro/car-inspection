import type { FC } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { OCR_LABEL, type OcrResultProps } from "./OcrResult.logic";

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 12, padding: spacing.sm },
  thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.neutral50 },
  body: { flex: 1 },
  type: { fontSize: 12, color: colors.neutral600 },
  value: { fontSize: 24, fontWeight: "600", color: colors.dark },
  pill: { borderRadius: 9999, paddingVertical: 2, paddingHorizontal: spacing.sm, backgroundColor: "#DCFCE7" },
  pillText: { fontSize: 12, fontWeight: "600", color: colors.success },
});

export const OcrResult: FC<OcrResultProps> = ({ type, result, imageUrl, validated }) => (
  <View style={styles.row}>
    {imageUrl ? <Image style={styles.thumb} source={{ uri: imageUrl }} /> : <View style={styles.thumb} />}
    <View style={styles.body}>
      <Text style={styles.type}>{OCR_LABEL[type]}</Text>
      <Text style={styles.value}>{result}</Text>
    </View>
    {validated ? (
      <View style={styles.pill}>
        <Text style={styles.pillText}>✓ Validado</Text>
      </View>
    ) : null}
  </View>
);
