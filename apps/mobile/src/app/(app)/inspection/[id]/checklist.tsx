import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { ItemRow } from "@/components/ItemRow";
import { ProgressBar } from "@/components/ProgressBar";

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

  // Only top-level items count toward progress; children are extra avaria photos.
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
        renderItem={({ item }) => (
          <ItemRow item={item} onPress={() => router.push(`/item/${item.id}/photo`)} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  reviewBtn: { alignSelf: "flex-end", paddingVertical: 4 },
  reviewText: { color: "#1d4ed8", fontWeight: "600" },
});
