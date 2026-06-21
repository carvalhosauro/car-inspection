import { Pressable, StyleSheet, Text, View } from "react-native";
import type { InspectionItemDto } from "@vistoria/contracts";

const STATUS_LABEL: Record<InspectionItemDto["status"], string> = {
  pendente: "Pendente",
  conforme: "Conforme",
  nao_conforme: "Não conforme",
};

const STATUS_COLOR: Record<InspectionItemDto["status"], string> = {
  pendente: "#a16207",
  conforme: "#16a34a",
  nao_conforme: "#c0392b",
};

export function ItemRow({
  item,
  onPress,
}: {
  item: InspectionItemDto;
  onPress: () => void;
}) {
  return (
    <Pressable testID={`item-row-${item.id}`} style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.label}>{item.labelSnapshot}</Text>
        <Text style={[styles.status, { color: STATUS_COLOR[item.status] }]}>
          {STATUS_LABEL[item.status]}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14,
  },
  left: { gap: 2 },
  label: { fontSize: 16 },
  status: { fontSize: 13, fontWeight: "600" },
  chevron: { fontSize: 24, color: "#94a3b8" },
});
