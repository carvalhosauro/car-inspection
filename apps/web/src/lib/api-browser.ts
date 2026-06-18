"use client";

import { createWebApi } from "./web-api";
import { getAccessToken } from "./token-store";
import { getApiUrl } from "./env";

/** Browser api-client: the access token is held in memory (token-store). */
export function browserApi() {
  return createWebApi(getApiUrl(), () => getAccessToken());
}
