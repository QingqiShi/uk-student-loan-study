import type { Metadata } from "next";
import { thresholdFreezeFaqs } from "@/components/guides/threshold-freeze/faqs";

export const metadata: Metadata = {
  title: "Student Loan Threshold Freeze Explained — What It Costs You",
  description:
    "The Plan 2 repayment threshold freeze means you start repaying sooner and pay more each month. See exactly how much extra the freeze costs, and what the 2026 parliamentary inquiry means.",
  keywords: [
    "student loan threshold freeze",
    "student loan repayment threshold 2026/27",
    "Plan 2 threshold freeze",
    "student loan threshold frozen 2027",
    "parliamentary inquiry student loans",
  ],
  alternates: {
    canonical: "/guides/threshold-freeze",
  },
  openGraph: {
    title: "Student Loan Threshold Freeze Explained — What It Costs You",
    description:
      "The Plan 2 repayment threshold freeze means you start repaying sooner and pay more each month. See exactly how much extra the freeze costs, and what the 2026 parliamentary inquiry means.",
    url: "https://studentloanstudy.uk/guides/threshold-freeze",
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
      name: "Threshold Freeze Explained",
      item: "https://studentloanstudy.uk/guides/threshold-freeze",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: thresholdFreezeFaqs.map((faq) => ({
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
  headline: "Student Loan Threshold Freeze Explained — What It Costs You",
  description:
    "The Plan 2 repayment threshold freeze means you start repaying sooner and pay more each month. See exactly how much extra the freeze costs, and what the 2026 parliamentary inquiry means.",
  url: "https://studentloanstudy.uk/guides/threshold-freeze",
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
  datePublished: "2026-03-14",
  dateModified: "2026-03-17",
};

export default function ThresholdFreezeLayout({
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
