import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { LaudoInspection } from "@/lib/web-api";
import { InspectionLaudo } from "./inspection-laudo";

const LAUDO: LaudoInspection = {
  id: "i1",
  tenantId: "t1",
  vehicleId: "v1",
  inspectorId: "u1",
  templateId: "tpl1",
  type: "retirada",
  status: "concluida",
  result: "com_pendencias",
  scheduledFor: null,
  startedAt: "2026-06-10T10:00:00.000Z",
  finishedAt: "2026-06-10T10:30:00.000Z",
  geoLat: -3.1,
  geoLng: -60.0,
  uniqueCode: "VST-demo-abc123",
  createdAt: "2026-06-10T09:00:00.000Z",
  items: [
    {
      id: "it1",
      inspectionId: "i1",
      checklistItemId: "ci1",
      parentItemId: null,
      order: 0,
      labelSnapshot: "Para-choque dianteiro",
      requirementsSnapshot: [{ kind: "photo", required: true, config: null }],
      status: "nao_conforme",
      justification: "Risco profundo",
      evidences: [
        {
          id: "e1",
          inspectionItemId: "it1",
          requirementId: "r1",
          kind: "photo",
          filePath: "https://signed.example/photo1.jpg",
          value: null,
          validation: { accepted: true },
          accepted: true,
          createdAt: "2026-06-10T10:05:00.000Z",
        },
        {
          id: "e2",
          inspectionItemId: "it1",
          requirementId: "r2",
          kind: "ocr_plate",
          filePath: null,
          value: { plate: "ABC1D23" },
          validation: null,
          accepted: true,
          createdAt: "2026-06-10T10:06:00.000Z",
        },
      ],
    },
  ],
};

describe("InspectionLaudo", () => {
  it("renders uniqueCode, geo, item, OCR value and a photo image", () => {
    render(<InspectionLaudo laudo={LAUDO} />);
    expect(screen.getByText("VST-demo-abc123")).toBeInTheDocument();
    expect(screen.getByText(/-3\.1/)).toBeInTheDocument();
    expect(screen.getByText("Para-choque dianteiro")).toBeInTheDocument();
    expect(screen.getByText(/ABC1D23/)).toBeInTheDocument();
    const img = screen.getByAltText(/evidência photo/i) as HTMLImageElement;
    expect(img.src).toContain("https://signed.example/photo1.jpg");
  });
});
