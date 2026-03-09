import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Long to Pay Off Your Student Loan — Payoff Timeline Calculator",
  description:
    "Find out how long it takes to pay off your UK student loan. See your payoff timeline, balance trajectory, and whether your loan will be paid off or written off — based on your salary and plan type.",
  keywords: [
    "how long to pay off student loan",
    "student loan payoff calculator",
    "student loan payoff timeline",
    "how long to repay student loan UK",
    "student loan balance over time",
    "UK student loan payoff date",
  ],
  openGraph: {
    title: "How Long to Pay Off Your Student Loan — Payoff Timeline Calculator",
    description:
      "Find out how long it takes to pay off your UK student loan. See your payoff timeline, balance trajectory, and whether your loan will be paid off or written off — based on your salary and plan type.",
    url: "https://studentloanstudy.uk/balance",
    type: "website",
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
      name: "Payoff Timeline",
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
      name: "Why is my student loan balance going up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your balance grows when interest added each month exceeds your repayments. This is common in the early years when your salary is lower and repayments are small. For Plan 2 borrowers, interest can be as high as RPI + 3%, meaning the balance may rise for several years before repayments start to outpace interest.",
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
