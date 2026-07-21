import { PLAN_CONFIGS } from "@/lib/loans/plans";

export type SelfEmploymentFaq = {
  question: string;
  answer: string;
};

// Single source of truth for the visible FAQ and the FAQPage JSON-LD in
// layout.tsx, so the structured data can never drift from what the page shows.
export const selfEmploymentFaqs: SelfEmploymentFaq[] = [
  {
    question: "How do I repay my student loan if I'm self-employed?",
    answer:
      "If you're self-employed, you repay your student loan through your annual Self Assessment tax return rather than automatic PAYE deductions. HMRC calculates what you owe based on your net profit, and you pay it as part of your tax bill — typically in two lump-sum payments in January and July.",
  },
  {
    question: "Do I pay student loan through Self Assessment?",
    answer: `Yes. Self-employed borrowers repay their student loan through Self Assessment. Your repayment is calculated at ${String(PLAN_CONFIGS.PLAN_2.repaymentRate * 100)}% (Plan 2 and Plan 5) of your profit above the repayment threshold and is included in your tax bill alongside income tax and National Insurance.`,
  },
  {
    question: "What happens if I have both PAYE and self-employment income?",
    answer:
      "If you have mixed income, HMRC collects student loan repayments through both mechanisms. Your employer deducts repayments from your salary via PAYE, and your Self Assessment tops up the difference based on your combined total income.",
  },
];
