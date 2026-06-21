import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/auth/auth-context";

export default function AppLayout() {
  const { isAuthenticated, bootstrapped } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (bootstrapped && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, bootstrapped, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Vistorias do dia" }} />
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
