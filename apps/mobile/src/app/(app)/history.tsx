import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { InspectionCard } from "@/components/InspectionCard";
import { colors, spacing } from "@/theme";

export default function History() {
  const client = useApiClient();
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me", "inspections", "history"],
    queryFn: () => client.inspections.history(),
  });

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>Não foi possível carregar o histórico.</Text>
        </View>
      </Screen>
    );
  }

  const items: InspectionDto[] = data?.items ?? [];

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={items.length === 0 && styles.emptyWrap}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sem histórico</Text>
            <Text style={styles.emptyText}>Você ainda não concluiu vistorias.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <InspectionCard
            inspection={item}
            onPress={() => router.push(`/inspection/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 15, color: colors.text, textAlign: "center" },
  emptyWrap: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", gap: spacing.xs, paddingVertical: spacing.x2 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
