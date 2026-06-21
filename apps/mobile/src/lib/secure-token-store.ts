import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "vistoria.refreshToken";

/** Persist the refresh token in the device keychain/keystore. */
export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

/** Read the refresh token, or null when none is stored. */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/** Remove the refresh token (logout). */
export async function clearRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
