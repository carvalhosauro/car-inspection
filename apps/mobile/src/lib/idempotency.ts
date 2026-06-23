import type { ProofKind } from "@vistoria/contracts";

/**
 * Stable idempotency key for a single evidence submission.
 * Same (itemId, kind, attempt) → same key → backend dedupes a retried POST.
 * Bumping `attempt` (the user pressing "refazer") yields a new key → a fresh evidence.
 */
export function buildIdempotencyKey(
  itemId: string,
  kind: ProofKind,
  attempt: number,
): string {
  return `evi:${itemId}:${kind}:${attempt}`;
}
