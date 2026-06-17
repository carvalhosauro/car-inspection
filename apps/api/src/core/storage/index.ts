import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../../env.js";

let client: SupabaseClient | undefined;
function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export interface SignedUpload {
  filePath: string;
  signedUrl: string;
  token: string;
}

/** Returns a one-time signed URL the mobile app uploads the photo bytes to. */
export async function signUploadUrl(filePath: string): Promise<SignedUpload> {
  const { data, error } = await supabase()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(filePath);
  if (error || !data) {
    throw new Error(`Storage sign failed: ${error?.message ?? "no data"}`);
  }
  return { filePath: data.path, signedUrl: data.signedUrl, token: data.token };
}

/** Downloads the stored object as raw bytes (for Vision). */
export async function downloadBytes(filePath: string): Promise<Buffer> {
  const { data, error } = await supabase()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .download(filePath);
  if (error || !data) {
    throw new Error(`Storage download failed: ${error?.message ?? "no data"}`);
  }
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
