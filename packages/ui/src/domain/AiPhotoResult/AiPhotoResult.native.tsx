import type { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { AI_CONFIG, type AiIcon, type AiPhotoResultProps } from "./AiPhotoResult.logic";

const ICON_GLYPH: Record<AiIcon, string> = {
  CheckCircle2: "✓",
  XCircle: "✕",
};

const styles = StyleSheet.create({
  box: { gap: spacing.xs, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.neutral300 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { fontWeight: "700", fontSize: 24 },
  message: { fontSize: 16, fontWeight: "600", color: colors.dark },
  reason: { fontSize: 12, color: colors.neutral600 },
});

export const AiPhotoResult: FC<AiPhotoResultProps> = ({ verdict, reason }) => {
  const cfg = AI_CONFIG[verdict];
  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <Text style={[styles.icon, { color: cfg.color }]}>{ICON_GLYPH[cfg.icon]}</Text>
        <Text style={styles.message}>{cfg.message}</Text>
      </View>
      {verdict === "recusada" && reason ? <Text style={styles.reason}>{reason}</Text> : null}
    </View>
  );
};
