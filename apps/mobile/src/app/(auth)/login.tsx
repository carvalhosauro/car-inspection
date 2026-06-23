import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/auth-context";
import { Button } from "@/components/Button";
import { colors, radius, shadow, spacing } from "@/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoMark}>V</Text>
            </View>
            <Text style={styles.title}>Vistoria</Text>
            <Text style={styles.subtitle}>Registre as vistorias do seu dia</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              testID="email"
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSubtle}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.fieldLabel}>Senha</Text>
            <TextInput
              testID="password"
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textSubtle}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? (
              <Text testID="error" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <Button testID="submit" title="Entrar" onPress={onSubmit} loading={loading} style={styles.submit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: spacing.xl, gap: spacing.xl },
  brand: { alignItems: "center", gap: spacing.xs },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  logoMark: { color: colors.primaryText, fontSize: 32, fontWeight: "800" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadow.card,
  },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.textMuted, marginTop: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
  error: { color: colors.danger, fontSize: 14, marginTop: spacing.xs },
  submit: { marginTop: spacing.md },
});
