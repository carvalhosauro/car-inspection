export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

export type TokenGetter = () => string | null | Promise<string | null>;

export function createHttp(baseUrl: string, getToken: TokenGetter) {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      throw new ApiError(res.status, data?.code ?? "unknown", data?.message ?? res.statusText, data?.details);
    }
    return data as T;
  }
  return {
    get: <T>(p: string) => request<T>("GET", p),
    post: <T>(p: string, b?: unknown) => request<T>("POST", p, b),
    patch: <T>(p: string, b?: unknown) => request<T>("PATCH", p, b),
    del: <T>(p: string) => request<T>("DELETE", p),
  };
}
