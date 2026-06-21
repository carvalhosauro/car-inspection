import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";

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
        <Text style={styles.title}>Vistoria concluída</Text>
        <Text style={styles.codeLabel}>Código único:</Text>
        <Text testID="unique-code" style={styles.code}>
          {code}
        </Text>
        <Pressable testID="done" style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>Voltar ao início</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Concluir vistoria</Text>
      <Text style={styles.meta}>Vamos registrar sua localização ao concluir.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable testID="finish-now" style={styles.button} onPress={finishNow} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Capturar geo e concluir</Text>
        )}
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  meta: { fontSize: 15, color: "#475569" },
  codeLabel: { fontSize: 14, color: "#475569", marginTop: 8 },
  code: { fontSize: 24, fontWeight: "800", color: "#16a34a", letterSpacing: 1 },
  error: { color: "#c0392b" },
  button: { backgroundColor: "#16a34a", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
