import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description:
    "Brand guidelines for studentloanstudy.uk including logo usage, color palette, and typography specifications.",
  alternates: {
    canonical: "/brand",
  },
  openGraph: {
    title: "Brand Guidelines",
    description:
      "Brand guidelines for studentloanstudy.uk including logo usage, color palette, and typography specifications.",
    url: "https://studentloanstudy.uk/brand",
    type: "website",
  },
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
