import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import type { InspectionItemDto } from "@vistoria/contracts";
import JustifyScreen from "./[id]/justify";

const child: InspectionItemDto = {
  id: "child-1",
  inspectionId: "insp-1",
  checklistItemId: null,
  parentItemId: "item-1",
  order: 1,
  labelSnapshot: "Avaria",
  requirementsSnapshot: [{ kind: "photo", required: true, config: null }],
  status: "pendente",
  justification: null,
  evidences: [],
};

const mockUpdate = jest.fn(async () => ({}) as InspectionItemDto);
const mockCreateChild = jest.fn(async () => child);
const mockPush = jest.fn();

jest.mock("@/lib/api", () => ({
  useApiClient: () => ({ inspectionItems: { update: mockUpdate, createChild: mockCreateChild } }),
}));
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({ id: "item-1" }),
}));

describe("JustifyScreen", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockCreateChild.mockClear();
    mockPush.mockClear();
  });

  it("marks nao_conforme, creates a child sub-item, and routes to its photo", async () => {
    render(<JustifyScreen />);
    fireEvent.changeText(screen.getByTestId("justification"), "Risco no para-choque");
    fireEvent.press(screen.getByTestId("save-justify"));

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("item-1", {
        status: "nao_conforme",
        justification: "Risco no para-choque",
      }),
    );
    await waitFor(() =>
      expect(mockCreateChild).toHaveBeenCalledWith("item-1", {
        labelSnapshot: "Avaria",
      }),
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/item/child-1/photo"));
  });
});
