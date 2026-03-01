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
      name: "How long does it take to pay off a UK student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary, loan balance, and plan type. High earners on Plan 2 might pay off in 10-15 years, while most graduates repay for the full 25-40 year term before the loan is written off. Plan 1 loans write off after 25 years, Plan 2 after 30 years, Plan 4 after 30 years, Plan 5 after 40 years, and Postgraduate loans after 30 years.",
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
