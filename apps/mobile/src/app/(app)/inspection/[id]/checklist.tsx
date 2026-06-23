import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { colors, radius, shadow, spacing } from "@/theme";
import { ITEM_STATUS_LABEL, ITEM_STATUS_TONE } from "@/theme/status";

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
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const topLevel: InspectionItemDto[] = data.filter((i) => i.parentItemId === null);
  const done = topLevel.filter((i) => i.status !== "pendente").length;

  return (
    <Screen>
      <View style={styles.progressCard}>
        <ProgressBar done={done} total={topLevel.length} />
      </View>
      <Pressable
        testID="go-review"
        style={({ pressed }) => [styles.reviewBtn, pressed && styles.pressed]}
        onPress={() => router.push(`/inspection/${id}/review`)}
      >
        <Text style={styles.reviewText}>Revisar →</Text>
      </Pressable>
      <FlatList
        data={topLevel}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => {
          const ocrKind = hasKind(item, "ocr_km") ? "ocr_km" : "ocr_plate";
          const showOcr = hasKind(item, "ocr_plate") || hasKind(item, "ocr_km");
          return (
            <View testID={`item-row-${item.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.label}>{item.labelSnapshot}</Text>
                <StatusBadge label={ITEM_STATUS_LABEL[item.status]} tone={ITEM_STATUS_TONE[item.status]} />
              </View>
              <View style={styles.actions}>
                <Pressable
                  testID={`photo-${item.id}`}
                  style={({ pressed }) => [styles.action, styles.primary, pressed && styles.pressed]}
                  onPress={() => router.push(`/item/${item.id}/photo`)}
                >
                  <Text style={styles.actionText}>Foto</Text>
                </Pressable>
                {showOcr ? (
                  <Pressable
                    testID={`ocr-${item.id}`}
                    style={({ pressed }) => [styles.action, styles.primary, pressed && styles.pressed]}
                    onPress={() => router.push(`/item/${item.id}/ocr?kind=${ocrKind}`)}
                  >
                    <Text style={styles.actionText}>Leitura</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  testID={`justify-${item.id}`}
                  style={({ pressed }) => [styles.action, styles.danger, pressed && styles.pressed]}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  progressCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.card,
  },
  reviewBtn: { alignSelf: "flex-end", paddingVertical: spacing.xs },
  reviewText: { color: colors.primary, fontWeight: "700", fontSize: 15 },
  pressed: { opacity: 0.8 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  cardHeader: { gap: spacing.sm },
  label: { fontSize: 16, fontWeight: "700", color: colors.text },
  actions: { flexDirection: "row", gap: spacing.sm },
  action: { borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  actionText: { color: colors.primaryText, fontWeight: "700", fontSize: 14 },
});
