import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { EvidenceDto } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { signAndUpload } from "@/lib/upload";
import { buildIdempotencyKey } from "@/lib/idempotency";
import { Screen } from "@/components/Screen";
import { VerdictBanner } from "@/components/VerdictBanner";

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
        <ActivityIndicator />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Text>Precisamos da câmera para registrar a foto.</Text>
        <Pressable testID="grant" style={styles.button} onPress={() => requestPermission()}>
          <Text style={styles.buttonText}>Permitir câmera</Text>
        </Pressable>
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

      {evidence?.accepted ? (
        <Pressable testID="next" style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Próximo item</Text>
        </Pressable>
      ) : (
        <Pressable testID="capture" style={styles.button} onPress={capture} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Capturar</Text>}
        </Pressable>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: { height: 320, borderRadius: 12, overflow: "hidden", backgroundColor: "#000" },
  camera: { flex: 1 },
  error: { color: "#c0392b" },
  button: { backgroundColor: "#1d4ed8", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
