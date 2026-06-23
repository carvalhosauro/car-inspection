import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../../env.js";
import type { SignedUpload } from "./types.js";

interface PendingUpload {
  filePath: string;
  expiresAt: number;
}

const pending = new Map<string, PendingUpload>();
const TTL_MS = 60 * 60 * 1000;

function storageRoot(): string {
  return path.resolve(env.LOCAL_STORAGE_DIR);
}

function publicBaseUrl(): string {
  return env.API_PUBLIC_URL ?? `http://localhost:${env.PORT}`;
}

async function ensureDir(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
}

export async function signUploadUrlLocal(filePath: string): Promise<SignedUpload> {
  const token = randomBytes(24).toString("hex");
  pending.set(token, { filePath, expiresAt: Date.now() + TTL_MS });
  return {
    filePath,
    signedUrl: `${publicBaseUrl()}/v1/uploads/local/${token}`,
    token,
  };
}

export async function consumeLocalUpload(token: string, body: Buffer): Promise<string> {
  const entry = pending.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    pending.delete(token);
    throw new Error("Upload token expired or invalid");
  }
  pending.delete(token);

  const fullPath = path.join(storageRoot(), entry.filePath);
  await ensureDir(fullPath);
  await writeFile(fullPath, body);
  return entry.filePath;
}

export async function downloadBytesLocal(filePath: string): Promise<Buffer> {
  const fullPath = path.join(storageRoot(), filePath);
  return readFile(fullPath);
}

export async function initLocalStorage(): Promise<void> {
  await mkdir(storageRoot(), { recursive: true });
}

/** Stable token for tests — not used in production flow. */
export function localUploadTokenFor(filePath: string): string {
  return createHash("sha256").update(filePath).digest("hex").slice(0, 48);
}
