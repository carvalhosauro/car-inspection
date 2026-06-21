import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { InspectionCard } from "@/components/InspectionCard";

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
        <ActivityIndicator />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Text>Não foi possível carregar as vistorias.</Text>
        <Pressable testID="retry-today" onPress={() => refetch()}>
          <Text style={styles.link}>Tentar novamente</Text>
        </Pressable>
      </Screen>
    );
  }

  const items: InspectionDto[] = data?.items ?? [];

  return (
    <Screen>
      <Pressable testID="open-history" onPress={() => router.push("/history")}>
        <Text style={styles.link}>Ver histórico</Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<Text>Nenhuma vistoria para hoje.</Text>}
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
  link: { color: "#1d4ed8", fontWeight: "600" },
});
