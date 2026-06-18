import { cookies } from "next/headers";
import { createWebApi } from "./web-api";
import { SESSION_COOKIE, decodeSession } from "./session";
import { getApiUrl } from "./env";

/** Server api-client: the access token comes from the request session cookie. */
export async function serverApi() {
  const store = await cookies();
  const session = decodeSession(store.get(SESSION_COOKIE)?.value);
  return createWebApi(getApiUrl(), () => session?.accessToken ?? null);
}

export async function getServerSession() {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}
