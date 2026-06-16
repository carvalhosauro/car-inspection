import { buildApp } from "./app";
import { env } from "./env";

async function main() {
  const app = await buildApp();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  // eslint-disable-next-line no-console
  console.log(`API listening on :${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
