import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description:
    "Brand guidelines for studentloanstudy.uk including logo usage, color palette, and typography specifications.",
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
