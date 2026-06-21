import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import type { InspectionDto } from "@vistoria/contracts";
import Finish from "./[id]/finish";

const finished: InspectionDto = {
  id: "insp-1",
  tenantId: "t-1",
  vehicleId: "veh-1",
  inspectorId: "u-1",
  templateId: "tpl-1",
  type: "retirada",
  status: "concluida",
  result: "conforme",
  scheduledFor: null,
  startedAt: "2026-06-10T08:00:00.000Z",
  finishedAt: "2026-06-10T09:00:00.000Z",
  geoLat: -3.1,
  geoLng: -60.0,
  uniqueCode: "VST-demo-01HXY",
  createdAt: "2026-06-10T07:00:00.000Z",
};

const mockFinish = jest.fn(async () => finished);
jest.mock("@/lib/api", () => ({ useApiClient: () => ({ inspections: { finish: mockFinish } }) }));
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: "insp-1" }),
}));

describe("Finish", () => {
  it("captures geo, posts finish, and shows the uniqueCode", async () => {
    render(<Finish />);
    fireEvent.press(screen.getByTestId("finish-now"));
    await waitFor(() =>
      expect(mockFinish).toHaveBeenCalledWith("insp-1", { geoLat: -3.1, geoLng: -60.0 }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("unique-code").props.children).toBe("VST-demo-01HXY"),
    );
  });
});
