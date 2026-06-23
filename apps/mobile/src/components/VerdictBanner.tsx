import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

export function VerdictBanner({
  accepted,
  reason,
  onRetry,
}: {
  accepted: boolean | null;
  reason?: string | null;
  onRetry: () => void;
}) {
  if (accepted === null) {
    return (
      <View testID="verdict-pending" style={[styles.banner, styles.pending]}>
        <Text style={[styles.title, { color: colors.warningText }]}>Validação pendente</Text>
        <Text style={[styles.text, { color: colors.warningText }]}>
          O gestor revisará esta evidência na auditoria.
        </Text>
      </View>
    );
  }
  if (accepted) {
    return (
      <View testID="verdict-accepted" style={[styles.banner, styles.ok]}>
        <Text style={[styles.title, { color: colors.successText }]}>Aceita pela IA</Text>
        <Text style={[styles.text, { color: colors.successText }]}>Evidência validada com sucesso.</Text>
      </View>
    );
  }
  return (
    <View testID="verdict-rejected" style={[styles.banner, styles.bad]}>
      <Text style={[styles.title, { color: colors.dangerText }]}>Rejeitada</Text>
      <Text style={[styles.text, { color: colors.dangerText }]}>{reason ?? "motivo não informado"}</Text>
      <Pressable
        testID="retry"
        style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>Refazer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: radius.md, padding: spacing.lg, gap: spacing.xs },
  pending: { backgroundColor: colors.warningBg },
  ok: { backgroundColor: colors.successBg },
  bad: { backgroundColor: colors.dangerBg },
  title: { fontSize: 15, fontWeight: "700" },
  text: { fontSize: 14 },
  retry: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  retryText: { color: colors.primaryText, fontWeight: "700" },
});
