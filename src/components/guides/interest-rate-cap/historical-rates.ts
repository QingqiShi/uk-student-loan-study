/**
 * Maximum Plan 2 interest rate actually charged each academic year.
 * For years where the prevailing market rate (PMR) cap was applied,
 * the rate shown is after that intervention.
 */
export const HISTORICAL_RATES = [
  { year: 2012, label: "12/13", maxRate: 6.6 },
  { year: 2013, label: "13/14", maxRate: 6.3 },
  { year: 2014, label: "14/15", maxRate: 5.5 },
  { year: 2015, label: "15/16", maxRate: 3.9 },
  { year: 2016, label: "16/17", maxRate: 4.6 },
  { year: 2017, label: "17/18", maxRate: 6.1 },
  { year: 2018, label: "18/19", maxRate: 6.3 },
  { year: 2019, label: "19/20", maxRate: 5.4 },
  { year: 2020, label: "20/21", maxRate: 5.6 },
  { year: 2021, label: "21/22", maxRate: 4.5 },
  { year: 2022, label: "22/23", maxRate: 6.9 },
  { year: 2023, label: "23/24", maxRate: 7.7 },
  { year: 2024, label: "24/25", maxRate: 7.3 },
  { year: 2025, label: "25/26", maxRate: 6.2 },
] as const;

export const INTEREST_CAP = 6;

export const YEARS_ABOVE_CAP = HISTORICAL_RATES.filter(
  (d) => d.maxRate > INTEREST_CAP,
).length;

export const TOTAL_YEARS = HISTORICAL_RATES.length;

export type InterestRateCapFaq = {
  question: string;
  answer: string;
};

// Single source of truth for the visible FAQ and the FAQPage JSON-LD in
// layout.tsx, so the structured data can never drift from what the page shows.
// The YEARS_ABOVE_CAP / TOTAL_YEARS interpolation stays derived from
// HISTORICAL_RATES above.
export const interestRateCapFaqs: InterestRateCapFaq[] = [
  {
    question: "What is the Plan 2 student loan interest rate cap?",
    answer:
      "From 1 September 2026, the maximum interest rate on Plan 2 and Plan 3 student loans will be capped at 6% for the 2026/27 academic year, regardless of what the RPI + 3% formula produces.",
  },
  {
    question: "How often has the Plan 2 interest rate exceeded 6%?",
    answer: `The maximum Plan 2 interest rate has exceeded 6% in ${String(YEARS_ABOVE_CAP)} out of ${String(TOTAL_YEARS)} academic years since Plan 2 was introduced in 2012. During the 2022-2024 inflation crisis, rates reached 7.7% even after prevailing market rate interventions.`,
  },
  {
    question: "Does the 6% cap change my monthly student loan repayments?",
    answer:
      "No. Monthly repayments are based on your income (9% of earnings above the threshold), not the interest rate. The cap only affects how fast your outstanding balance grows.",
  },
];
