const MERCOSUL = /[A-Z]{3}[0-9][A-Z][0-9]{2}/;
const OLD = /[A-Z]{3}[0-9]{4}/;

/** Extracts a Brazilian plate (Mercosul AAA1A23 or old AAA1234) from OCR text, or null. */
export function extractPlate(text: string): string | null {
  const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const mercosul = cleaned.match(MERCOSUL);
  if (mercosul) return mercosul[0];
  const old = cleaned.match(OLD);
  if (old) return old[0];
  return null;
}
