import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../../env.js";
import type { SignedUpload } from "./types.js";

let client: SupabaseClient | undefined;

function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export async function signUploadUrlSupabase(filePath: string): Promise<SignedUpload> {
  const { data, error } = await supabase()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(filePath);
  if (error || !data) {
    throw new Error(`Storage sign failed: ${error?.message ?? "no data"}`);
  }
  return { filePath: data.path, signedUrl: data.signedUrl, token: data.token };
}

export async function downloadBytesSupabase(filePath: string): Promise<Buffer> {
  const { data, error } = await supabase()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .download(filePath);
  if (error || !data) {
    throw new Error(`Storage download failed: ${error?.message ?? "no data"}`);
  }
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
