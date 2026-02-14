import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Loan Guides",
  description:
    "In-depth guides on UK student loan repayment. Understand plan differences, interest rates, mortgage impact, self-employment, and more.",
  keywords: [
    "UK student loan guides",
    "student loan repayment guide",
    "Plan 2 vs Plan 5",
    "student loan interest explained",
    "student loan mortgage impact",
  ],
  alternates: {
    canonical: "/guides",
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
      name: "Guides",
      item: "https://studentloanstudy.uk/guides",
    },
  ],
};

export default function GuidesLayout({
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
