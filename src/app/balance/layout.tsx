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
      {children}
    </>
  );
}
