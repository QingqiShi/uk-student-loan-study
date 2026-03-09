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
  openGraph: {
    title: "What Happens to Your Student Loan If You Move Abroad?",
    description:
      "Moving overseas doesn't make your student loan disappear — the SLC will find you. Here's what they expect, what the penalties look like, and how repayment thresholds change by country.",
    url: "https://studentloanstudy.uk/guides/moving-abroad",
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
    {
      "@type": "Question",
      name: "What happens to my student loan if I emigrate from the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your loan remains active regardless of where you live. When you emigrate, you must contact the Student Loans Company within three months, complete an overseas income assessment, and switch to country-specific repayment thresholds. The write-off date stays the same — emigrating does not reset or extend it.",
      },
    },
    {
      "@type": "Question",
      name: "Can I avoid paying my student loan by moving abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Student Loans Company actively tracks overseas borrowers and has legal powers to pursue repayment internationally. If you do not respond to income assessments, SLC will impose fixed repayment amounts that are often much higher than income-based repayments. They may also refer your account to debt collection agencies or take court action.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Happens to Your Student Loan If You Move Abroad?",
  description:
    "Moving overseas doesn't make your student loan disappear — the SLC will find you. Here's what they expect, what the penalties look like, and how repayment thresholds change by country.",
  url: "https://studentloanstudy.uk/guides/moving-abroad",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
