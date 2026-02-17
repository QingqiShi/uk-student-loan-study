/**
 * Present value (PV) utility functions for inflation-adjusting monetary values.
 *
 * Formula: presentValue = nominalValue / (1 + discountRate)^(month / 12)
 */

/**
 * Discounts a single nominal value to present value.
 *
 * @param nominal - The nominal (future) value
 * @param discountRate - Annual discount rate as decimal (e.g., 0.02 = 2%)
 * @param month - Number of months from present
 * @returns The present value
 */
export function toPresent(
  nominal: number,
  discountRate: number,
  month: number,
): number {
  if (discountRate === 0 || month === 0) return nominal;
  return nominal / Math.pow(1 + discountRate, month / 12);
}

/**
 * Sums discounted monthly payments to compute a present-value total.
 *
 * @param payments - Array of monthly payment objects with month index and amount
 * @param discountRate - Annual discount rate as decimal
 * @returns The present-value total
 */
export function pvTotal(
  payments: ReadonlyArray<{ month: number; amount: number }>,
  discountRate: number,
): number {
  let total = 0;
  for (const p of payments) {
    total += toPresent(p.amount, discountRate, p.month);
  }
  return total;
}
