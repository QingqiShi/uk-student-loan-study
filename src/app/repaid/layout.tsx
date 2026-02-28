import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repaid Over Time — Cumulative Student Loan Repayments",
  description:
    "Track how your total UK student loan repayments grow over time. See cumulative payments, monthly repayment amounts, and whether your loan will be paid off or written off.",
  keywords: [
    "student loan repayments over time",
    "cumulative student loan payments",
    "UK student loan repayment tracker",
    "student loan total cost",
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
      name: "Repaid Over Time",
      item: "https://studentloanstudy.uk/repaid",
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
      {children}
    </>
  );
}
