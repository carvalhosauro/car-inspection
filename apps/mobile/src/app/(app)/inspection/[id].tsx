import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { colors, radius, shadow, spacing } from "@/theme";
import {
  INSPECTION_STATUS_LABEL,
  INSPECTION_STATUS_TONE,
  INSPECTION_TYPE_LABEL,
} from "@/theme/status";

export default function InspectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useApiClient();
  const router = useRouter();

  const { data: inspection, isLoading } = useQuery({
    queryKey: ["inspection", id],
    queryFn: () => client.inspections.get(id),
  });

  const startMutation = useMutation({
    mutationFn: () => client.inspections.start(id),
    onSuccess: () => router.push(`/inspection/${id}/checklist`),
  });

  if (isLoading || !inspection) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const started = inspection.status !== "atribuida";

  return (
    <Screen>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{INSPECTION_TYPE_LABEL[inspection.type]}</Text>
          <StatusBadge
            label={INSPECTION_STATUS_LABEL[inspection.status]}
            tone={INSPECTION_STATUS_TONE[inspection.status]}
          />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Veículo</Text>
          <Text style={styles.metaValue}>{inspection.vehicleId}</Text>
        </View>
      </View>

      <View style={styles.spacer} />

      {started ? (
        <Button
          testID="open-checklist"
          title="Abrir checklist"
          onPress={() => router.push(`/inspection/${id}/checklist`)}
        />
      ) : (
        <Button
          testID="start-inspection"
          title="Iniciar vistoria"
          loading={startMutation.isPending}
          onPress={() => startMutation.mutate()}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "800", color: colors.text },
  metaRow: { gap: spacing.xs },
  metaLabel: { fontSize: 13, color: colors.textSubtle },
  metaValue: { fontSize: 15, color: colors.text, fontWeight: "600" },
  spacer: { flex: 1 },
});
