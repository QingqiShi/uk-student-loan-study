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
