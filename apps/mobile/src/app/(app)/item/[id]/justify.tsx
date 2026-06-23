import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";

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
      <View style={styles.card}>
        <Text style={styles.title}>Registrar não conformidade</Text>
        <Text style={styles.hint}>Descreva o problema encontrado neste item.</Text>
        <TextInput
          testID="justification"
          style={styles.input}
          placeholder="Ex: risco profundo no para-choque dianteiro"
          placeholderTextColor={colors.textSubtle}
          multiline
          value={justification}
          onChangeText={setJustification}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.spacer} />
      <Button
        testID="save-justify"
        title="Salvar e fotografar avaria"
        variant="danger"
        loading={busy}
        onPress={save}
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
  },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
  hint: { fontSize: 14, color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
  error: { color: colors.danger, fontSize: 14 },
  spacer: { flex: 1 },
});
