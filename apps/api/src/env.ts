import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

// Load .env from repo root (works from apps/api and monorepo root)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
    STORAGE_DRIVER: z.enum(["supabase", "local"]).default("local"),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_KEY: z.string().min(1).optional(),
    SUPABASE_STORAGE_BUCKET: z.string().default("vistoria-photos"),
    LOCAL_STORAGE_DIR: z.string().default("./storage"),
    API_PUBLIC_URL: z.string().url().optional(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    PORT: z.coerce.number().int().positive().default(3333),
  })
  .superRefine((data, ctx) => {
    if (data.STORAGE_DRIVER === "supabase") {
      if (!data.SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SUPABASE_URL is required when STORAGE_DRIVER=supabase",
          path: ["SUPABASE_URL"],
        });
      }
      if (!data.SUPABASE_SERVICE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SUPABASE_SERVICE_KEY is required when STORAGE_DRIVER=supabase",
          path: ["SUPABASE_SERVICE_KEY"],
        });
      }
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  return parsed.data;
}

let _env: AppEnv | undefined;

/** @internal test helper */
export function resetEnvCache(): void {
  _env = undefined;
}

export function getEnv(): AppEnv {
  if (!_env) _env = loadEnv();
  return _env;
}

// Alias for convenience — evaluated lazily via getter
export const env = new Proxy({} as AppEnv, {
  get(_target, prop) {
    if (typeof prop !== "string") return undefined;
    return getEnv()[prop as keyof AppEnv];
  },
});
