import {
  formatExchangeRate,
  formatGBP,
  formatGBPPence,
  formatMultiplier,
  formatPercent,
} from "@/lib/format";
import { getMaxAnnualInterestRate } from "@/lib/loans/interest";
import { getOverseasBand, requireTerritory } from "@/lib/loans/overseas";
import {
  OVERSEAS_BANDS,
  OVERSEAS_PUBLICATION_URLS,
  OVERSEAS_TAX_YEAR,
  OVERSEAS_TERRITORIES,
  type OverseasBandId,
} from "@/lib/loans/overseasThresholds";

// Every figure on the page derives from the 2026/27 SLC dataset in
// src/lib/loans/overseasThresholds.ts, so prose, tables, the estimator and the
// FAQ JSON-LD can never disagree with each other.

/** Anchor id on the estimator's section heading — the in-page link's target. */
export const ESTIMATOR_ANCHOR_ID = "overseas-estimator";

export const govUkHowYouRepayLink =
  "https://www.gov.uk/repaying-your-student-loan/how-you-repay";
export const govUkUpdateEmploymentDetailsLink =
  "https://www.gov.uk/repaying-your-student-loan/update-your-employment-details";
export const govUkOverseasThresholdsLink = OVERSEAS_PUBLICATION_URLS.PLAN_2;
export const govUkArrearsGuidanceLink =
  "https://www.gov.uk/guidance/how-arrears-can-accrue-on-your-student-loan-account-when-youre-overseas";
export const SLC_ARREARS_PHONE = "+44 141 243 3970";

/**
 * One featured destination, keyed by the name GOV.UK prints. `label` is the
 * shorter form tables and prose use, e.g. "UAE (Dubai)".
 */
function describe(name: string, label: string = name) {
  const territory = requireTerritory(name);
  const band = getOverseasBand(territory);
  return {
    label,
    territory,
    multiplier: band.multiplier,
    plan2Threshold: band.thresholds.PLAN_2,
    plan2UpperThreshold: band.plan2UpperThreshold,
    plan5Threshold: band.thresholds.PLAN_5,
    postgraduateThreshold: band.thresholds.POSTGRADUATE,
    plan2FixedMonthly: band.fixedMonthly.PLAN_2,
  };
}

export const featured = {
  spain: describe("Spain"),
  uae: describe("United Arab Emirates", "UAE (Dubai)"),
  australia: describe("Australia"),
  usa: describe("United States of America", "United States"),
  uk: describe("United Kingdom"),
};

// Ordered by band (lower → UK → higher) so the middle-earner story reads down
// the table: a lower threshold pulls more of a mid-range income into the 9% band.
export const featuredDestinations = [
  featured.spain,
  featured.uae,
  featured.australia,
  describe("Canada"),
  describe("New Zealand"),
  featured.usa,
];

/** Recognisable members of each band, for the ladder table. */
const BAND_EXAMPLES: Record<OverseasBandId, string> = {
  A: "India, Pakistan, Nigeria, Egypt",
  B: "South Africa, Thailand, Turkey, Malaysia",
  C: "Portugal, Poland, Brazil, Singapore",
  D: "Spain, France, Germany, Japan, UAE",
  E: "Australia, Canada, Ireland, Netherlands",
  F: "United States, Switzerland, Iceland",
  G: "Bermuda, Cayman Islands",
};

const TERRITORY_COUNTS: Record<OverseasBandId, number> = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  G: 0,
};
for (const territory of OVERSEAS_TERRITORIES) {
  TERRITORY_COUNTS[territory.band]++;
}

export const bandLadder = OVERSEAS_BANDS.map((band) => ({
  id: band.id,
  multiplier: band.multiplier,
  plan2Threshold: band.thresholds.PLAN_2,
  plan2FixedMonthly: band.fixedMonthly.PLAN_2,
  territoryCount: TERRITORY_COUNTS[band.id],
  examples: BAND_EXAMPLES[band.id],
}));

export const lowestBand = bandLadder[0];
export const highestBand = bandLadder[bandLadder.length - 1];
export const bandCount = bandLadder.length;

/** How many territories sit in a band below Spain's. */
export const territoriesBelowSpain = bandLadder
  .filter((row) => row.multiplier < featured.spain.multiplier)
  .reduce((sum, row) => sum + row.territoryCount, 0);

const year = OVERSEAS_TAX_YEAR;
const ukPlan2 = formatGBP(featured.uk.plan2Threshold);
const spainPlan2 = formatGBP(featured.spain.plan2Threshold);
const usaPlan2 = formatGBP(featured.usa.plan2Threshold);
const plan2MaxRatePct = formatPercent(getMaxAnnualInterestRate("PLAN_2"));

// Single source of truth for the visible FAQ and the FAQPage JSON-LD in
// layout.tsx, so the structured data can never drift from what the page shows.
// The country-specific questions lead because they mirror real search queries.
export const movingAbroadFaqs = [
  {
    question: "Does your student loan get wiped if you move abroad?",
    answer: `No. Moving abroad does not cancel your student loan or wipe the balance, and there is no rule that writes it off after three years overseas. Your loan is only written off at the end of your plan's term (25, 30 or 40 years depending on your plan), and that clock keeps running wherever you live. Write-off may not apply if you are in breach of your repayment obligations, and SLC can still recover repayments that were due before the write-off date.`,
  },
  {
    question:
      "What happens to my student loan if I move to Canada, Australia or New Zealand?",
    answer: `You must tell the Student Loans Company before you leave if you will be away for more than 3 months, then update your employment details online. Australia, Canada and New Zealand sit in the same price band as the UK, so your repayment threshold is identical to the UK figure (${ukPlan2} for Plan 2 in ${year}). You repay 9% of income above it directly to SLC each month, with your payslips converted at HMRC's annual average exchange rate.`,
  },
  {
    question:
      "Do I still repay my student loan in Dubai if there's no income tax?",
    answer: `Yes. UK student loan repayments are separate from local income tax, so a tax-free income in the UAE does not exempt you. The UAE sits in a lower band than the UK (${formatGBP(featured.uae.plan2Threshold)} versus ${ukPlan2} for Plan 2 in ${year}), so the same income starts repayments earlier than it would at home. If you do not update your details, SLC charges the UAE's fixed monthly repayment of ${formatGBPPence(featured.uae.plan2FixedMonthly)} instead.`,
  },
  {
    question: "Which countries have a lower student loan repayment threshold?",
    answer: `SLC places every territory in one of seven bands from ${formatMultiplier(lowestBand.multiplier)} to ${formatMultiplier(highestBand.multiplier)} the UK threshold, using the World Bank's Price Level Index. For Plan 2 in ${year}, Spain and the UAE sit at ${spainPlan2} (${formatMultiplier(featured.spain.multiplier)}); India, Pakistan and Nigeria at ${formatGBP(lowestBand.plan2Threshold)} (${formatMultiplier(lowestBand.multiplier)}); the United States at ${usaPlan2} (${formatMultiplier(featured.usa.multiplier)}); and only Bermuda and the Cayman Islands at ${formatGBP(highestBand.plan2Threshold)} (${formatMultiplier(highestBand.multiplier)}). A lower threshold pulls more of a mid-range income into the 9% repayment band, so the same income repays more than it would in the UK.`,
  },
  {
    question: "Do I still pay my student loan if I move abroad?",
    answer: `Yes. Moving abroad does not cancel your student loan. You must tell the Student Loans Company before you leave if you will be away for more than 3 months, update your employment details with evidence of your income, and repay 9% (6% for Postgraduate loans) of income above your country's threshold directly to SLC. If your income is below the threshold, SLC can defer repayments for 12 months.`,
  },
  {
    question: "What happens if I don't tell SLC I've moved abroad?",
    answer: `SLC charges the fixed monthly repayment for your country: ${formatGBPPence(featured.spain.plan2FixedMonthly)} a month in Spain, or ${formatGBPPence(featured.australia.plan2FixedMonthly)} in Australia for Plan 2 in ${year}. That can be higher than an income-based amount. Unpaid amounts become arrears, Plan 2 interest goes to the highest rate (capped at ${plan2MaxRatePct}), and SLC can charge a penalty, demand the whole loan in one lump sum, and take court action. Student loans still do not appear on your credit report.`,
  },
  {
    question:
      "How are student loan repayments calculated when living overseas?",
    answer: `SLC converts your gross annual income into pounds at HMRC's annual average exchange rate, usually from your last three months' payslips, and subtracts your country's repayment threshold. You repay 9% of the remainder (6% for Postgraduate loans), split over 12 months and rounded down to whole pounds. For example, €33,000 in Spain converts to about £28,164, which gives £34 a month for Plan 2 in ${year}.`,
  },
  {
    question: "What exchange rate does SLC use for overseas repayments?",
    answer: `SLC converts your income into pounds using the average exchange rate for the most recent calendar year published by HMRC, reviewed every 6 April; it does not track month-to-month movements. For ${year}, 1 Australian dollar is ${formatExchangeRate(featured.australia.territory.exchangeRateToGBP)}, 1 euro is ${formatExchangeRate(featured.spain.territory.exchangeRateToGBP)} and 1 US dollar is ${formatExchangeRate(featured.usa.territory.exchangeRateToGBP)}. You then repay in pounds sterling and bear any currency-conversion and bank-transfer fees yourself.`,
  },
  {
    question:
      "Do the overseas thresholds apply to Plan 5 and Postgraduate loans?",
    answer: `Yes. SLC publishes a separate overseas table for every plan, and each uses the same country bands. For ${year}, Spain's threshold is ${formatGBP(featured.spain.plan5Threshold)} for Plan 5 and ${formatGBP(featured.spain.postgraduateThreshold)} for a Postgraduate loan, against ${formatGBP(featured.uk.plan5Threshold)} and ${formatGBP(featured.uk.postgraduateThreshold)} in the UK; the United States is ${formatGBP(featured.usa.plan5Threshold)} and ${formatGBP(featured.usa.postgraduateThreshold)}. You repay 9% above the Plan 5 threshold and 6% above the Postgraduate one, both at once if you hold both loans.`,
  },
  {
    question:
      "Do I have to repay my student loan if I'm travelling or not working abroad?",
    answer: `You still have to tell SLC before you leave if you will be away for more than 3 months, even if you are not earning. Update your employment details online, where you can record that you are unemployed, and give proof such as a recent bank statement. If your income is below your country's threshold, SLC defers repayments for 12 months. If you say nothing, your country's fixed monthly repayment applies instead.`,
  },
  {
    question: "Does moving abroad affect my credit score?",
    answer: `No. GOV.UK states that student loans do not appear on credit reports and do not affect your credit score, and moving abroad does not change that. The consequences of ignoring SLC are different: arrears on your loan account, the highest interest rate, a penalty charge and, in the end, a court order. Only a court judgment could reach your credit file. Lenders may still consider your student loan in affordability checks for other borrowing.`,
  },
  {
    question: "What happens to my student loan if I emigrate from the UK?",
    answer: `Your loan remains active regardless of where you live. Before you leave, tell the Student Loans Company and update your employment details; SLC then sets a repayment schedule from your country's threshold for up to 12 months at a time, reassessed each year. The write-off date stays the same, because emigrating does not reset or extend it, although write-off may not apply if you are in breach of your repayment obligations.`,
  },
  {
    question: "What happens to my student loan when I come back to the UK?",
    answer: `Update your employment details as soon as you return after more than 3 months away. If you do not, SLC keeps charging you at the rate for the country you left, possibly at a higher interest rate, while PAYE deductions restart once you are employed. PAYE repayments do not clear any overseas arrears; arrange those separately with SLC's arrears line on ${SLC_ARREARS_PHONE}. Visits under 3 months do not change your status.`,
  },
  {
    question: "Can I avoid paying my student loan by moving abroad?",
    answer: `No. SLC can recover the debt through the courts as a civil debt, in the UK or abroad, and can add the cost of tracing your address and income to your loan. If you do not respond to income requests, SLC charges your country's fixed monthly repayment (from ${formatGBPPence(lowestBand.plan2FixedMonthly)} to ${formatGBPPence(highestBand.plan2FixedMonthly)} a month for Plan 2 in ${year}), applies the highest interest rate to a Plan 2 loan, and can demand the whole loan in one lump sum.`,
  },
];
