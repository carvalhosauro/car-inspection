import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import InspectionDetail from "./[id]";

const base: InspectionDto = {
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

const mockGet = jest.fn(async () => base);
const mockStart = jest.fn(async () => ({ ...base, status: "em_andamento" as const }));
const mockPush = jest.fn();

jest.mock("@/lib/api", () => ({
  useApiClient: () => ({ inspections: { get: mockGet, start: mockStart } }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({ id: "insp-1" }),
}));

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("InspectionDetail", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockStart.mockClear();
    mockPush.mockClear();
  });

  it("calls start then navigates to the checklist on iniciar", async () => {
    wrap(<InspectionDetail />);
    await waitFor(() => expect(mockGet).toHaveBeenCalledWith("insp-1"));
    fireEvent.press(await screen.findByTestId("start-inspection"));
    await waitFor(() => expect(mockStart).toHaveBeenCalledWith("insp-1"));
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/inspection/insp-1/checklist"),
    );
  });
});
