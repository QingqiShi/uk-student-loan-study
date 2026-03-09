import type { Metadata } from "next";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS, TUITION_FEE_CAP } from "@/lib/loans/plans";

export const metadata: Metadata = {
  title: "Pay Tuition Upfront or Take the Loan? It's Not Obvious",
  description:
    "The loan feels free until you realise middle earners can repay more than the original tuition. See where the break-even point is for your expected career path.",
  keywords: [
    "pay tuition upfront",
    "pay university fees upfront",
    "student loan vs paying upfront",
    "should parents pay tuition",
    "Plan 5 tuition cost",
    "university fees UK",
    "salary growth student loan",
  ],
  alternates: {
    canonical: "/guides/pay-upfront-or-take-loan",
  },
  openGraph: {
    title: "Pay Tuition Upfront or Take the Loan? It's Not Obvious",
    description:
      "The loan feels free until you realise middle earners can repay more than the original tuition. See where the break-even point is for your expected career path.",
    url: "https://studentloanstudy.uk/guides/pay-upfront-or-take-loan",
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
      name: "Pay Upfront or Take Loan",
      item: "https://studentloanstudy.uk/guides/pay-upfront-or-take-loan",
    },
  ],
};

const feeCapFormatted = formatGBP(TUITION_FEE_CAP);
const tuitionFormatted = formatGBP(TUITION_FEE_CAP * 3);
const writeOffYears = PLAN_CONFIGS.PLAN_5.writeOffYears;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it worth paying university fees upfront?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It depends on the graduate's earning trajectory, not just their starting salary. Low earners benefit from the loan being partially written off. Middle earners — those who earn enough to keep repaying for decades but not enough to clear the balance — often end up paying more than the upfront cost due to interest compounding. High earners clear the loan quickly and pay close to the upfront amount. Salary growth is the key factor: a £30k starting salary can reach £65k after 20 years at 4% annual growth, pushing many graduates into the middle-earner zone.`,
      },
    },
    {
      "@type": "Question",
      name: "Should parents pay tuition or let their child take a student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It depends on future earnings. Plan 5 loans are written off after ${String(writeOffYears)} years, so low earners pay less than the upfront cost. However, salary growth means many graduates who start on moderate salaries end up in the middle-earner zone, where total repayments exceed the original ${tuitionFormatted} tuition cost. Paying upfront makes sense if the graduate expects moderate-to-high career earnings and the family can afford it without impacting financial security.`,
      },
    },
    {
      "@type": "Question",
      name: "How much does a 3-year degree cost under Plan 5?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `At the current maximum tuition fee of ${feeCapFormatted} per year, a standard 3-year undergraduate degree costs ${tuitionFormatted} in tuition fees. This is the amount you would pay upfront or borrow as a tuition fee loan under Plan 5.`,
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Pay Tuition Upfront or Take the Loan? It's Not Obvious",
  description:
    "The loan feels free until you realise middle earners can repay more than the original tuition. See where the break-even point is for your expected career path.",
  url: "https://studentloanstudy.uk/guides/pay-upfront-or-take-loan",
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
  dateModified: "2026-03-09",
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function PayUpfrontOrTakeLoanLayout({
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
