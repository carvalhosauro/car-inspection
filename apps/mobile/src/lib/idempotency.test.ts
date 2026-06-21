import { buildIdempotencyKey } from "./idempotency";

describe("buildIdempotencyKey", () => {
  it("is stable for the same item + kind + attempt", () => {
    const a = buildIdempotencyKey("item-1", "photo", 0);
    const b = buildIdempotencyKey("item-1", "photo", 0);
    expect(a).toBe(b);
  });

  it("changes when the attempt changes (refazer)", () => {
    const first = buildIdempotencyKey("item-1", "photo", 0);
    const second = buildIdempotencyKey("item-1", "photo", 1);
    expect(first).not.toBe(second);
  });

  it("differs across kinds for the same item", () => {
    expect(buildIdempotencyKey("item-1", "photo", 0)).not.toBe(
      buildIdempotencyKey("item-1", "ocr_plate", 0),
    );
  });

  it("differs across items", () => {
    expect(buildIdempotencyKey("item-1", "photo", 0)).not.toBe(
      buildIdempotencyKey("item-2", "photo", 0),
    );
  });
});
