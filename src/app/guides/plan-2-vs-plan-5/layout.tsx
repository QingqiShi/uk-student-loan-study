import type { Metadata } from "next";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS, PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

const description =
  "Plan 2 has higher interest but writes off after 30 years. Plan 5 charges less interest but repays over 40 years with a lower threshold. Compare the total cost at your salary.";

export const metadata: Metadata = {
  title: "Plan 2 vs Plan 5: Which Student Loan Costs More?",
  description,
  keywords: [
    "Plan 2 vs Plan 5",
    "UK student loan comparison",
    "Plan 2 student loan",
    "Plan 5 student loan",
    "which student loan plan is better",
    "student loan write-off",
    "plan 2 vs plan 5 threshold",
  ],
  openGraph: {
    title: "Plan 2 vs Plan 5: Which Student Loan Costs More?",
    description,
    url: "https://studentloanstudy.uk/guides/plan-2-vs-plan-5",
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
      name: "Plan 2 vs Plan 5",
      item: "https://studentloanstudy.uk/guides/plan-2-vs-plan-5",
    },
  ],
};

const plan2Threshold = formatGBP(PLAN_DISPLAY_INFO.PLAN_2.yearlyThreshold);
const plan5Threshold = formatGBP(PLAN_DISPLAY_INFO.PLAN_5.yearlyThreshold);
const plan2WriteOff = PLAN_CONFIGS.PLAN_2.writeOffYears;
const plan5WriteOff = PLAN_CONFIGS.PLAN_5.writeOffYears;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between Plan 2 and Plan 5?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Plan 2 applies to English and Welsh students who started between 2012 and 2023, with a repayment threshold of ${plan2Threshold} and ${String(plan2WriteOff)}-year write-off. Plan 5 applies to English students starting from 2023 onwards, with a lower threshold of ${plan5Threshold} but a longer ${String(plan5WriteOff)}-year write-off period. Plan 2 charges interest on a sliding scale up to RPI + 3%, while Plan 5 charges RPI only.`,
      },
    },
    {
      "@type": "Question",
      name: "Which student loan plan costs more overall?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It depends on your salary. Lower earners often repay less on Plan 2 because it writes off after ${String(plan2WriteOff)} years, while Plan 5's ${String(plan5WriteOff)}-year term means more payments despite the lower interest rate. Middle earners may repay more on Plan 2 because they earn too much for write-off to help but not enough to pay off the balance quickly before interest (up to RPI + 3%) compounds significantly.`,
      },
    },
    {
      "@type": "Question",
      name: "Does Plan 5 have lower interest than Plan 2?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. Plan 5 charges interest at RPI only, while Plan 2 uses a sliding scale from RPI up to RPI + 3% depending on your income. However, Plan 5's longer ${String(plan5WriteOff)}-year repayment window and lower threshold mean you may still pay more in total despite the lower rate.`,
      },
    },
    {
      "@type": "Question",
      name: "Can I switch between Plan 2 and Plan 5?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your plan is permanently determined by your course start date. There is no mechanism to switch between Plan 2 and Plan 5. If you take out a second degree after August 2023, the new loan will be on Plan 5, but your original Plan 2 loan stays on Plan 2.",
      },
    },
    {
      "@type": "Question",
      name: "What if I started university right before Plan 5 was introduced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The cutoff is August 2023. Students who started before this date are on Plan 2. Students starting from September 2023 onwards are on Plan 5. Also note Plan 5 is England-only — Welsh students who started after August 2023 remain on Plan 2.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plan 2 vs Plan 5: Which Student Loan Costs More?",
  description,
  url: "https://studentloanstudy.uk/guides/plan-2-vs-plan-5",
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
  dateModified: "2026-02-20",
};

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is functionally equivalent.
export default function Plan2VsPlan5Layout({
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
