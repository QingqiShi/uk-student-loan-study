// Chart salary range
export const MIN_SALARY = 30_000;
export const MAX_SALARY = 200_000;
export const SALARY_STEP = 5_000;

// Formatters for chart display
export const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const percentageFormatter = (value: number) =>
  `${(value * 100).toFixed(1)}%`;
export const yearsFormatter = (value: number) => value.toFixed(1);
