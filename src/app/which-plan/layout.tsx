import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Student Loan Plan Am I On?",
  description:
    "Not sure which plan you're on? Answer 3 quick questions and we'll tell you — plus what it means for your repayments, interest rate, and write-off date.",
  keywords: [
    "what student loan plan am I on",
    "which student loan plan",
    "student loan plan type",
    "Plan 1 Plan 2 Plan 4 Plan 5",
    "UK student loan plan quiz",
    "student loan plan finder",
    "SLC loan plan type",
  ],
  alternates: {
    canonical: "/which-plan",
  },
  openGraph: {
    title: "What Student Loan Plan Am I On?",
    description:
      "Not sure which plan you're on? Answer 3 quick questions and we'll tell you — plus what it means for your repayments, interest rate, and write-off date.",
    url: "https://studentloanstudy.uk/which-plan",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What student loan plan am I on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your plan depends on when and where you started university. UK student loans have 5 plan types: Plan 1 (pre-2012 England/Wales, or Northern Ireland), Plan 2 (2012-2023 England/Wales), Plan 4 (Scotland post-1998), Plan 5 (post-August 2023 England), and Postgraduate Loans. Use our quick quiz to find your plan in 3 questions.",
      },
    },
    {
      "@type": "Question",
      name: "What are the different UK student loan plan types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plan 1: Started before September 2012 in England/Wales, or any time in Northern Ireland. Plan 2: Started between September 2012 and July 2023 in England/Wales. Plan 4: Scottish students who started after 1998. Plan 5: Started August 2023 or later in England. Postgraduate Loans: For Master's or Doctoral study from 2016 onwards.",
      },
    },
    {
      "@type": "Question",
      name: "How do I find out what student loan plan I have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can find your loan plan by checking your Student Loans Company (SLC) account online, looking at your payslip (it shows the plan type for deductions), or using our quick 3-question quiz which determines your plan based on when and where you studied.",
      },
    },
  ],
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
      name: "Which Plan Quiz",
      item: "https://studentloanstudy.uk/which-plan",
    },
  ],
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function WhichPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
