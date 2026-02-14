/**
 * Format a number as a GBP currency string with thousands separators.
 * @example formatGBP(28470) → "£28,470"
 */
export function formatGBP(value: number): string {
  return `£${value.toLocaleString("en-GB")}`;
}

/**
 * Format a number as a percentage string.
 * @example formatPercent(3.2) → "3.2%"
 */
export function formatPercent(value: number): string {
  return `${String(value)}%`;
}
