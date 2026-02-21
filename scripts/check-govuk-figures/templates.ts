import { findRepaymentRate, findRpi, findWriteOffYears } from "./types";
import type { ScrapedGovUkData } from "./types";

function formatNumber(n: number): string {
  return n.toLocaleString("en-GB");
}

function findThreshold(
  scraped: ScrapedGovUkData,
  plan: string,
): { monthlyThreshold: number; yearlyThreshold: number } {
  const entry = scraped.thresholds.find((t) => t.plan === plan);
  if (!entry) throw new Error(`No threshold found for ${plan}`);
  return {
    monthlyThreshold: entry.monthlyThreshold,
    yearlyThreshold: entry.yearlyThreshold,
  };
}

function formatRate(rate: number): string {
  // Convert 0.09 → "9%", 0.06 → "6%"
  const pct = rate * 100;
  return `${pct}%`;
}

export function generatePlansTs(
  scraped: ScrapedGovUkData,
  existingTuitionCap: number,
  lastUpdated: string,
): string {
  const plan1 = findThreshold(scraped, "PLAN_1");
  const plan1Rate = findRepaymentRate(scraped, "PLAN_1");
  const plan1WriteOff = findWriteOffYears(scraped, "PLAN_1");

  const plan2 = findThreshold(scraped, "PLAN_2");
  const plan2Rate = findRepaymentRate(scraped, "PLAN_2");
  const plan2WriteOff = findWriteOffYears(scraped, "PLAN_2");

  const plan4 = findThreshold(scraped, "PLAN_4");
  const plan4Rate = findRepaymentRate(scraped, "PLAN_4");
  const plan4WriteOff = findWriteOffYears(scraped, "PLAN_4");

  const plan5 = findThreshold(scraped, "PLAN_5");
  const plan5Rate = findRepaymentRate(scraped, "PLAN_5");
  const plan5WriteOff = findWriteOffYears(scraped, "PLAN_5");

  const postgrad = findThreshold(scraped, "POSTGRADUATE");
  const postgradRate = findRepaymentRate(scraped, "POSTGRADUATE");
  const postgradWriteOff = findWriteOffYears(scraped, "POSTGRADUATE");

  const rpi = findRpi(scraped);
  const boeBaseRate = scraped.boeBaseRate;

  // Format as 9_250 style
  const tuitionCapLiteral =
    existingTuitionCap >= 1000
      ? `${Math.floor(existingTuitionCap / 1000)}_${String(existingTuitionCap % 1000).padStart(3, "0")}`
      : String(existingTuitionCap);

  return `// =============================================================================
// ANNUAL UPDATE SECTION - Update these values when GOV.UK announces changes
// Source: https://www.gov.uk/repaying-your-student-loan/what-you-pay
// =============================================================================

/**
 * ISO date of the last time figures were actually changed by the automation.
 * Only updates when GOV.UK/BoE figures differ from what we have.
 */
export const LAST_UPDATED = "${lastUpdated}";

/**
 * Plan configurations for all UK student loan types.
 * All monetary values are monthly thresholds in GBP.
 */
export const PLAN_CONFIGS = {
  PLAN_1: {
    monthlyThreshold: ${plan1.monthlyThreshold}, // £${formatNumber(plan1.yearlyThreshold)}/12
    repaymentRate: ${plan1Rate}, // ${formatRate(plan1Rate)}
    writeOffYears: ${plan1WriteOff},
  },
  PLAN_2: {
    monthlyThreshold: ${plan2.monthlyThreshold}, // £${formatNumber(plan2.yearlyThreshold)}/12
    repaymentRate: ${plan2Rate}, // ${formatRate(plan2Rate)}
    writeOffYears: ${plan2WriteOff},
    interestLowerThreshold: ${scraped.plan2InterestScale.lowerThreshold},
    interestUpperThreshold: ${scraped.plan2InterestScale.upperThreshold},
  },
  PLAN_4: {
    monthlyThreshold: ${plan4.monthlyThreshold}, // £${formatNumber(plan4.yearlyThreshold)}/12
    repaymentRate: ${plan4Rate}, // ${formatRate(plan4Rate)}
    writeOffYears: ${plan4WriteOff},
  },
  PLAN_5: {
    monthlyThreshold: ${plan5.monthlyThreshold}, // £${formatNumber(plan5.yearlyThreshold)}/12
    repaymentRate: ${plan5Rate}, // ${formatRate(plan5Rate)}
    writeOffYears: ${plan5WriteOff},
  },
  POSTGRADUATE: {
    monthlyThreshold: ${postgrad.monthlyThreshold}, // £${formatNumber(postgrad.yearlyThreshold)}/12
    repaymentRate: ${postgradRate}, // ${formatRate(postgradRate)}
    writeOffYears: ${postgradWriteOff},
  },
} as const;

/**
 * Current interest rates for loan calculations.
 * Update these when new rates are announced.
 */
export const CURRENT_RATES = {
  rpi: ${rpi},
  boeBaseRate: ${boeBaseRate},
} as const;

/**
 * User-friendly display information for each undergraduate plan type.
 * yearlyThreshold and writeOffYears are derived from PLAN_CONFIGS to avoid duplication.
 */
export const PLAN_DISPLAY_INFO = {
  PLAN_1: {
    name: "Plan 1",
    region: "England, Wales & N. Ireland",
    years: "Pre-2012 (all years for NI)",
    description:
      "For English/Welsh students who started before September 2012, or any Northern Irish student",
    yearlyThreshold: PLAN_CONFIGS.PLAN_1.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_1.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_1.repaymentRate,
  },
  PLAN_2: {
    name: "Plan 2",
    region: "England & Wales",
    years: "2012-2023",
    description:
      "For students who started between September 2012 and July 2023",
    yearlyThreshold: PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_2.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_2.repaymentRate,
  },
  PLAN_4: {
    name: "Plan 4",
    region: "Scotland",
    years: "All years",
    description: "For Scottish students",
    yearlyThreshold: PLAN_CONFIGS.PLAN_4.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_4.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_4.repaymentRate,
  },
  PLAN_5: {
    name: "Plan 5",
    region: "England",
    years: "2023+",
    description: "For students who started after August 2023",
    yearlyThreshold: PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_5.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_5.repaymentRate,
  },
} as const;

/**
 * User-friendly display information for postgraduate loans.
 * Values derived from PLAN_CONFIGS to avoid duplication.
 */
export const POSTGRADUATE_DISPLAY_INFO = {
  name: "Postgraduate",
  region: "UK-wide",
  years: "All years",
  description: "For Master's and Doctoral loans",
  yearlyThreshold: PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold * 12,
  writeOffYears: PLAN_CONFIGS.POSTGRADUATE.writeOffYears,
  repaymentRate: PLAN_CONFIGS.POSTGRADUATE.repaymentRate,
} as const;

/**
 * Maximum tuition fee per year (England).
 * Update when the government changes the cap.
 */
export const TUITION_FEE_CAP = ${tuitionCapLiteral};

// =============================================================================
// END OF ANNUAL UPDATE SECTION
// =============================================================================
`;
}

export function generateLlmsTxt(scraped: ScrapedGovUkData): string {
  const plan1 = findThreshold(scraped, "PLAN_1");
  const plan1Rate = findRepaymentRate(scraped, "PLAN_1");
  const plan1WriteOff = findWriteOffYears(scraped, "PLAN_1");

  const plan2 = findThreshold(scraped, "PLAN_2");
  const plan2Rate = findRepaymentRate(scraped, "PLAN_2");
  const plan2WriteOff = findWriteOffYears(scraped, "PLAN_2");

  const plan4 = findThreshold(scraped, "PLAN_4");
  const plan4Rate = findRepaymentRate(scraped, "PLAN_4");
  const plan4WriteOff = findWriteOffYears(scraped, "PLAN_4");

  const plan5 = findThreshold(scraped, "PLAN_5");
  const plan5Rate = findRepaymentRate(scraped, "PLAN_5");
  const plan5WriteOff = findWriteOffYears(scraped, "PLAN_5");

  const postgrad = findThreshold(scraped, "POSTGRADUATE");
  const postgradRate = findRepaymentRate(scraped, "POSTGRADUATE");
  const postgradWriteOff = findWriteOffYears(scraped, "POSTGRADUATE");

  const rpi = findRpi(scraped);

  const fmtRate = (r: number) => `${Math.round(r * 100)}%`;

  return `# UK Student Loan Study

> Exposing how UK student loans hurt middle earners most, with interactive calculators to help graduates understand their repayments

## Purpose

UK student loans are often misunderstood. Middle earners typically repay the most - more than high earners (who pay off quickly) and low earners (who have debt written off). This site visualises this inequity and helps users understand their personal situation.

## Tools

- [Repayment Calculator](https://studentloanstudy.uk): See total repayments across all UK student loan plan types (Plan 1, 2, 4, 5, Postgraduate)
- [Which Plan Quiz](https://studentloanstudy.uk/which-plan): Find your loan plan in 3 questions
- [Overpay Calculator](https://studentloanstudy.uk/overpay): Should you overpay or invest?
- [Our Data](https://studentloanstudy.uk/our-data): How we keep figures current — daily automation checks GOV.UK and the Bank of England

## Guides

- [All Guides](https://studentloanstudy.uk/guides): Index page listing all student loan guides
- [Plan 2 vs Plan 5](https://studentloanstudy.uk/guides/plan-2-vs-plan-5): Compare thresholds, interest rates, and total repayments between Plan 2 and Plan 5
- [How Interest Works](https://studentloanstudy.uk/guides/how-interest-works): Understand the sliding scale for Plan 2, RPI-only for Plan 5, and why balances grow
- [RPI vs CPI](https://studentloanstudy.uk/guides/rpi-vs-cpi): Why student loan interest uses RPI while general inflation is measured by CPI, and what that gap means
- [Student Loan & Mortgage](https://studentloanstudy.uk/guides/student-loan-vs-mortgage): How student loan repayments affect mortgage affordability and borrowing capacity
- [Pay Upfront or Take Loan?](https://studentloanstudy.uk/guides/pay-upfront-or-take-loan): Should parents pay tuition upfront or let their child take the loan?
- [Moving Abroad](https://studentloanstudy.uk/guides/moving-abroad): What happens to your student loan if you leave the UK
- [Self-Employment](https://studentloanstudy.uk/guides/self-employment): How repayments work through Self Assessment for freelancers

## Key Facts

- UK student loans support multiple plan types: Plan 1, Plan 2, Plan 4, Plan 5, and Postgraduate Loans
- Repayment rate: ${fmtRate(plan1Rate)} of income above threshold (${fmtRate(postgradRate)} for Postgraduate)
- Monthly repayment thresholds: Plan 1 \u00a3${formatNumber(plan1.monthlyThreshold)}, Plan 2 \u00a3${formatNumber(plan2.monthlyThreshold)}, Plan 4 \u00a3${formatNumber(plan4.monthlyThreshold)}, Plan 5 \u00a3${formatNumber(plan5.monthlyThreshold)}, Postgraduate \u00a3${formatNumber(postgrad.monthlyThreshold)}
- Loans are written off after ${plan1WriteOff}-${plan5WriteOff} years depending on plan type
- Middle earners often pay the most in total repayments due to interest accumulation

## Plan Types Summary

### Plan 1
- For students who started before September 2012 (England/Wales) or any time in Northern Ireland
- Monthly threshold: \u00a3${formatNumber(plan1.monthlyThreshold)} (\u00a3${formatNumber(plan1.yearlyThreshold)}/year)
- Repayment rate: ${fmtRate(plan1Rate)} of income above threshold
- ${plan1WriteOff}-year write-off period
- Interest rate: RPI or Bank of England base rate + 1%, whichever is lower (currently RPI ${rpi}%, base rate ${scraped.boeBaseRate}%)

### Plan 2
- For students who started between September 2012 and July 2023 (England/Wales)
- Monthly threshold: \u00a3${formatNumber(plan2.monthlyThreshold)} (\u00a3${formatNumber(plan2.yearlyThreshold)}/year)
- Repayment rate: ${fmtRate(plan2Rate)} of income above threshold
- ${plan2WriteOff}-year write-off period
- Interest rate: RPI + 0-3% depending on income (income scale: \u00a3${formatNumber(scraped.plan2InterestScale.lowerThreshold)} to \u00a3${formatNumber(scraped.plan2InterestScale.upperThreshold)})

### Plan 4
- For Scottish students who started after September 1998
- Monthly threshold: \u00a3${formatNumber(plan4.monthlyThreshold)} (\u00a3${formatNumber(plan4.yearlyThreshold)}/year)
- Repayment rate: ${fmtRate(plan4Rate)} of income above threshold
- ${plan4WriteOff}-year write-off period
- Interest rate: RPI or Bank of England base rate + 1%, whichever is lower (currently RPI ${rpi}%, base rate ${scraped.boeBaseRate}%)

### Plan 5
- For students starting August 2023 or later (England)
- Monthly threshold: \u00a3${formatNumber(plan5.monthlyThreshold)} (\u00a3${formatNumber(plan5.yearlyThreshold)}/year)
- Repayment rate: ${fmtRate(plan5Rate)} of income above threshold
- ${plan5WriteOff}-year write-off period
- Interest rate: RPI only (no additional percentage, currently ${rpi}%)

### Postgraduate Loan
- For Master's or Doctoral study from 2016 onwards
- Monthly threshold: \u00a3${formatNumber(postgrad.monthlyThreshold)} (\u00a3${formatNumber(postgrad.yearlyThreshold)}/year)
- Repayment rate: ${fmtRate(postgradRate)} of income above threshold
- ${postgradWriteOff}-year write-off period

## Contact

Website: https://studentloanstudy.uk
`;
}
