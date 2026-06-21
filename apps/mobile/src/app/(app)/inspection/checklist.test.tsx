import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InspectionItemDto } from "@vistoria/contracts";
import Checklist from "./[id]/checklist";

const items: InspectionItemDto[] = [
  {
    id: "item-1",
    inspectionId: "insp-1",
    checklistItemId: "ci-1",
    parentItemId: null,
    order: 1,
    labelSnapshot: "Para-choque dianteiro",
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

describe("Checklist", () => {
  it("shows progress (1 of 2 done) and a row per item", async () => {
    wrap(<Checklist />);
    await waitFor(() => expect(mockItemsFn).toHaveBeenCalledWith("insp-1"));
    await waitFor(() =>
      expect(screen.getByTestId("progress-label").props.children).toEqual([1, "/", 2, " concluídos"]),
    );
    expect(screen.getByTestId("item-row-item-1")).toBeTruthy();
    expect(screen.getByTestId("item-row-item-2")).toBeTruthy();
  });
});
