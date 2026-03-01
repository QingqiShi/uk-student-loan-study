import type { ReactNode } from "react";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do middle earners pay the most on UK student loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Middle earners often pay the most because high earners pay off their loans quickly (accumulating less interest), while low earners have their remaining debt written off after 25-40 years. Middle earners pay for decades, accumulating significant interest before write-off, often repaying more than the original loan amount.",
      },
    },
    {
      "@type": "Question",
      name: "How much will I repay on my UK student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your total repayment depends on your salary, loan balance, and plan type. You repay 9% of income above the threshold (6% for Postgraduate loans). Use our calculator to see your projected total repayment based on your specific situation.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to pay off a UK student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary and plan type. High earners on Plan 2 might pay off in 10-15 years, while most graduates repay for the full 25-40 year term before write-off. Use our payoff timeline calculator to see exactly how many years your loan will take to pay off based on your salary, balance, and plan type.",
      },
    },
    {
      "@type": "Question",
      name: "When does my UK student loan get written off?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Write-off periods vary by plan: Plan 1 writes off 25 years after the April you were first due to repay. Plan 2 writes off 30 years after. Plan 4 writes off 30 years after. Plan 5 writes off 40 years after. Postgraduate loans write off 30 years after.",
      },
    },
  ],
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
