import { describe, it, expect } from "vitest";
import { findSelectedOption, type SelectOption } from "./Select.logic";

const OPTIONS: SelectOption[] = [
  { label: "Carro", value: "car" },
  { label: "Moto", value: "moto" }
];

describe("findSelectedOption", () => {
  it("returns the option matching the value", () => {
    expect(findSelectedOption(OPTIONS, "moto")).toEqual({ label: "Moto", value: "moto" });
  });
  it("returns undefined when value is missing", () => {
    expect(findSelectedOption(OPTIONS, undefined)).toBeUndefined();
  });
  it("returns undefined when value has no match", () => {
    expect(findSelectedOption(OPTIONS, "truck")).toBeUndefined();
  });
});
