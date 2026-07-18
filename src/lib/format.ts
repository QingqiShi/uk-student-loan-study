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

/**
 * Format a month number as a year label for chart axes.
 * @example formatYearFromMonth(24) → "Year 2"
 */
export function formatYearFromMonth(month: number): string {
  return `Year ${String(Math.round(month / 12))}`;
}

/**
 * Round a set of ratios (which represent parts of a whole) to whole
 * percentages that sum to exactly 100, using the largest-remainder method.
 * Rounding each ratio independently can sum to 99% or 101%; this keeps a split
 * bar and its legend internally consistent.
 * @example percentagesSummingTo100([0.335, 0.335, 0.33]) → [34, 33, 33]
 */
export function percentagesSummingTo100(ratios: number[]): number[] {
  const total = ratios.reduce((sum, r) => sum + r, 0);
  if (total <= 0) return ratios.map(() => 0);

  const scaled = ratios.map((r) => (r / total) * 100);
  const result = scaled.map(Math.floor);
  let remainder = 100 - result.reduce((sum, n) => sum + n, 0);

  const byFraction = scaled
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let k = 0; remainder > 0 && k < byFraction.length; k++, remainder--) {
    result[byFraction[k].index]++;
  }
  return result;
}
