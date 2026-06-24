import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@vistoria/contracts", "@vistoria/api-client", "@vistoria/ui"],
  typedRoutes: true,
  // Trace deps from the monorepo root (required for pnpm workspaces on Vercel).
  outputFileTracingRoot: rootDir,
  // eslint-config-next@15 is incompatible with ESLint 9 in CI; lint runs via `pnpm lint`.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
