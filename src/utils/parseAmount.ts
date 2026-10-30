/**
 * Parses what a person types into a number field: "R 25 000", "25,000.50",
 * "25000". Returns NaN for empty or invalid input so validation can flag it.
 */
export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[R\s ,]/gi, '');
  if (cleaned === '' || !/^-?\d+(\.\d+)?$/.test(cleaned)) return NaN;
  return Number(cleaned);
}
