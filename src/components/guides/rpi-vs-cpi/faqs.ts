import { CURRENT_RATES } from "@/lib/loans/plans";

export type RpiVsCpiFaq = {
  question: string;
  answer: string;
};

// Single source of truth for the visible FAQ and the FAQPage JSON-LD in
// layout.tsx, so the structured data can never drift from what the page shows.
// Answer #1 derives the live RPI figure from CURRENT_RATES.rpi (plans.ts).
export const rpiVsCpiFaqs: RpiVsCpiFaq[] = [
  {
    question: "What is the difference between RPI and CPI for student loans?",
    answer: `RPI (Retail Prices Index) includes housing costs and uses an arithmetic mean formula, while CPI (Consumer Prices Index) excludes housing costs and uses a geometric mean. Student loan interest is tied to RPI, which currently sits at ${String(CURRENT_RATES.rpi)}%. CPI, the Bank of England's target measure, sits lower at around 2%. This means your loan interest is based on the higher measure.`,
  },
  {
    question: "Why does my student loan interest seem higher than inflation?",
    answer:
      "Your loan interest is tied to RPI, which historically runs 0.5-1 percentage points higher than CPI (the measure most people think of as 'inflation'). On top of that, some plans add up to 3% on top of RPI. So even Plan 5's 'inflation-only' rate exceeds general inflation as measured by CPI.",
  },
  {
    question:
      "What does 'adjusted for inflation' mean in the student loan calculator?",
    answer:
      "When you toggle 'Adjust for inflation' in the calculator, it discounts future values by CPI (approximately 2%) to show amounts in today's money. This does not use RPI. Any growth that remains after toggling represents the real above-inflation cost of the loan.",
  },
];
