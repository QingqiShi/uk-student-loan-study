import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Happens to Your Student Loan If You Move Abroad?",
  description:
    "Moving overseas doesn't make your student loan disappear — the SLC will find you. Here's what they expect, what the penalties look like, and how repayment thresholds change by country.",
  keywords: [
    "student loan abroad",
    "SLC overseas",
    "student loan move abroad",
    "UK student loan overseas repayment",
    "student loan living abroad",
    "SLC overseas income assessment",
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
      name: "Moving Abroad",
      item: "https://studentloanstudy.uk/guides/moving-abroad",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I still pay my student loan if I move abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Moving abroad does not cancel your student loan. You must notify the Student Loans Company within three months of leaving the UK, provide evidence of your overseas income, and make repayments based on country-specific thresholds set by SLC.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't tell SLC I've moved abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you fail to provide income evidence, SLC will apply fixed repayment amounts that can be significantly higher than what you would pay based on your actual income. They may also take legal action, pass your debt to collection agencies, or apply penalties and additional interest.",
      },
    },
    {
      "@type": "Question",
      name: "How are student loan repayments calculated when living overseas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SLC sets country-specific repayment thresholds based on the cost of living in your country of residence. You still repay 9% of income above the threshold (6% for Postgraduate loans), but the threshold itself varies by country rather than using the standard UK figure.",
      },
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function MovingAbroadLayout({
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
