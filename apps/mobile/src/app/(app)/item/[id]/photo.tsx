import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { EvidenceDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { signAndUpload } from "@/lib/upload";
import { buildIdempotencyKey } from "@/lib/idempotency";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { VerdictBanner } from "@/components/VerdictBanner";
import { colors, radius, spacing } from "@/theme";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useApiClient();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function capture() {
    setError(null);
    setBusy(true);
    try {
      const shot = await cameraRef.current?.takePictureAsync();
      const localUri = shot?.uri ?? "file:///tmp/original.jpg";
      const filePath = await signAndUpload(localUri, (b) => client.uploads.sign(b));
      const result = await client.evidences.create(id, {
        kind: "photo",
        filePath,
        idempotencyKey: buildIdempotencyKey(id, "photo", attempt),
      });
      setEvidence(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar a foto");
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    setAttempt((a) => a + 1);
    setEvidence(null);
  }

  if (!permission) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.permText}>Precisamos da câmera para registrar a foto.</Text>
          <Button testID="grant" title="Permitir câmera" onPress={() => requestPermission()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {evidence ? (
        <VerdictBanner
          accepted={evidence.accepted}
          reason={
            typeof evidence.validation?.reason === "string"
              ? evidence.validation.reason
              : null
          }
          onRetry={retry}
        />
      ) : null}

      <View style={styles.spacer} />

      {evidence?.accepted ? (
        <Button testID="next" title="Próximo item" onPress={() => router.back()} />
      ) : (
        <Button testID="capture" title="Capturar" loading={busy} onPress={capture} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  permText: { fontSize: 15, color: colors.text, textAlign: "center" },
  cameraWrap: { height: 340, borderRadius: radius.lg, overflow: "hidden", backgroundColor: "#000" },
  camera: { flex: 1 },
  error: { color: colors.danger, fontSize: 14 },
  spacer: { flex: 1 },
});
