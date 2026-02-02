import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Should I Overpay My Student Loan?",
  description:
    "Calculate whether overpaying your UK student loan is worth it. Compare overpayment vs investing and see the best strategy for Plan 2, Plan 5, and Postgraduate loans.",
  keywords: [
    "UK student loan overpayment",
    "should I overpay student loan",
    "student loan overpay calculator",
    "Plan 2 overpayment",
    "Plan 5 overpayment",
    "student loan vs investing",
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
      name: "Overpay Calculator",
      item: "https://studentloanstudy.uk/overpay",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Should I overpay my UK student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary, loan balance, and plan type. High earners who will repay their loan in full may benefit from overpaying to reduce interest. However, if your loan will be written off before you repay it fully, overpaying means paying more than necessary. Use our calculator to see which strategy is best for you.",
      },
    },
    {
      "@type": "Question",
      name: "Is it better to invest or overpay my student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your loan will be written off before full repayment, investing is typically better since you're effectively getting free money. If you'll repay in full, compare your loan's interest rate to expected investment returns. Our calculator helps you compare both strategies.",
      },
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function OverpayLayout({
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
