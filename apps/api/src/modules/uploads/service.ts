import { newId } from "@vistoria/db";
import { signUploadUrl } from "../../core/storage/index";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface SignResult {
  filePath: string;
  signedUrl: string;
  token: string;
}

/** Builds a tenant-scoped storage path and returns a signed upload URL. */
export async function sign(
  tenantId: string,
  contentType: string,
): Promise<SignResult> {
  const ext = EXT[contentType] ?? "bin";
  const filePath = `${tenantId}/${newId()}.${ext}`;
  return signUploadUrl(filePath);
}
