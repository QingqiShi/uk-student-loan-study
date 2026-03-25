import type { Metadata } from "next";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Student Loan Guides — The Stuff They Don't Tell You",
  description:
    "The real questions graduates ask: Will my loan affect my mortgage? Should I overpay? What if I move abroad? Clear answers with interactive charts, not jargon.",
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
  openGraph: {
    title: "Student Loan Guides — The Stuff They Don't Tell You",
    description:
      "The real questions graduates ask: Will my loan affect my mortgage? Should I overpay? What if I move abroad? Clear answers with interactive charts, not jargon.",
    url: "https://studentloanstudy.uk/guides",
    type: "website",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK Student Loan Guides",
  description:
    "In-depth guides to help you understand UK student loan repayment, interest, and how it fits into your wider finances.",
  numberOfItems: GUIDES.length,
  itemListElement: GUIDES.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: guide.title,
    url: `https://studentloanstudy.uk/guides/${guide.slug}`,
  })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
