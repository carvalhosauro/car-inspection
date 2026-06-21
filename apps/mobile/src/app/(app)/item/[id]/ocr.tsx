import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { EvidenceDto, ProofKind } from "@vistoria/contracts";
import { useApiClient } from "@/lib/api";
import { signAndUpload } from "@/lib/upload";
import { buildIdempotencyKey } from "@/lib/idempotency";
import { Screen } from "@/components/Screen";

// The ocr param picks which field we read. Defaults to plate.
function ocrKindFrom(kind: string | undefined): "ocr_plate" | "ocr_km" {
  return kind === "ocr_km" ? "ocr_km" : "ocr_plate";
}
function valueFieldFor(kind: "ocr_plate" | "ocr_km"): "plate" | "km" {
  return kind === "ocr_km" ? "km" : "plate";
}

export default function OcrScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: string }>();
  const ocrKind: ProofKind = ocrKindFrom(kind);
  const field = valueFieldFor(ocrKind as "ocr_plate" | "ocr_km");
  const client = useApiClient();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function readValueFrom(evi: EvidenceDto): string {
    const v = evi.value as Record<string, unknown> | null;
    const raw = v ? v[field] : undefined;
    return raw === undefined || raw === null ? "" : String(raw);
  }

  async function capture() {
    setError(null);
    setBusy(true);
    try {
      const shot = await cameraRef.current?.takePictureAsync();
      const localUri = shot?.uri ?? "file:///tmp/original.jpg";
      const filePath = await signAndUpload(localUri, (b) => client.uploads.sign(b));
      const result = await client.evidences.create(id, {
        kind: ocrKind,
        filePath,
        idempotencyKey: buildIdempotencyKey(id, ocrKind, attempt),
      });
      setText(readValueFrom(result));
      // bump so a re-capture is a fresh evidence, not a deduped stale read
      setAttempt((a) => a + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha na leitura");
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const value: Record<string, unknown> =
        field === "km" ? { km: Number(text) } : { plate: text };
      await client.evidences.create(id, {
        kind: ocrKind,
        value,
        idempotencyKey: buildIdempotencyKey(id, ocrKind, attempt),
      });
      setAttempt((a) => a + 1);
      setConfirmed(true);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao confirmar");
    } finally {
      setBusy(false);
    }
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
        <Text>Precisamos da câmera para a leitura.</Text>
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

      <Text style={styles.label}>{field === "km" ? "Hodômetro (km)" : "Placa"}</Text>
      <TextInput
        testID="ocr-value"
        style={styles.input}
        value={text}
        onChangeText={setText}
        autoCapitalize="characters"
        keyboardType={field === "km" ? "number-pad" : "default"}
        placeholder="Capture para preencher"
      />

      <Pressable testID="capture" style={styles.button} onPress={capture} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Capturar e ler</Text>}
      </Pressable>
      <Pressable
        testID="confirm"
        style={[styles.button, styles.confirm]}
        onPress={confirm}
        disabled={busy || text.length === 0 || confirmed}
      >
        <Text style={styles.buttonText}>Confirmar valor</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: { height: 260, borderRadius: 12, overflow: "hidden", backgroundColor: "#000" },
  camera: { flex: 1 },
  label: { fontSize: 14, color: "#475569" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 18 },
  error: { color: "#c0392b" },
  button: { backgroundColor: "#1d4ed8", borderRadius: 8, padding: 14, alignItems: "center" },
  confirm: { backgroundColor: "#16a34a" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
