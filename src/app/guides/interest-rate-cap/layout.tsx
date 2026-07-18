import type { Metadata } from "next";
import { interestRateCapFaqs } from "@/components/guides/interest-rate-cap/historical-rates";

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
  mainEntity: interestRateCapFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
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
