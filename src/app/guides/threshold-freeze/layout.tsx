import type { Metadata } from "next";

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
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the student loan threshold freeze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Chancellor announced the Plan 2 repayment threshold will freeze at £29,385 from April 2027 to April 2030. Normally thresholds rise with inflation, so freezing means graduates start repaying at a lower real salary and pay more each month.",
      },
    },
    {
      "@type": "Question",
      name: "Which student loan plans are affected by the threshold freeze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plan 2 (2012-2023 borrowers) is directly affected with a 3-year freeze from 2027-28 to 2029-30. Plan 5 (2023+ borrowers) is not frozen — its £25,000 threshold starts rising with RPI from April 2027. Plan 1 and Plan 4 continue annual adjustments.",
      },
    },
    {
      "@type": "Question",
      name: "How much more will I pay because of the threshold freeze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depends on salary. At £35,000, the freeze costs roughly £80-100 more per year compared to an inflation-linked threshold. Over the 3-year freeze, that adds up to several hundred pounds in extra repayments.",
      },
    },
    {
      "@type": "Question",
      name: "What is the 2026 parliamentary inquiry into student loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Treasury Select Committee launched an inquiry on 12 March 2026 examining whether student loan repayment terms are fair, with particular focus on the threshold freeze and its impact on Plan 2 borrowers.",
      },
    },
  ],
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
  dateModified: "2026-03-14",
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
