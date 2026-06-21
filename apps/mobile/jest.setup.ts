import "@testing-library/react-native";

// Default the build-time API URL so modules that read it at import time
// (e.g. auth/refresh.ts → getApiBaseUrl) don't throw under Jest.
process.env.EXPO_PUBLIC_API_URL ??= "http://localhost:3333";

// expo-secure-store: in-memory map so the token wrapper is testable.
jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    setItemAsync: jest.fn(async (k: string, v: string) => {
      store.set(k, v);
    }),
    getItemAsync: jest.fn(async (k: string) => (store.has(k) ? store.get(k)! : null)),
    deleteItemAsync: jest.fn(async (k: string) => {
      store.delete(k);
    }),
  };
});

// expo-camera: a no-op view + a permissions hook that reports granted.
jest.mock("expo-camera", () => {
  const React = require("react");
  return {
    CameraView: React.forwardRef((props: Record<string, unknown>, _ref: unknown) =>
      React.createElement("CameraView", props, (props as { children?: unknown }).children),
    ),
    useCameraPermissions: () => [{ granted: true }, jest.fn(async () => ({ granted: true }))],
  };
});

// expo-location: fixed coordinates.
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: -3.1, longitude: -60.0 },
  })),
}));

// expo-image-manipulator: echo a fake resized file uri.
jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(async (_uri: string) => ({
    uri: "file:///tmp/resized.jpg",
    width: 1280,
    height: 960,
  })),
  SaveFormat: { JPEG: "jpeg" },
}));
