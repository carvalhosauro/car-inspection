import { Pressable, StyleSheet, Text, View } from "react-native";
import type { InspectionDto } from "@vistoria/contracts";

const STATUS_LABEL: Record<InspectionDto["status"], string> = {
  atribuida: "Atribuída",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
};

const TYPE_LABEL: Record<InspectionDto["type"], string> = {
  retirada: "Retirada",
  devolucao: "Devolução",
  periodica: "Periódica",
};

export function InspectionCard({
  inspection,
  onPress,
}: {
  inspection: InspectionDto;
  onPress: () => void;
}) {
  return (
    <Pressable testID={`inspection-card-${inspection.id}`} style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.type}>{TYPE_LABEL[inspection.type]}</Text>
        <Text style={styles.status}>{STATUS_LABEL[inspection.status]}</Text>
      </View>
      <Text style={styles.meta}>Veículo: {inspection.vehicleId.slice(0, 8)}</Text>
      {inspection.uniqueCode ? (
        <Text style={styles.code}>Código: {inspection.uniqueCode}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 14, gap: 4 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  type: { fontSize: 16, fontWeight: "700" },
  status: { fontSize: 13, color: "#475569" },
  meta: { fontSize: 13, color: "#64748b" },
  code: { fontSize: 13, color: "#16a34a", fontWeight: "600" },
});
