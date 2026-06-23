import { describe, it, expect } from "vitest";
import { createVehicleInput, updateVehicleInput } from "./vehicle";

const validVehicle = {
  plate: "ABC1D23",
  model: "Fiat Uno",
  year: 2020,
  color: "branco",
  currentKm: 15000,
  status: "disponivel" as const,
};

describe("createVehicleInput", () => {
  it("parses a fully populated valid vehicle", () => {
    const parsed = createVehicleInput.parse(validVehicle);
    expect(parsed.plate).toBe("ABC1D23");
    expect(parsed.model).toBe("Fiat Uno");
    expect(parsed.status).toBe("disponivel");
    expect(parsed.currentKm).toBe(15000);
  });

  it("uses default status 'disponivel' when omitted", () => {
    const { status: _s, ...rest } = validVehicle;
    const parsed = createVehicleInput.parse(rest);
    expect(parsed.status).toBe("disponivel");
  });

  it("uses default currentKm of 0 when omitted", () => {
    const { currentKm: _km, ...rest } = validVehicle;
    const parsed = createVehicleInput.parse(rest);
    expect(parsed.currentKm).toBe(0);
  });

  it("parses valid status 'locado'", () => {
    const parsed = createVehicleInput.parse({ ...validVehicle, status: "locado" });
    expect(parsed.status).toBe("locado");
  });

  it("parses valid status 'manutencao'", () => {
    const parsed = createVehicleInput.parse({ ...validVehicle, status: "manutencao" });
    expect(parsed.status).toBe("manutencao");
  });

  it("rejects invalid status enum value", () => {
    expect(() => createVehicleInput.parse({ ...validVehicle, status: "inativo" })).toThrow();
  });

  it("rejects empty plate", () => {
    expect(() => createVehicleInput.parse({ ...validVehicle, plate: "" })).toThrow();
  });

  it("rejects empty model", () => {
    expect(() => createVehicleInput.parse({ ...validVehicle, model: "" })).toThrow();
  });

  it("rejects negative currentKm", () => {
    expect(() => createVehicleInput.parse({ ...validVehicle, currentKm: -1 })).toThrow();
  });

  it("allows optional year and color to be absent", () => {
    const parsed = createVehicleInput.parse({ plate: "XYZ9999", model: "HB20" });
    expect(parsed.year).toBeUndefined();
    expect(parsed.color).toBeUndefined();
  });
});

describe("updateVehicleInput", () => {
  it("allows partial update with only plate", () => {
    const parsed = updateVehicleInput.parse({ plate: "NEW1234" });
    expect(parsed.plate).toBe("NEW1234");
  });

  it("allows empty object", () => {
    const parsed = updateVehicleInput.parse({});
    expect(parsed).toEqual({});
  });

  it("rejects invalid status in partial update", () => {
    expect(() => updateVehicleInput.parse({ status: "desconhecido" })).toThrow();
  });
});
