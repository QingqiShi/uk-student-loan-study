// Reused formatters — building one per call costs ~25x more, and the overseas
// estimator formats a dozen figures on every keystroke.
const POUNDS = new Intl.NumberFormat("en-GB");
const POUNDS_AND_PENCE = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as a GBP currency string with thousands separators.
 * @example formatGBP(28470) → "£28,470"
 */
export function formatGBP(value: number): string {
  return `£${POUNDS.format(value)}`;
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

/**
 * Format a number as a GBP currency string to the penny.
 * @example formatGBPPence(327.2) → "£327.20"
 */
export function formatGBPPence(value: number): string {
  return `£${POUNDS_AND_PENCE.format(value)}`;
}

/**
 * Format a band multiplier against the UK threshold.
 * @example formatMultiplier(0.8) → "0.8×"
 */
export function formatMultiplier(value: number): string {
  return `${value.toFixed(1)}×`;
}

/**
 * Format an HMRC exchange rate: what one unit of a currency is worth in GBP,
 * to the six decimal places HMRC publishes, trailing zeros dropped.
 * @example formatExchangeRate(0.489572) → "£0.489572"
 * @example formatExchangeRate(1) → "£1"
 */
export function formatExchangeRate(rateToGBP: number): string {
  return `£${rateToGBP.toFixed(6).replace(/\.?0+$/, "")}`;
}
