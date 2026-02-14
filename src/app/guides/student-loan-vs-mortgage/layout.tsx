import type { Metadata } from "next";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "Does Your Student Loan Affect Your Mortgage?",
  description:
    "Yes — and it's not about the balance. Lenders care about your monthly repayment, which quietly shrinks how much you can borrow. See the exact impact at your salary.",
  keywords: [
    "student loan mortgage",
    "mortgage affordability student loan",
    "student loan affect mortgage",
    "student loan borrowing power",
    "Plan 2 mortgage impact",
    "Plan 5 mortgage impact",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://studentloanstudy.uk",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://studentloanstudy.uk/guides",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Student Loan & Mortgage",
      item: "https://studentloanstudy.uk/guides/student-loan-vs-mortgage",
    },
  ],
};

// Compute example values from plan constants
const example40kMonthly = Math.round(
  (40000 / 12 - PLAN_CONFIGS.PLAN_2.monthlyThreshold) *
    PLAN_CONFIGS.PLAN_2.repaymentRate,
);
const example40kMortgageReduction = formatGBP(
  Math.round(example40kMonthly * 12 * 4.5),
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does a student loan count as debt for a mortgage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, a UK student loan is not treated as traditional debt by mortgage lenders. However, lenders do deduct your monthly repayment from your income when calculating how much you can borrow, which reduces your affordability.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a student loan reduce mortgage borrowing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The impact depends on your salary and plan type. For example, someone earning £40,000 on Plan 2 repays about ${formatGBP(example40kMonthly)}/month, which could reduce their maximum mortgage by roughly ${example40kMortgageReduction} based on a typical 4.5x income multiplier applied to the annualised repayment.`,
      },
    },
    {
      "@type": "Question",
      name: "Does a student loan affect your credit score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, UK student loans do not appear on your credit report and have no direct impact on your credit score. The Student Loans Company does not report to credit reference agencies.",
      },
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function StudentLoanVsMortgageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
