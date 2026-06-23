import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { Screen } from "@/components/Screen";
import { InspectionCard } from "@/components/InspectionCard";

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
        <ActivityIndicator />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Text>Não foi possível carregar o histórico.</Text>
      </Screen>
    );
  }

  const items: InspectionDto[] = data?.items ?? [];

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<Text>Sem vistorias anteriores.</Text>}
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
