import type { Metadata } from "next";
import { selfEmploymentFaqs } from "@/components/guides/self-employment/faqs";

export const metadata: Metadata = {
  title: "Self-Employed? Your Student Loan Repayments Work Differently",
  description:
    "No employer deducting it from your payslip means you handle repayments through Self Assessment. Get the timing, thresholds, and mixed-income rules straight before your next tax return.",
  keywords: [
    "student loan self employed",
    "self assessment student loan",
    "freelancer student loan",
    "self employed student loan repayment",
    "student loan sole trader",
    "student loan tax return",
  ],
  alternates: {
    canonical: "/guides/self-employment",
  },
  openGraph: {
    title: "Self-Employed? Your Student Loan Repayments Work Differently",
    description:
      "No employer deducting it from your payslip means you handle repayments through Self Assessment. Get the timing, thresholds, and mixed-income rules straight before your next tax return.",
    url: "https://studentloanstudy.uk/guides/self-employment",
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
      name: "Self-Employment",
      item: "https://studentloanstudy.uk/guides/self-employment",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: selfEmploymentFaqs.map((faq) => ({
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
  headline: "Self-Employed? Your Student Loan Repayments Work Differently",
  description:
    "No employer deducting it from your payslip means you handle repayments through Self Assessment. Get the timing, thresholds, and mixed-income rules straight before your next tax return.",
  url: "https://studentloanstudy.uk/guides/self-employment",
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
  dateModified: "2026-03-09",
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function SelfEmploymentLayout({
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
