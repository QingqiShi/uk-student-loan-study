import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Balance Over Time — Student Loan Balance Trajectory",
  description:
    "See how your UK student loan balance changes over time. Track peak balance, interest growth, and when your loan will be paid off or written off.",
  keywords: [
    "student loan balance over time",
    "student loan balance trajectory",
    "UK student loan balance tracker",
    "student loan peak balance",
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
      name: "Balance Over Time",
      item: "https://studentloanstudy.uk/balance",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is my student loan balance going up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your balance grows when interest added each month exceeds your repayments. This is common in the early years when your salary is lower and repayments are small. For Plan 2 borrowers, interest can be as high as RPI + 3%, meaning the balance may rise for several years before repayments start to outpace interest.",
      },
    },
    {
      "@type": "Question",
      name: "How do I track my student loan balance over time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our balance trajectory calculator to see a year-by-year projection of your loan balance. Enter your salary, balance, and plan type to visualise when your balance peaks, when repayments overtake interest, and whether your loan will be paid off or written off.",
      },
    },
  ],
};

export default function BalanceLayout({
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
