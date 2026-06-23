import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import History from "./history";

const sample: InspectionDto = {
  id: "insp-9",
  tenantId: "t-1",
  vehicleId: "veh-99999999",
  inspectorId: "u-1",
  templateId: "tpl-1",
  type: "devolucao",
  status: "concluida",
  result: "conforme",
  scheduledFor: null,
  startedAt: "2026-06-09T08:00:00.000Z",
  finishedAt: "2026-06-09T09:00:00.000Z",
  geoLat: -3.1,
  geoLng: -60.0,
  uniqueCode: "VST-demo-abc",
  createdAt: "2026-06-09T07:00:00.000Z",
};

const mockHistory = jest.fn(async () => ({ items: [sample] }));
jest.mock("@/lib/api", () => ({ useApiClient: () => ({ inspections: { history: mockHistory } }) }));
jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("History", () => {
  it("renders a card per past inspection", async () => {
    wrap(<History />);
    await waitFor(() => expect(mockHistory).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("inspection-card-insp-9")).toBeTruthy());
  });
});
