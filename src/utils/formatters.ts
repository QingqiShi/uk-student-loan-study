/**
 * Currency formatter for GBP with no decimal places.
 */
export const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

/**
 * Formats a number as GBP currency.
 * @param value - Number to format
 * @returns Formatted string (e.g., "£50,000")
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Formats a number as years with one decimal place.
 * @param years - Number of years
 * @returns Formatted string (e.g., "5.5")
 */
export function formatYears(years: number): string {
  return years.toFixed(1);
}

/**
 * Formats a decimal as a percentage with one decimal place.
 * @param rate - Rate as a decimal (e.g., 0.065)
 * @returns Formatted string (e.g., "6.5%")
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
