import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

/** Response shape of `POST /v1/uploads/sign` — signedUrl is absolute with the token in its query. */
export interface SignedUpload {
  filePath: string;
  signedUrl: string;
  token: string;
}

/** Injected so the helper stays decoupled from the api-client surface and is testable. */
export type SignFn = (body: { contentType: string }) => Promise<SignedUpload>;

/**
 * Resize a captured photo, ask the API for a signed upload URL, upload the bytes
 * straight to Supabase Storage, and return the stored `filePath` (the only thing the API keeps).
 */
export async function signAndUpload(localUri: string, sign: SignFn): Promise<string> {
  // 1. shrink to keep uploads fast and within Vision input limits
  const resized = await manipulateAsync(
    localUri,
    [{ resize: { width: 1280 } }],
    { compress: 0.7, format: SaveFormat.JPEG },
  );

  // 2. get a signed upload URL (absolute, token embedded) + the filePath the backend references
  const { signedUrl, filePath } = await sign({ contentType: "image/jpeg" });

  // 3. upload as multipart/form-data, mirroring supabase-js uploadToSignedUrl's Blob branch:
  //    a `cacheControl` field + the file in the empty-named field, with an x-upsert header.
  //    RN's { uri, name, type } descriptor is the file part. Do NOT set content-type
  //    manually — the runtime adds the multipart boundary. (No fetch(uri).blob(): it is
  //    unreliable on Android/Expo Go.)
  const form = new FormData();
  form.append("cacheControl", "3600");
  form.append("", { uri: resized.uri, name: "photo.jpg", type: "image/jpeg" } as unknown as Blob);

  const putRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "x-upsert": "false" },
    body: form,
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed (status ${putRes.status})`);
  }

  return filePath;
}
