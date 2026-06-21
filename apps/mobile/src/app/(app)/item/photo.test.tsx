import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import type { EvidenceDto } from "@vistoria/contracts";
import PhotoScreen from "./[id]/photo";

const rejected: EvidenceDto = {
  id: "evi-1",
  inspectionItemId: "item-1",
  requirementId: null,
  kind: "photo",
  filePath: "tenant/insp/photo-1.jpg",
  value: null,
  validation: { accepted: false, reason: "item errado (esperava bumper)" },
  accepted: false,
  createdAt: "2026-06-10T12:00:00.000Z",
};

const mockSign = jest.fn(async () => ({
  filePath: "tenant/insp/photo-1.jpg",
  signedUrl: "https://storage.example/put",
  token: "tok",
}));
const mockCreate = jest.fn(async () => rejected);

jest.mock("@/lib/api", () => ({
  useApiClient: () => ({ uploads: { sign: mockSign }, evidences: { create: mockCreate } }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ id: "item-1" }),
}));
// upload helper resolves to a filePath without touching real fetch.
jest.mock("@/lib/upload", () => ({ signAndUpload: jest.fn(async () => "tenant/insp/photo-1.jpg") }));

describe("PhotoScreen", () => {
  beforeEach(() => mockCreate.mockClear());

  it("shows the IA reject reason after capture", async () => {
    render(<PhotoScreen />);
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("verdict-rejected")).toBeTruthy());
    expect(screen.getByTestId("verdict-rejected")).toBeTruthy();
  });

  it("bumps the attempt when refazer is pressed", async () => {
    render(<PhotoScreen />);
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
    fireEvent.press(await screen.findByTestId("retry"));
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(2));
    const firstKey = mockCreate.mock.calls[0][1].idempotencyKey;
    const secondKey = mockCreate.mock.calls[1][1].idempotencyKey;
    expect(firstKey).not.toBe(secondKey);
  });
});
