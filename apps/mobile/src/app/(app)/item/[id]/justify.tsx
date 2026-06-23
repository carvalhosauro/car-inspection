import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";

export default function JustifyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useApiClient();
  const router = useRouter();
  const [justification, setJustification] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (justification.trim().length === 0) {
      setError("Descreva a não conformidade.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // 1. mark the item as non-conforming with the justification
      await client.inspectionItems.update(id, {
        status: "nao_conforme",
        justification,
      });
      // 2. create a child avaria sub-item (self-FK tree). The API's createChild
      //    body is { labelSnapshot, order? } and ignores justification — the
      //    justification already lives on the parent via the PATCH above.
      const child = await client.inspectionItems.createChild(id, {
        labelSnapshot: "Avaria",
      });
      // 3. go document the avaria with its own photo
      router.push(`/item/${child.id}/photo`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Registrar não conformidade</Text>
      <TextInput
        testID="justification"
        style={styles.input}
        placeholder="Descreva o problema (ex: risco no para-choque)"
        multiline
        value={justification}
        onChangeText={setJustification}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable testID="save-justify" style={styles.button} onPress={save} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar e fotografar avaria</Text>
        )}
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: "top" },
  error: { color: "#c0392b" },
  button: { backgroundColor: "#c0392b", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
