import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Total Repayments — Student Loan Total Cost Calculator",
  description:
    "Find out how much you'll repay on your UK student loan in total. See cumulative repayments over time, monthly costs, and whether you'll pay more or less than you borrowed — based on your salary and plan type.",
  keywords: [
    "student loan total repayments",
    "how much will I repay student loan",
    "student loan total cost calculator",
    "UK student loan repayment calculator",
    "student loan repayments over time",
    "student loan cumulative repayments",
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
      name: "Total Repayments",
      item: "https://studentloanstudy.uk/repaid",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much will I repay on my student loan in total?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary, loan balance, and plan type. High earners on Plan 2 may repay significantly more than they borrowed due to interest, while lower earners may have the remaining balance written off after 25–40 years. Use our total repayments calculator to see a year-by-year breakdown of how much you'll pay.",
      },
    },
    {
      "@type": "Question",
      name: "Will I repay more than I borrowed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many graduates do repay more than they borrowed because interest accrues from day one. For Plan 2 borrowers, interest can be as high as RPI + 3%, meaning total repayments can exceed the original loan. However, if your salary stays low, you may repay less before the loan is written off.",
      },
    },
    {
      "@type": "Question",
      name: "How are total student loan repayments calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator projects your repayments month by month, deducting 9% of income above the repayment threshold (6% for Postgraduate loans). It accumulates these payments over the full loan term to show your total cost, factoring in salary growth and comparing against the write-off date.",
      },
    },
  ],
};

export default function RepaidLayout({
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
