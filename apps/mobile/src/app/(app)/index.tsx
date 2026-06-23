import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { InspectionCard } from "@/components/InspectionCard";
import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";

export default function Home() {
  const client = useApiClient();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me", "inspections", "today"],
    queryFn: () => client.inspections.myToday(),
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
          <Text style={styles.errorTitle}>Não foi possível carregar as vistorias.</Text>
          <Button testID="retry-today" title="Tentar novamente" variant="secondary" onPress={() => refetch()} />
        </View>
      </Screen>
    );
  }

  const items: InspectionDto[] = data?.items ?? [];

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>
            {items.length} {items.length === 1 ? "vistoria atribuída" : "vistorias atribuídas"}
          </Text>
        </View>
        <Pressable
          testID="open-history"
          onPress={() => router.push("/history")}
          style={({ pressed }) => [styles.historyBtn, pressed && styles.pressed]}
        >
          <Text style={styles.historyText}>Histórico</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={items.length === 0 && styles.emptyWrap}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Tudo certo por aqui</Text>
            <Text style={styles.emptyText}>Nenhuma vistoria para hoje.</Text>
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
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  historyBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  historyText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  errorTitle: { fontSize: 15, color: colors.text, textAlign: "center" },
  emptyWrap: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", gap: spacing.xs, paddingVertical: spacing.x2 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
