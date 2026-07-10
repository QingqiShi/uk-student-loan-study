import type { Metadata } from "next";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";

const title =
  "UK Student Loan Plans Explained: Plan 1, 2, 4, 5 & Postgraduate (2026)";
const description =
  "Every UK student loan plan compared at a glance — Plan 1, 2, 4, 5 and Postgraduate thresholds, repayment rates, interest and write-off periods. Find your plan and see why middle earners repay the most.";
const SITE = "https://studentloanstudy.uk";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "student loan plans",
    "student loan plan types",
    "uk student loan plans",
    "types of student loan",
    "student loan plans explained",
    "plan 1 plan 2 plan 4 plan 5",
  ],
  alternates: { canonical: "/plans" },
  openGraph: { title, description, url: `${SITE}/plans`, type: "website" },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK Student Loan Plans",
  description:
    "The five UK student loan plan types compared: thresholds, repayment rates, interest and write-off periods.",
  numberOfItems: PLAN_PAGE_ORDER.length,
  itemListElement: PLAN_PAGE_ORDER.map((key, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${PLAN_PAGES[key].name} student loan`,
    url: `${SITE}/plans/${PLAN_PAGES[key].slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    {
      "@type": "ListItem",
      position: 2,
      name: "Loan Plans",
      item: `${SITE}/plans`,
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is equivalent.
export default function PlansLayout({
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
