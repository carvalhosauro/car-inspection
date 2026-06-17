import { describe, it, expect } from "vitest";
import { AI_CONFIG } from "./AiPhotoResult.logic";

describe("AI_CONFIG", () => {
  it("aprovada uses success color and approval message", () => {
    expect(AI_CONFIG.aprovada.color).toBe("#22C55E");
    expect(AI_CONFIG.aprovada.message).toBe("Foto aprovada pela IA");
    expect(AI_CONFIG.aprovada.icon).toBe("CheckCircle2");
  });
  it("recusada uses error color and rejection icon", () => {
    expect(AI_CONFIG.recusada.color).toBe("#EF4444");
    expect(AI_CONFIG.recusada.icon).toBe("XCircle");
  });
});
