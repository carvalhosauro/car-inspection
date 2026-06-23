import { env } from "../../env.js";
import {
  downloadBytesLocal,
  initLocalStorage,
  signUploadUrlLocal,
} from "./local.js";
import {
  downloadBytesSupabase,
  signUploadUrlSupabase,
} from "./supabase.js";
import type { SignedUpload } from "./types.js";

export type { SignedUpload } from "./types.js";

export async function initStorage(): Promise<void> {
  if (env.STORAGE_DRIVER === "local") {
    await initLocalStorage();
  }
}

/** Returns a one-time signed URL the mobile app uploads the photo bytes to. */
export async function signUploadUrl(filePath: string): Promise<SignedUpload> {
  if (env.STORAGE_DRIVER === "supabase") {
    return signUploadUrlSupabase(filePath);
  }
  return signUploadUrlLocal(filePath);
}

/** Downloads the stored object as raw bytes (for Vision). */
export async function downloadBytes(filePath: string): Promise<Buffer> {
  if (env.STORAGE_DRIVER === "supabase") {
    return downloadBytesSupabase(filePath);
  }
  return downloadBytesLocal(filePath);
}
