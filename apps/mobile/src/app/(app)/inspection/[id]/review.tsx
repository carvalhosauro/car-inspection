import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { colors, radius, spacing } from "@/theme";
import { ITEM_STATUS_LABEL, ITEM_STATUS_TONE } from "@/theme/status";

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
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
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
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => router.push(`/item/${item.id}/photo`)}
            >
              <Text style={styles.rowLabel}>{item.labelSnapshot}</Text>
              <StatusBadge label={ITEM_STATUS_LABEL[item.status]} tone={ITEM_STATUS_TONE[item.status]} />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />

      <Button
        testID="finish-button"
        title={canFinish ? "Concluir vistoria" : "Resolva os pendentes"}
        variant="success"
        disabled={!canFinish}
        onPress={() => router.push(`/inspection/${id}/finish`)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: colors.text },
  summary: { fontSize: 14, color: colors.textMuted },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  pressed: { opacity: 0.9 },
  rowLabel: { fontSize: 15, color: colors.text, fontWeight: "600", flexShrink: 1 },
});
