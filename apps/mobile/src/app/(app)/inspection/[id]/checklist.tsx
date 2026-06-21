import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { ProgressBar } from "@/components/ProgressBar";

function hasKind(item: InspectionItemDto, kind: "ocr_plate" | "ocr_km" | "photo"): boolean {
  return item.requirementsSnapshot.some((r) => r.kind === kind);
}

export default function Checklist() {
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
  const done = topLevel.filter((i) => i.status !== "pendente").length;

  return (
    <Screen>
      <ProgressBar done={done} total={topLevel.length} />
      <Pressable
        testID="go-review"
        style={styles.reviewBtn}
        onPress={() => router.push(`/inspection/${id}/review`)}
      >
        <Text style={styles.reviewText}>Revisar</Text>
      </Pressable>
      <FlatList
        data={topLevel}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const ocrKind = hasKind(item, "ocr_km") ? "ocr_km" : "ocr_plate";
          const showOcr = hasKind(item, "ocr_plate") || hasKind(item, "ocr_km");
          return (
            <View testID={`item-row-${item.id}`} style={styles.card}>
              <Text style={styles.label}>{item.labelSnapshot}</Text>
              <Text style={styles.status}>{item.status}</Text>
              <View style={styles.actions}>
                <Pressable
                  testID={`photo-${item.id}`}
                  style={styles.action}
                  onPress={() => router.push(`/item/${item.id}/photo`)}
                >
                  <Text style={styles.actionText}>Foto</Text>
                </Pressable>
                {showOcr ? (
                  <Pressable
                    testID={`ocr-${item.id}`}
                    style={styles.action}
                    onPress={() => router.push(`/item/${item.id}/ocr?kind=${ocrKind}`)}
                  >
                    <Text style={styles.actionText}>Leitura</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  testID={`justify-${item.id}`}
                  style={[styles.action, styles.danger]}
                  onPress={() => router.push(`/item/${item.id}/justify`)}
                >
                  <Text style={styles.actionText}>Avaria</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  reviewBtn: { alignSelf: "flex-end", paddingVertical: 4 },
  reviewText: { color: "#1d4ed8", fontWeight: "600" },
  card: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, gap: 6 },
  label: { fontSize: 16, fontWeight: "600" },
  status: { fontSize: 13, color: "#475569" },
  actions: { flexDirection: "row", gap: 8 },
  action: { backgroundColor: "#1d4ed8", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  danger: { backgroundColor: "#c0392b" },
  actionText: { color: "#fff", fontWeight: "600" },
});
