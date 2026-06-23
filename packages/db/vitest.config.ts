import { defineConfig } from "vitest/config";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

for (const envPath of [resolve(__dirname, "../../.env"), resolve(__dirname, ".env")]) {
  if (!existsSync(envPath)) continue;
  readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && !(key in process.env)) process.env[key] = value;
    });
  break;
}

export default defineConfig({ test: { environment: "node", testTimeout: 20000 } });
