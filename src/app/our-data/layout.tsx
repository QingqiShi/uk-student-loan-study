import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Data",
  description:
    "Every figure in our calculators comes from GOV.UK, the Bank of England, and the ONS, verified daily by automation. Cross-check them yourself.",
  alternates: {
    canonical: "/our-data",
  },
  openGraph: {
    title: "Our Data",
    description:
      "Every figure in our calculators comes from GOV.UK, the Bank of England, and the ONS, verified daily by automation. Cross-check them yourself.",
    url: "https://studentloanstudy.uk/our-data",
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
      name: "Our Data",
      item: "https://studentloanstudy.uk/our-data",
    },
  ],
};

export default function OurDataLayout({
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
