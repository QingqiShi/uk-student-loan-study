export type GuideSlug =
  | "threshold-freeze"
  | "plan-2-vs-plan-5"
  | "student-loan-vs-mortgage"
  | "how-interest-works"
  | "rpi-vs-cpi"
  | "pay-upfront-or-take-loan"
  | "moving-abroad"
  | "self-employment";

export interface GuideEntry {
  slug: GuideSlug;
  title: string;
  description: string;
  isNew?: boolean;
}

export const GUIDES: GuideEntry[] = [
  {
    slug: "threshold-freeze",
    title: "Threshold Freeze Explained",
    description:
      "How frozen repayment thresholds cost you more each month, and what the 2026 parliamentary inquiry means.",
    isNew: true,
  },
  {
    slug: "plan-2-vs-plan-5",
    title: "Plan 2 vs Plan 5",
    description:
      "Compare lifetime repayment costs for pre- and post-2023 loans side by side.",
  },
  {
    slug: "student-loan-vs-mortgage",
    title: "Student Loans & Mortgages",
    description:
      "How lenders factor student loan repayments into your borrowing capacity.",
  },
  {
    slug: "how-interest-works",
    title: "How Interest Works",
    description:
      "RPI, sliding scales, and why your balance can grow despite repayments.",
  },
  {
    slug: "rpi-vs-cpi",
    title: "RPI vs CPI",
    description:
      "Why your loan interest outpaces inflation and what \u2018adjusted for inflation\u2019 really means.",
  },
  {
    slug: "pay-upfront-or-take-loan",
    title: "Pay Upfront or Take the Loan?",
    description:
      "When paying tuition upfront beats taking the loan, and when it doesn\u2019t.",
  },
  {
    slug: "moving-abroad",
    title: "Moving Abroad",
    description:
      "Country-specific thresholds, SLC obligations, and what happens if you don\u2019t comply.",
  },
  {
    slug: "self-employment",
    title: "Self-Employment",
    description:
      "How Self Assessment changes your repayments and common mistakes to avoid.",
  },
];
