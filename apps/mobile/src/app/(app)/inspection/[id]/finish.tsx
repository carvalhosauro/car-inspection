import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { colors, radius, shadow, spacing } from "@/theme";

export default function Finish() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useApiClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function finishNow() {
    setBusy(true);
    setError(null);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setError("Permissão de localização negada.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const result = await client.inspections.finish(id, {
        geoLat: pos.coords.latitude,
        geoLng: pos.coords.longitude,
      });
      setCode(result.uniqueCode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao concluir");
    } finally {
      setBusy(false);
    }
  }

  if (code) {
    return (
      <Screen>
        <View style={styles.successCard}>
          <View style={styles.check}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.title}>Vistoria concluída</Text>
          <Text style={styles.codeLabel}>Código único</Text>
          <Text testID="unique-code" style={styles.code}>
            {code}
          </Text>
        </View>
        <View style={styles.spacer} />
        <Button testID="done" title="Voltar ao início" onPress={() => router.replace("/")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Concluir vistoria</Text>
        <Text style={styles.meta}>Vamos registrar sua localização ao concluir a vistoria.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.spacer} />
      <Button
        testID="finish-now"
        title="Capturar geo e concluir"
        variant="success"
        loading={busy}
        onPress={finishNow}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  successCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
    ...shadow.card,
  },
  check: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  checkMark: { color: colors.success, fontSize: 34, fontWeight: "800" },
  title: { fontSize: 22, fontWeight: "800", color: colors.text },
  meta: { fontSize: 15, color: colors.textMuted },
  codeLabel: { fontSize: 13, color: colors.textSubtle, marginTop: spacing.sm },
  code: { fontSize: 26, fontWeight: "800", color: colors.success, letterSpacing: 1 },
  error: { color: colors.danger, fontSize: 14 },
  spacer: { flex: 1 },
});
