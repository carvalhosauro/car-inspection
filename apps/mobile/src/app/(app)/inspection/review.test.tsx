import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import Review from "./[id]/review";

const items: InspectionItemDto[] = [
  {
    id: "item-1",
    inspectionId: "insp-1",
    checklistItemId: "ci-1",
    parentItemId: null,
    order: 1,
    labelSnapshot: "Para-choque",
    requirementsSnapshot: [{ kind: "photo", required: true, config: null }],
    status: "conforme",
    justification: null,
    evidences: [],
  },
  {
    id: "item-2",
    inspectionId: "insp-1",
    checklistItemId: "ci-2",
    parentItemId: null,
    order: 2,
    labelSnapshot: "Hodômetro",
    requirementsSnapshot: [{ kind: "ocr_km", required: true, config: null }],
    status: "pendente",
    justification: null,
    evidences: [],
  },
];

const mockItemsFn = jest.fn(async () => items);
jest.mock("@/lib/api", () => ({ useApiClient: () => ({ inspections: { items: mockItemsFn } }) }));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({ id: "insp-1" }),
}));

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("Review", () => {
  it("lists pending items and disables finish while any remain", async () => {
    wrap(<Review />);
    await waitFor(() => expect(mockItemsFn).toHaveBeenCalledWith("insp-1"));
    await waitFor(() => expect(screen.getByTestId("pending-item-2")).toBeTruthy());
    expect(screen.getByTestId("finish-button").props.accessibilityState.disabled).toBe(true);
  });
});
