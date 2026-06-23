import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createWebApi, ApiError } from "./web-api";
import { SESSION_COOKIE, decodeSession } from "./session";
import { getApiUrl } from "./env";

function guardApi<T extends object>(api: T): T {
  return new Proxy(api, {
    get(target, prop) {
      const val = target[prop as keyof T];
      if (val && typeof val === "object") return guardApi(val as object);
      if (typeof val === "function") {
        return async (...args: unknown[]) => {
          try {
            return await (val as (...a: unknown[]) => unknown)(...args);
          } catch (e) {
            if (e instanceof ApiError && e.status === 401) redirect("/login");
            throw e;
          }
        };
      }
      return val;
    },
  });
}

/** Server api-client: the access token comes from the request session cookie. */
export async function serverApi() {
  const store = await cookies();
  const session = decodeSession(store.get(SESSION_COOKIE)?.value);
  return guardApi(createWebApi(getApiUrl(), () => session?.accessToken ?? null));
}

export async function getServerSession() {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}
