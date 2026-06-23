import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useAuth } from "@/auth/auth-context";
import { colors, spacing } from "@/theme";

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <Pressable
      testID="logout"
      onPress={async () => {
        await logout();
        router.replace("/login");
      }}
      style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
    >
      <Text style={styles.logoutText}>Sair</Text>
    </Pressable>
  );
}

export default function AppLayout() {
  const { isAuthenticated, bootstrapped } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (bootstrapped && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, bootstrapped, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: "700" },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Vistorias do dia", headerRight: () => <LogoutButton /> }}
      />
      <Stack.Screen name="history" options={{ title: "Histórico" }} />
      <Stack.Screen name="inspection/[id]" options={{ title: "Vistoria" }} />
      <Stack.Screen name="inspection/[id]/checklist" options={{ title: "Checklist" }} />
      <Stack.Screen name="inspection/[id]/review" options={{ title: "Revisão" }} />
      <Stack.Screen name="inspection/[id]/finish" options={{ title: "Concluir" }} />
      <Stack.Screen name="item/[id]/photo" options={{ title: "Foto" }} />
      <Stack.Screen name="item/[id]/ocr" options={{ title: "Leitura" }} />
      <Stack.Screen name="item/[id]/justify" options={{ title: "Não conformidade" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logout: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  pressed: { opacity: 0.6 },
  logoutText: { color: colors.primary, fontSize: 15, fontWeight: "600" },
});
