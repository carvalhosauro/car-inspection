import { defineConfig } from "drizzle-kit";
import { createPgPoolConfig } from "./src/connection";

const poolConfig = createPgPoolConfig(process.env.DATABASE_URL!, 1);

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: poolConfig.connectionString,
    ssl: poolConfig.ssl || undefined,
  },
});
