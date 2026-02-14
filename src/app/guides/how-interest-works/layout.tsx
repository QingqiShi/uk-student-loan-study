import type { Metadata } from "next";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "Why Your Student Loan Balance Keeps Growing",
  description:
    "You're making repayments but your balance goes up? That's not a bug — it's how the interest works. See exactly how much interest you're being charged and why it matters less than you think.",
  keywords: [
    "UK student loan interest",
    "student loan interest rate",
    "Plan 2 interest sliding scale",
    "Plan 5 interest rate",
    "RPI student loan",
    "student loan balance growing",
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
      name: "How Interest Works",
      item: "https://studentloanstudy.uk/guides/how-interest-works",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is interest calculated on Plan 2 student loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Plan 2 uses a sliding scale based on your income. If you earn below ${formatGBP(PLAN_CONFIGS.PLAN_2.interestLowerThreshold)}, you pay RPI only. If you earn above ${formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}, you pay RPI plus 3%. Between the two thresholds, the rate scales linearly.`,
      },
    },
    {
      "@type": "Question",
      name: "Why does my student loan balance keep growing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your balance grows when the interest added each month exceeds your monthly repayment. This is common in the early years when balances are high and salaries are lower. Over time, as your salary increases, repayments typically begin to outpace interest.",
      },
    },
    {
      "@type": "Question",
      name: "What interest rate does Plan 5 charge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plan 5 charges interest at the rate of RPI (Retail Prices Index) only, regardless of your income. This is simpler than Plan 2 and generally results in a lower interest rate for higher earners.",
      },
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function HowInterestWorksLayout({
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
