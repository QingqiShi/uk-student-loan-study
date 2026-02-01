import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guidelines | UK Student Loan Study",
  description:
    "Brand guidelines for studentloanstudy.uk including logo usage, color palette, and typography specifications.",
  openGraph: {
    title: "Brand Guidelines",
    description:
      "Brand guidelines and assets for studentloanstudy.uk",
    url: "https://studentloanstudy.uk/brand",
    siteName: "UK Student Loan Study",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Guidelines",
    description:
      "Brand guidelines and assets for studentloanstudy.uk",
  },
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
