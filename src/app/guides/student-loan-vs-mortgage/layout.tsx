import type { Metadata } from "next";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "Does a Student Loan Affect Your Mortgage? (UK)",
  description:
    "A UK student loan won't stop you getting a mortgage, but the monthly repayment cuts how much you can borrow — and it isn't counted as income. Here's what lenders check.",
  keywords: [
    "does student loan affect mortgage uk",
    "do student loans count as income for mortgage",
    "does student loan affect mortgage application",
    "do mortgage lenders take student loans into account",
    "declare student loan on mortgage application",
    "student loan mortgage affordability",
  ],
  alternates: {
    canonical: "/guides/student-loan-vs-mortgage",
  },
  openGraph: {
    title: "Does a Student Loan Affect Your Mortgage? (UK)",
    description:
      "A UK student loan won't stop you getting a mortgage, but the monthly repayment cuts how much you can borrow — and it isn't counted as income. Here's what lenders check.",
    url: "https://studentloanstudy.uk/guides/student-loan-vs-mortgage",
    type: "article",
  },
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
      name: "Do student loans count as income for a mortgage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A UK student loan is money you borrowed, not income, so lenders will not count your maintenance or tuition loan towards how much you can borrow. The monthly repayment is a deduction from your income — it can only reduce your affordability, never increase it.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have to declare a student loan on a mortgage application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You should disclose your regular outgoings honestly, and your student loan repayment is one of them. If you are employed it already shows on your payslips, so lenders see it during their checks. Exactly where it goes on the form varies by lender, but declare the monthly repayment — it is a deduction from income, not a conventional debt.",
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
    {
      "@type": "Question",
      name: "Can I get a mortgage with a student loan in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, having a student loan does not prevent you from getting a mortgage. Lenders do not treat it as conventional debt. However, your monthly student loan repayment reduces the income figure lenders use for affordability checks, which may lower the maximum amount you can borrow.",
      },
    },
    {
      "@type": "Question",
      name: "Do mortgage lenders take student loans into account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but not as a debt. Mortgage lenders deduct your monthly student loan repayment from your gross income before applying their affordability multiplier. This means the higher your salary (and therefore your repayment), the bigger the reduction in borrowing power — even though the loan itself doesn't appear on your credit file.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Does a Student Loan Affect Your Mortgage?",
  description:
    "A UK student loan won't stop you getting a mortgage, but the monthly repayment cuts how much you can borrow — and it isn't counted as income. Here's what lenders check.",
  url: "https://studentloanstudy.uk/guides/student-loan-vs-mortgage",
  author: {
    "@type": "Organization",
    name: "UK Student Loan Study",
    url: "https://studentloanstudy.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "UK Student Loan Study",
    url: "https://studentloanstudy.uk",
  },
  datePublished: "2026-02-14",
  dateModified: "2026-07-10",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
