import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Long to Pay Off Your Student Loan — Payoff Timeline Calculator",
  description:
    "Find out how long it takes to pay off your UK student loan. See your payoff timeline, total repayments over time, monthly costs, and whether your loan will be paid off or written off — based on your salary and plan type.",
  keywords: [
    "how long to pay off student loan",
    "student loan payoff calculator",
    "student loan payoff timeline",
    "how long to repay student loan UK",
    "student loan repayments over time",
    "UK student loan repayment calculator",
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
      name: "Payoff Timeline",
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
      name: "When will I finish paying off my student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary, loan balance, and plan type. High earners on Plan 2 might pay off in 10–15 years, while most graduates repay for the full term before the loan is written off — 25 years for Plan 1, 30 years for Plans 2 and 4, 40 years for Plan 5, and 30 years for Postgraduate loans. Use our payoff timeline calculator to see a year-by-year projection for your situation.",
      },
    },
    {
      "@type": "Question",
      name: "Will my student loan be paid off or written off?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most graduates will have their loan written off before paying it in full. Only high earners typically repay in full. Whether your loan is paid off or written off depends on your salary trajectory, starting balance, and plan type.",
      },
    },
    {
      "@type": "Question",
      name: "How is the student loan payoff date calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator projects your loan balance forward month by month, applying your plan's interest rate and deducting 9% of income above the repayment threshold (6% for Postgraduate loans). It factors in salary growth and compares total repayments against the write-off date to show whether you'll repay in full or have the remaining balance cancelled.",
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
