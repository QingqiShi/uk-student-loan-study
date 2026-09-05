import type { Metadata } from "next";
import {
  TOTAL_YEARS,
  YEARS_ABOVE_CAP,
} from "@/components/guides/interest-rate-cap/historical-rates";
import { formatPercent } from "@/lib/format";
import { CURRENT_RATES } from "@/lib/loans/plans";

const capPct = formatPercent(CURRENT_RATES.interestCap);
const title = `Plan 2 Interest Rate Capped at ${capPct}: What It Means for You`;
const description = `Plan 2 student loan interest has been capped at ${capPct} since 1 September 2026. See how this affects your balance, who benefits most, and how often rates have exceeded ${capPct} historically.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Plan 2 interest rate cap",
    `student loan ${capPct} cap`,
    "Plan 2 interest rate 2026",
    "student loan interest cap UK",
    "Plan 3 interest rate cap",
    "student loan RPI cap",
  ],
  alternates: {
    canonical: "/guides/interest-rate-cap",
  },
  openGraph: {
    title,
    description,
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
        text: `Since 1 September 2026, the maximum interest rate on Plan 2 and Plan 3 student loans has been capped at ${capPct} for the 2026/27 academic year, regardless of what the RPI + 3% formula produces.`,
      },
    },
    {
      "@type": "Question",
      name: `How often has the Plan 2 interest rate exceeded ${capPct}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `The maximum Plan 2 interest rate has exceeded ${capPct} in ${String(YEARS_ABOVE_CAP)} out of ${String(TOTAL_YEARS)} academic years since Plan 2 was introduced in 2012. During the 2022-2024 inflation crisis, rates reached 7.7% even after prevailing market rate interventions.`,
      },
    },
    {
      "@type": "Question",
      name: `Does the ${capPct} cap change my monthly student loan repayments?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Monthly repayments are based on your income (9% of income above the threshold), not the interest rate. The cap only affects how fast your balance grows.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
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
  dateModified: "2026-09-05",
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
