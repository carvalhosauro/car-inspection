import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import Home from "./index";

const sample: InspectionDto = {
  id: "insp-1",
  tenantId: "t-1",
  vehicleId: "veh-12345678",
  inspectorId: "u-1",
  templateId: "tpl-1",
  type: "retirada",
  status: "atribuida",
  result: null,
  scheduledFor: null,
  startedAt: null,
  finishedAt: null,
  geoLat: null,
  geoLng: null,
  uniqueCode: null,
  createdAt: "2026-06-10T08:00:00.000Z",
};

const mockMyToday = jest.fn(async () => ({ items: [sample] }));
jest.mock("@/lib/api", () => ({ useApiClient: () => ({ inspections: { myToday: mockMyToday } }) }));
jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("Vistorias do dia", () => {
  it("renders a card per inspection returned by myToday()", async () => {
    wrap(<Home />);
    await waitFor(() => expect(mockMyToday).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("inspection-card-insp-1")).toBeTruthy());
  });
});
