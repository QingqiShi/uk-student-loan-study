import type { Metadata } from "next";

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

// Structured data for the guides index (ItemList + BreadcrumbList) lives in
// the index page itself (`page.tsx`), not this shared segment layout — a layout
// wraps every child guide route, so schema declared here would leak an
// all-guides ItemList and a partial "Home > Guides" BreadcrumbList onto every
// individual guide page, conflicting with each guide's own BreadcrumbList.
export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
