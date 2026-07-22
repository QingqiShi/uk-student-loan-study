export type GuideSlug =
  | "threshold-freeze"
  | "plan-2-vs-plan-5"
  | "student-loan-vs-mortgage"
  | "how-interest-works"
  | "rpi-vs-cpi"
  | "pay-upfront-or-take-loan"
  | "moving-abroad"
  | "self-employment"
  | "interest-rate-cap";

// A small, honest taxonomy derived only from the nine guide topics — it powers
// the guides-index "by topic" summary rail, never per-row labels or grouping.
export type GuideTopic = "Interest" | "Repayment" | "Life & money" | "Rules";

export interface GuideEntry {
  slug: GuideSlug;
  title: string;
  description: string;
  topic: GuideTopic;
  newUntil?: string;
}

export const GUIDES: GuideEntry[] = [
  {
    slug: "interest-rate-cap",
    title: "Plan 2 Interest Rate Cap",
    description:
      "The government is capping Plan 2 interest at 6% from September 2026. What it means for your loan.",
    topic: "Interest",
    newUntil: "2026-07-08",
  },
  {
    slug: "threshold-freeze",
    title: "Threshold Freeze Explained",
    description:
      "How frozen repayment thresholds cost you more each month, and what the 2026 parliamentary inquiry means.",
    topic: "Repayment",
    newUntil: "2026-06-01",
  },
  {
    slug: "plan-2-vs-plan-5",
    title: "Plan 2 vs Plan 5",
    description:
      "Compare lifetime repayment costs for pre- and post-2023 loans side by side.",
    topic: "Repayment",
  },
  {
    slug: "student-loan-vs-mortgage",
    title: "Student Loans & Mortgages",
    description:
      "Does a student loan affect your mortgage? Affordability, income, your credit file, and whether to pay it off first.",
    topic: "Life & money",
  },
  {
    slug: "how-interest-works",
    title: "How Interest Works",
    description:
      "RPI, sliding scales, and why your balance can grow despite repayments.",
    topic: "Interest",
  },
  {
    slug: "rpi-vs-cpi",
    title: "RPI vs CPI",
    description:
      "Why your loan interest outpaces inflation and what ‘adjusted for inflation’ really means.",
    topic: "Interest",
  },
  {
    slug: "pay-upfront-or-take-loan",
    title: "Pay Upfront or Take the Loan?",
    description:
      "When paying tuition upfront beats taking the loan, and when it doesn’t.",
    topic: "Life & money",
  },
  {
    slug: "moving-abroad",
    title: "Moving Abroad",
    description:
      "Country-specific thresholds, SLC obligations, and what happens if you don’t comply.",
    topic: "Rules",
  },
  {
    slug: "self-employment",
    title: "Self-Employment",
    description:
      "How Self Assessment changes your repayments and common mistakes to avoid.",
    topic: "Rules",
  },
];
