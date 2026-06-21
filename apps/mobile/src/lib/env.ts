/**
 * Reads the API base URL injected at build time by Expo.
 * EXPO_PUBLIC_* vars are inlined into the JS bundle by Metro.
 */
export function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set. Copy apps/mobile/.env.example to apps/mobile/.env and set it.",
    );
  }
  return url;
}
