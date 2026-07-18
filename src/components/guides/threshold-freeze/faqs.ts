export type ThresholdFreezeFaq = {
  question: string;
  answer: string;
};

// Single source of truth for the visible FAQ section in ThresholdFreezeGuide and
// the FAQPage JSON-LD in layout.tsx, so the structured data can never drift from
// what the page shows — Google requires FAQPage Q&A to be visible on the page.
// Figures match the historical, hardcoded thresholds the guide narrates and are
// not derived from the live config, which tracks the current tax year.
export const thresholdFreezeFaqs: ThresholdFreezeFaq[] = [
  {
    question: "What is the student loan threshold freeze?",
    answer:
      "The Chancellor announced the Plan 2 repayment threshold will freeze at £29,385 from April 2027 to April 2030. Normally thresholds rise with inflation, so freezing means graduates start repaying at a lower real salary and pay more each month.",
  },
  {
    question: "Which student loan plans are affected by the threshold freeze?",
    answer:
      "Plan 2 (2012-2023 borrowers) is directly affected with a 3-year freeze from 2027-28 to 2029-30. Plan 5 (2023+ borrowers) is not frozen — its £25,000 threshold starts rising with RPI from April 2027. Plan 1 and Plan 4 continue annual adjustments.",
  },
  {
    question: "How much more will I pay because of the threshold freeze?",
    answer:
      "Depends on salary. At £35,000, the freeze costs roughly £80-100 more per year compared to an inflation-linked threshold. Over the 3-year freeze, that adds up to several hundred pounds in extra repayments.",
  },
  {
    question: "What is the 2026 parliamentary inquiry into student loans?",
    answer:
      "The Treasury Select Committee launched an inquiry on 12 March 2026 examining whether student loan repayment terms are fair, with particular focus on the threshold freeze and its impact on Plan 2 borrowers.",
  },
];
