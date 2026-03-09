import type { Metadata } from "next";
import { CURRENT_RATES } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
  description:
    "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
  keywords: [
    "RPI vs CPI",
    "student loan RPI",
    "student loan inflation",
    "inflation adjusted student loan",
  ],
  alternates: {
    canonical: "/guides/rpi-vs-cpi",
  },
  openGraph: {
    title: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
    description:
      "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
    url: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
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
      name: "RPI vs CPI",
      item: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between RPI and CPI for student loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `RPI (Retail Prices Index) includes housing costs and uses an arithmetic mean formula, while CPI (Consumer Prices Index) excludes housing costs and uses a geometric mean. Student loan interest is tied to RPI, which currently sits at ${String(CURRENT_RATES.rpi)}%. CPI, the Bank of England's target measure, sits lower at around 2%. This means your loan interest is based on the higher measure.`,
      },
    },
    {
      "@type": "Question",
      name: "Why does my student loan interest seem higher than inflation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your loan interest is tied to RPI, which historically runs 0.5-1 percentage points higher than CPI (the measure most people think of as 'inflation'). On top of that, some plans add up to 3% on top of RPI. So even Plan 5's 'inflation-only' rate exceeds general inflation as measured by CPI.",
      },
    },
    {
      "@type": "Question",
      name: "What does 'adjusted for inflation' mean in the student loan calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you toggle 'Adjust for inflation' in the calculator, it discounts future values by CPI (approximately 2%) to show amounts in today's money. This does not use RPI. Any growth that remains after toggling represents the real above-inflation cost of the loan.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
  description:
    "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
  url: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
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

export default function RpiVsCpiLayout({
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
