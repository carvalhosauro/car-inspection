import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";

export default function Review() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useApiClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["inspection", id, "items"],
    queryFn: () => client.inspections.items(id),
  });

  if (isLoading || !data) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  const topLevel: InspectionItemDto[] = data.filter((i) => i.parentItemId === null);
  const pending = topLevel.filter((i) => i.status === "pendente");
  const canFinish = pending.length === 0;

  return (
    <Screen>
      <Text style={styles.title}>Revisão</Text>
      <Text style={styles.summary}>
        {topLevel.length - pending.length}/{topLevel.length} itens concluídos
        {pending.length > 0 ? ` · ${pending.length} pendente(s)` : ""}
      </Text>

      <FlatList
        data={topLevel}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const isPending = item.status === "pendente";
          return (
            <Pressable
              testID={isPending ? `pending-${item.id}` : `done-${item.id}`}
              style={[styles.row, isPending ? styles.pendingRow : styles.doneRow]}
              onPress={() => router.push(`/item/${item.id}/photo`)}
            >
              <Text style={styles.rowLabel}>{item.labelSnapshot}</Text>
              <Text style={styles.rowStatus}>{item.status}</Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <Pressable
        testID="finish-button"
        style={[styles.button, !canFinish && styles.buttonDisabled]}
        disabled={!canFinish}
        onPress={() => router.push(`/inspection/${id}/finish`)}
      >
        <Text style={styles.buttonText}>
          {canFinish ? "Concluir vistoria" : "Resolva os pendentes"}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700" },
  summary: { fontSize: 14, color: "#475569" },
  row: { flexDirection: "row", justifyContent: "space-between", borderRadius: 8, padding: 12 },
  pendingRow: { backgroundColor: "#fef3c7" },
  doneRow: { backgroundColor: "#f1f5f9" },
  rowLabel: { fontSize: 15 },
  rowStatus: { fontSize: 13, color: "#475569" },
  button: { backgroundColor: "#16a34a", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#94a3b8" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
