import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import type { CreateEvidenceInput, EvidenceDto } from "@vistoria/contracts";
import OcrScreen from "./[id]/ocr";

const read: EvidenceDto = {
  id: "evi-2",
  inspectionItemId: "item-2",
  requirementId: null,
  kind: "ocr_plate",
  filePath: "tenant/insp/plate.jpg",
  value: { plate: "ABC1D23" },
  validation: { confidence: 0.91 },
  accepted: true,
  createdAt: "2026-06-10T12:00:00.000Z",
};

const mockSign = jest.fn(async () => ({ filePath: "tenant/insp/plate.jpg", signedUrl: "https://s/put", token: "tok" }));
const mockCreate = jest.fn(async (_itemId: string, _body: CreateEvidenceInput) => read);

jest.mock("@/lib/api", () => ({
  useApiClient: () => ({ uploads: { sign: mockSign }, evidences: { create: mockCreate } }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({ id: "item-2", kind: "ocr_plate" }),
}));
jest.mock("@/lib/upload", () => ({ signAndUpload: jest.fn(async () => "tenant/insp/plate.jpg") }));

describe("OcrScreen", () => {
  beforeEach(() => mockCreate.mockClear());

  it("prefills the read value and confirms a (possibly corrected) value with a distinct key", async () => {
    render(<OcrScreen />);
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId("ocr-value").props.value).toBe("ABC1D23"));

    // user corrects the plate then confirms
    fireEvent.changeText(screen.getByTestId("ocr-value"), "ABC1D24");
    fireEvent.press(screen.getByTestId("confirm"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(2));
    expect(mockCreate.mock.calls[1][1].value).toEqual({ plate: "ABC1D24" });
    // capture (read) and confirm must not collide on the same idempotency key
    expect(mockCreate.mock.calls[0][1].idempotencyKey).not.toBe(
      mockCreate.mock.calls[1][1].idempotencyKey,
    );
  });

  it("uses a fresh idempotency key on re-capture (no deduped stale read)", async () => {
    render(<OcrScreen />);
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
    fireEvent.press(screen.getByTestId("capture"));
    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(2));
    expect(mockCreate.mock.calls[0][1].idempotencyKey).not.toBe(
      mockCreate.mock.calls[1][1].idempotencyKey,
    );
  });
});
