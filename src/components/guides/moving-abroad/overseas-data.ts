import { formatGBP } from "@/lib/format";

// SLC sets a separate repayment threshold for each country by placing it in a
// price-level band that multiplies the UK threshold. The figures below are the
// Plan 2 (undergraduate) overseas thresholds for the 2026/27 tax year, as
// published by SLC on GOV.UK. They are hardcoded because they describe a
// specific tax year and must not shift when the live UK config updates — SLC
// revises them every April, hence the "check the latest" caveat shown in the UI.
export const UK_PLAN2_THRESHOLD = 29_385; // 2026/27 UK Plan 2 threshold
const LOWER_BAND_THRESHOLD = 23_510; // e.g. Spain, UAE (~0.8× the UK band)
const HIGHER_BAND_THRESHOLD = 35_260; // e.g. USA (~1.2× the UK band)

export const govUkOverseasThresholdsLink =
  "https://www.gov.uk/government/publications/overseas-earnings-thresholds-for-plan-2-student-loans";

export type OverseasThreshold = {
  country: string;
  threshold: number;
};

// Ordered by band (lower → UK → higher) so the middle-earner story reads down
// the table: a lower threshold pulls more of a mid-range salary into the 9% band.
export const overseasThresholds: OverseasThreshold[] = [
  { country: "Spain", threshold: LOWER_BAND_THRESHOLD },
  { country: "UAE (Dubai)", threshold: LOWER_BAND_THRESHOLD },
  { country: "Australia", threshold: UK_PLAN2_THRESHOLD },
  { country: "Canada", threshold: UK_PLAN2_THRESHOLD },
  { country: "New Zealand", threshold: UK_PLAN2_THRESHOLD },
  { country: "United States", threshold: HIGHER_BAND_THRESHOLD },
];

// How each country's threshold compares to the UK band, derived from the figures
// above so the label can never drift from the number shown next to it.
export function overseasComparisonLabel(threshold: number): string {
  if (threshold === UK_PLAN2_THRESHOLD) {
    return "Matches the UK threshold";
  }
  const multiplier = (threshold / UK_PLAN2_THRESHOLD).toFixed(1);
  return threshold > UK_PLAN2_THRESHOLD
    ? `Higher — about ${multiplier}× the UK band`
    : `Lower — about ${multiplier}× the UK band`;
}

export type MovingAbroadFaq = {
  question: string;
  answer: string;
};

// Single source of truth for the visible FAQ and the FAQPage JSON-LD in
// layout.tsx, so the structured data can never drift from what the page shows.
// The country-specific questions lead because they mirror real search queries.
export const movingAbroadFaqs: MovingAbroadFaq[] = [
  {
    question: "Does your student loan get wiped if you move abroad?",
    answer: `No. Moving abroad does not cancel your student loan or wipe the balance, and there is no rule that writes it off after three years overseas. Your loan is only written off at the end of your plan's term — typically 25, 30 or 40 years depending on your plan — and that clock keeps ticking wherever you live, whether or not you make repayments. Living abroad changes how much you repay, not whether the balance still exists.`,
  },
  {
    question:
      "What happens to my student loan if I move to Canada, Australia or New Zealand?",
    answer: `You must tell the Student Loans Company within three months of leaving and complete the overseas income assessment. Australia, Canada and New Zealand currently sit in the same price band as the UK, so your repayment threshold stays close to the UK figure (${formatGBP(UK_PLAN2_THRESHOLD)} for Plan 2 in 2026/27). You then repay 9% of income above that threshold, with your overseas earnings converted into pounds.`,
  },
  {
    question:
      "Do I still repay my student loan in Dubai if there's no income tax?",
    answer: `Yes. UK student loan repayments are completely separate from local income tax, so a tax-free salary in the UAE does not exempt you. The UAE threshold is actually lower than the UK's (${formatGBP(LOWER_BAND_THRESHOLD)} versus ${formatGBP(UK_PLAN2_THRESHOLD)} for Plan 2 in 2026/27), so a Dubai salary can trigger repayments earlier than the same salary would at home.`,
  },
  {
    question: "Which countries have a lower student loan repayment threshold?",
    answer: `Countries with a lower cost of living than the UK are placed in a lower price band, which reduces the salary at which repayments begin. For Plan 2 in 2026/27, Spain and the UAE sit around ${formatGBP(LOWER_BAND_THRESHOLD)} — below the UK's ${formatGBP(UK_PLAN2_THRESHOLD)} — while higher-cost countries such as the United States are higher, at ${formatGBP(HIGHER_BAND_THRESHOLD)}. A lower threshold hits middle earners hardest, because more of a mid-range salary falls into the 9% repayment band.`,
  },
  {
    question: "Do I still pay my student loan if I move abroad?",
    answer:
      "Yes. Moving abroad does not cancel your student loan. You must notify the Student Loans Company within three months of leaving the UK, provide evidence of your overseas income, and make repayments based on country-specific thresholds set by SLC.",
  },
  {
    question: "What happens if I don't tell SLC I've moved abroad?",
    answer:
      "If you fail to provide income evidence, SLC will apply fixed repayment amounts that can be significantly higher than what you would pay based on your actual income. They may also take legal action, pass your debt to collection agencies, or apply penalties and additional interest.",
  },
  {
    question:
      "How are student loan repayments calculated when living overseas?",
    answer:
      "SLC sets country-specific repayment thresholds based on the cost of living in your country of residence. You still repay 9% of income above the threshold (6% for Postgraduate loans), but the threshold itself varies by country rather than using the standard UK figure.",
  },
  {
    question: "What happens to my student loan if I emigrate from the UK?",
    answer:
      "Your loan remains active regardless of where you live. When you emigrate, you must contact the Student Loans Company within three months, complete an overseas income assessment, and switch to country-specific repayment thresholds. The write-off date stays the same — emigrating does not reset or extend it.",
  },
  {
    question: "Can I avoid paying my student loan by moving abroad?",
    answer:
      "No. The Student Loans Company actively tracks overseas borrowers and has legal powers to pursue repayment internationally. If you do not respond to income assessments, SLC will impose fixed repayment amounts that are often much higher than income-based repayments. They may also refer your account to debt collection agencies or take court action.",
  },
];
