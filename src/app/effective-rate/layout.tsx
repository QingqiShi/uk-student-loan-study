import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Effective Rate — True Cost of Your Student Loan",
  description:
    "Discover the true effective annual rate of your UK student loan and compare it to the Bank of England base rate. See how your rate changes with different salaries.",
  keywords: [
    "student loan effective rate",
    "student loan true cost",
    "UK student loan interest rate comparison",
    "student loan vs base rate",
  ],
  alternates: {
    canonical: "/effective-rate",
  },
  openGraph: {
    title: "Effective Rate — True Cost of Your Student Loan",
    description:
      "Discover the true effective annual rate of your UK student loan and compare it to the Bank of England base rate. See how your rate changes with different salaries.",
    url: "https://studentloanstudy.uk/effective-rate",
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
      name: "Effective Rate",
      item: "https://studentloanstudy.uk/effective-rate",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the effective rate on a student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The effective rate is the true annualized cost of your student loan, calculated as an internal rate of return (IRR). Unlike the headline interest rate, it accounts for write-offs — if your loan is partially forgiven, your effective cost is lower than the stated interest rate.",
      },
    },
    {
      "@type": "Question",
      name: "Is my student loan interest rate higher than the Bank of England base rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The headline interest rate often exceeds the base rate, but the effective rate may not. Lower and middle earners whose loans are written off before full repayment have an effective rate well below the base rate. Higher earners who repay in full may have an effective rate closer to or above the base rate.",
      },
    },
  ],
};

export default function EffectiveRateLayout({
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
