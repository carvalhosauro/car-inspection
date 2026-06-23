import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";

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
        <ActivityIndicator />
      </Screen>
    );
  }

  const started = inspection.status !== "atribuida";

  return (
    <Screen>
      <Text style={styles.title}>Vistoria {inspection.type}</Text>
      <Text style={styles.meta}>Status: {inspection.status}</Text>
      <Text style={styles.meta}>Veículo: {inspection.vehicleId}</Text>

      {started ? (
        <Pressable
          testID="open-checklist"
          style={styles.button}
          onPress={() => router.push(`/inspection/${id}/checklist`)}
        >
          <Text style={styles.buttonText}>Abrir checklist</Text>
        </Pressable>
      ) : (
        <Pressable
          testID="start-inspection"
          style={styles.button}
          onPress={() => startMutation.mutate()}
          disabled={startMutation.isPending}
        >
          {startMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar vistoria</Text>
          )}
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  meta: { fontSize: 15, color: "#475569" },
  button: { marginTop: 12, backgroundColor: "#1d4ed8", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
