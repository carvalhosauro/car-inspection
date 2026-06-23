import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/auth/auth-context";
import { queryClient } from "@/lib/query-client";
import { colors } from "@/theme";

function AuthGate() {
  const { isAuthenticated, bootstrapped } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!bootstrapped) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, bootstrapped, segments, router]);

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AuthGate />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
