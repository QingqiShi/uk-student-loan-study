export const MIN_SALARY = 30_000;
export const MAX_SALARY = 200_000;
export const SALARY_STEP = 5_000;
export const PLAN2_MONTHLY_THRESHOLD = 2274;
export const POST_GRAD_MONTHLY_THRESHOLD = 1750;
export const PLAN2_MONTHLY_REPAY_RATE = 0.09;
export const POST_GRAD_MONTHLY_REPAY_RATE = 0.06;
export const PLAN2_LT = 27_295;
export const PLAN2_UT = 49_130;
export const PLAN2_WRITE_OFF = 30;
export const POST_GRAD_WRITE_OFF = 30;

// Post 2023
export const PLAN5_MONTHLY_THRESHOLD = 2083;
export const PLAN5_MONTHLY_REPAY_RATE = 0.09;
export const PLAN5_WRITE_OFF = 40;

// Formatters for chart display
export const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const percentageFormatter = (value: number) => `${(value * 100).toFixed(1)}%`;
export const yearsFormatter = (value: number) => value.toFixed(1);
