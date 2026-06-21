import { Pressable, StyleSheet, Text, View } from "react-native";

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
        <Text style={styles.text}>Validação pendente — o gestor revisará na auditoria.</Text>
      </View>
    );
  }
  if (accepted) {
    return (
      <View testID="verdict-accepted" style={[styles.banner, styles.ok]}>
        <Text style={styles.text}>Aceita pela IA.</Text>
      </View>
    );
  }
  return (
    <View testID="verdict-rejected" style={[styles.banner, styles.bad]}>
      <Text style={styles.text}>Rejeitada: {reason ?? "motivo não informado"}</Text>
      <Pressable testID="retry" style={styles.retry} onPress={onRetry}>
        <Text style={styles.retryText}>Refazer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 8, padding: 12, gap: 8 },
  pending: { backgroundColor: "#fef9c3" },
  ok: { backgroundColor: "#dcfce7" },
  bad: { backgroundColor: "#fee2e2" },
  text: { fontSize: 15 },
  retry: { alignSelf: "flex-start", backgroundColor: "#1d4ed8", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  retryText: { color: "#fff", fontWeight: "600" },
});
