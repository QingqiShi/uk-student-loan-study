import type { Metadata } from "next";
import { rpiVsCpiFaqs } from "@/components/guides/rpi-vs-cpi/faqs";

export const metadata: Metadata = {
  title: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
  description:
    "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
  keywords: [
    "RPI vs CPI",
    "student loan RPI",
    "student loan inflation",
    "inflation adjusted student loan",
  ],
  alternates: {
    canonical: "/guides/rpi-vs-cpi",
  },
  openGraph: {
    title: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
    description:
      "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
    url: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
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
      name: "RPI vs CPI",
      item: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: rpiVsCpiFaqs.map((faq) => ({
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
  headline: "RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation",
  description:
    "Your student loan interest uses RPI, but 'real' inflation is measured by CPI. That gap means your balance grows faster than the cost of living.",
  url: "https://studentloanstudy.uk/guides/rpi-vs-cpi",
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
  datePublished: "2026-02-18",
  dateModified: "2026-03-09",
};

export default function RpiVsCpiLayout({
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
