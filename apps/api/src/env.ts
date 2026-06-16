import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3333),
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
