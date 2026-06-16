const MERCOSUL = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const OLD = /^[A-Z]{3}[0-9]{4}$/;

/** Extracts a Brazilian plate (Mercosul AAA1A23 or old AAA1234) from OCR text, or null. */
export function extractPlate(text: string): string | null {
  const upper = text.toUpperCase();

  // Find potential plate positions in the original text (before cleaning)
  // by tracking indices of alphanumeric sequences
  let cleanedIndex = 0;
  let originalIndex = 0;
  const indexMap = new Map<number, number>(); // cleaned index -> original index

  // Build index map
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    if (char && /[A-Z0-9]/.test(char)) {
      indexMap.set(cleanedIndex, i);
      cleanedIndex++;
    }
  }

  const cleaned = upper.replace(/[^A-Z0-9]/g, "");

  // Try to find Mercosul plates
  for (let i = 0; i <= cleaned.length - 7; i++) {
    const candidate = cleaned.substring(i, i + 7);
    if (MERCOSUL.test(candidate)) {
      // Check if there's a non-alphanumeric boundary in original text before and after
      const origStart = indexMap.get(i);
      const origLastChar = indexMap.get(i + 6); // last char of the plate

      if (origStart !== undefined && origLastChar !== undefined) {
        const origAfter = (origLastChar + 1 < upper.length) ? origLastChar + 1 : upper.length;

        const hasBefore = origStart === 0 || !/[A-Z0-9]/.test(upper[origStart - 1]!);
        const hasAfter = origAfter >= upper.length || !/[A-Z0-9]/.test(upper[origAfter]!);

        // Only accept if there's a boundary on both sides
        if (hasBefore && hasAfter) {
          return candidate;
        }
      }
    }
  }

  // Try to find old plates
  for (let i = 0; i <= cleaned.length - 7; i++) {
    const candidate = cleaned.substring(i, i + 7);
    if (OLD.test(candidate)) {
      // Check if there's a non-alphanumeric boundary in original text before and after
      const origStart = indexMap.get(i);
      const origLastChar = indexMap.get(i + 6); // last char of the plate

      if (origStart !== undefined && origLastChar !== undefined) {
        const origAfter = (origLastChar + 1 < upper.length) ? origLastChar + 1 : upper.length;

        const hasBefore = origStart === 0 || !/[A-Z0-9]/.test(upper[origStart - 1]!);
        const hasAfter = origAfter >= upper.length || !/[A-Z0-9]/.test(upper[origAfter]!);

        // Only accept if there's a boundary on both sides
        if (hasBefore && hasAfter) {
          return candidate;
        }
      }
    }
  }

  return null;
}
