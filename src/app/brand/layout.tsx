import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description:
    "Brand guidelines for studentloanstudy.uk including logo usage, color palette, and typography specifications.",
  alternates: {
    canonical: "/brand",
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
      name: "Brand Guidelines",
      item: "https://studentloanstudy.uk/brand",
    },
  ],
};

export default function BrandLayout({
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
