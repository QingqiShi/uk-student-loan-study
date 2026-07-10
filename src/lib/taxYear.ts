/**
 * Returns the calendar year in which the current UK tax year begins.
 *
 * The UK tax year runs from 6 April to 5 April, so any date before 6 April
 * belongs to the tax year that started in the previous calendar year.
 * @example getCurrentTaxYearStartYear(new Date("2026-07-10")) → 2026 (the 2026/27 year)
 */
export function getCurrentTaxYearStartYear(now: Date = new Date()): number {
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  // Before 6 April → still the previous tax year
  if (month < 3 || (month === 3 && day < 6)) {
    return year - 1;
  }
  return year;
}

/**
 * Formats a tax-year start year as a UK tax-year label.
 * @example formatTaxYearLabel(2026) → "2026/27"
 * @example formatTaxYearLabel(2099) → "2099/00"
 */
export function formatTaxYearLabel(startYear: number): string {
  const endYear = (startYear + 1) % 100;
  return `${String(startYear)}/${String(endYear).padStart(2, "0")}`;
}

/**
 * Returns the current UK tax-year label (e.g. "2026/27").
 *
 * Figures in {@link file://./loans/plans.ts plans.ts} track whatever GOV.UK
 * currently publishes, so they always describe the current tax year — this
 * derives the matching label so it never needs hardcoding.
 */
export function getCurrentTaxYearLabel(now: Date = new Date()): string {
  return formatTaxYearLabel(getCurrentTaxYearStartYear(now));
}
