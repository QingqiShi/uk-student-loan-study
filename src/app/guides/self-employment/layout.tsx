import type { Metadata } from "next";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "Self-Employed? Your Student Loan Repayments Work Differently",
  description:
    "No employer deducting it from your payslip means you handle repayments through Self Assessment. Get the timing, thresholds, and mixed-income rules straight before your next tax return.",
  keywords: [
    "student loan self employed",
    "self assessment student loan",
    "freelancer student loan",
    "self employed student loan repayment",
    "student loan sole trader",
    "student loan tax return",
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
      name: "Self-Employment",
      item: "https://studentloanstudy.uk/guides/self-employment",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I repay my student loan if I'm self-employed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you're self-employed, you repay your student loan through your annual Self Assessment tax return rather than automatic PAYE deductions. HMRC calculates what you owe based on your net profit, and you pay it as part of your tax bill — typically in two lump-sum payments in January and July.",
      },
    },
    {
      "@type": "Question",
      name: "Do I pay student loan through Self Assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. Self-employed borrowers repay their student loan through Self Assessment. Your repayment is calculated at ${String(PLAN_CONFIGS.PLAN_2.repaymentRate * 100)}% (Plan 2 and Plan 5) of your profit above the repayment threshold and is included in your tax bill alongside income tax and National Insurance.`,
      },
    },
    {
      "@type": "Question",
      name: "What happens if I have both PAYE and self-employment income?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you have mixed income, HMRC collects student loan repayments through both mechanisms. Your employer deducts repayments from your salary via PAYE, and your Self Assessment tops up the difference based on your combined total income.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Self-Employed? Your Student Loan Repayments Work Differently",
  description:
    "No employer deducting it from your payslip means you handle repayments through Self Assessment. Get the timing, thresholds, and mixed-income rules straight before your next tax return.",
  url: "https://studentloanstudy.uk/guides/self-employment",
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
  dateModified: "2026-03-09",
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function SelfEmploymentLayout({
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
