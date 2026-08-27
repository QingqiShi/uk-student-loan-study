import type { Metadata } from "next";
import { movingAbroadFaqs } from "@/components/guides/moving-abroad/overseas-data";

const description =
  "Yes — you still repay your UK student loan abroad; moving doesn't wipe it. Estimate your repayment in any country. Student loans never touch your credit score.";

export const metadata: Metadata = {
  title: "What Happens to Your Student Loan If You Move Abroad? (UK)",
  description,
  keywords: [
    "student loan abroad",
    "SLC overseas",
    "student loan move abroad",
    "UK student loan overseas repayment",
    "student loan living abroad",
    "SLC overseas income assessment",
    "student loan moving to Australia",
    "student loan moving to Canada",
    "student loan Dubai UAE",
    "student loan Spain",
    "student loan wiped moving abroad",
    "student loan abroad calculator",
    "student loan overseas threshold",
    "student loan credit score abroad",
  ],
  alternates: {
    canonical: "/guides/moving-abroad",
  },
  openGraph: {
    title: "What Happens to Your Student Loan If You Move Abroad? (UK)",
    description,
    url: "https://studentloanstudy.uk/guides/moving-abroad",
    type: "article",
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Moving Abroad",
      item: "https://studentloanstudy.uk/guides/moving-abroad",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: movingAbroadFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Happens to Your Student Loan If You Move Abroad?",
  description,
  url: "https://studentloanstudy.uk/guides/moving-abroad",
  author: {
    "@type": "Organization",
    name: "UK Student Loan Study",
    url: "https://studentloanstudy.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "UK Student Loan Study",
    url: "https://studentloanstudy.uk",
  },
  datePublished: "2026-02-14",
  dateModified: "2026-08-28",
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function MovingAbroadLayout({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
