import type { Metadata } from "next";
import {
  TOTAL_YEARS,
  YEARS_ABOVE_CAP,
} from "@/components/guides/interest-rate-cap/historical-rates";

export const metadata: Metadata = {
  title: "Plan 2 Interest Rate Capped at 6% — What It Means for You",
  description:
    "The government is capping Plan 2 student loan interest at 6% from September 2026. See how this affects your balance, who benefits most, and how often rates have exceeded 6% historically.",
  keywords: [
    "Plan 2 interest rate cap",
    "student loan 6% cap",
    "Plan 2 interest rate 2026",
    "student loan interest cap UK",
    "Plan 3 interest rate cap",
    "student loan RPI cap",
  ],
  alternates: {
    canonical: "/guides/interest-rate-cap",
  },
  openGraph: {
    title: "Plan 2 Interest Rate Capped at 6% — What It Means for You",
    description:
      "The government is capping Plan 2 student loan interest at 6% from September 2026. See how this affects your balance, who benefits most, and how often rates have exceeded 6% historically.",
    url: "https://studentloanstudy.uk/guides/interest-rate-cap",
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
      name: "Interest Rate Cap",
      item: "https://studentloanstudy.uk/guides/interest-rate-cap",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Plan 2 student loan interest rate cap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From 1 September 2026, the maximum interest rate on Plan 2 and Plan 3 student loans will be capped at 6% for the 2026/27 academic year, regardless of what the RPI + 3% formula produces.",
      },
    },
    {
      "@type": "Question",
      name: "How often has the Plan 2 interest rate exceeded 6%?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The maximum Plan 2 interest rate has exceeded 6% in ${String(YEARS_ABOVE_CAP)} out of ${String(TOTAL_YEARS)} academic years since Plan 2 was introduced in 2012. During the 2022-2024 inflation crisis, rates reached 7.7% even after prevailing market rate interventions.`,
      },
    },
    {
      "@type": "Question",
      name: "Does the 6% cap change my monthly student loan repayments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Monthly repayments are based on your income (9% of earnings above the threshold), not the interest rate. The cap only affects how fast your outstanding balance grows.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plan 2 Interest Rate Capped at 6% — What It Means for You",
  description:
    "The government is capping Plan 2 student loan interest at 6% from September 2026. See how this affects your balance, who benefits most, and how often rates have exceeded 6% historically.",
  url: "https://studentloanstudy.uk/guides/interest-rate-cap",
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
  datePublished: "2026-04-08",
  dateModified: "2026-04-08",
};

export default function InterestRateCapLayout({
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
