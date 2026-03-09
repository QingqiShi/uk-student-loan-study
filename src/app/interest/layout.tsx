import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interest Paid — Student Loan Interest Breakdown",
  description:
    "See a year-by-year breakdown of how your UK student loan repayments split between interest and principal. Understand whether you're reducing your balance — and how write-off affects the true cost.",
  keywords: [
    "student loan interest breakdown",
    "student loan interest vs principal",
    "UK student loan interest cost",
    "student loan cost of borrowing",
  ],
  alternates: {
    canonical: "/interest",
  },
  openGraph: {
    title: "Interest Paid — Student Loan Interest Breakdown",
    description:
      "See a year-by-year breakdown of how your UK student loan repayments split between interest and principal. Understand whether you're reducing your balance — and how write-off affects the true cost.",
    url: "https://studentloanstudy.uk/interest",
    type: "website",
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
      name: "Interest Paid",
      item: "https://studentloanstudy.uk/interest",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What percentage of my student loan repayments go towards interest?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your salary, plan type, and interest rate. Lower earners may find that most of their repayments cover interest rather than reducing the balance. Use our interest breakdown tool to see your exact split between interest and principal payments.",
      },
    },
    {
      "@type": "Question",
      name: "Why do I pay more in interest than my original loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Student loan interest accrues from the day your loan is paid out, including while you study. For Plan 2 borrowers, interest can be RPI + up to 3%, meaning your balance can grow faster than your repayments reduce it — especially in the early years when your salary is lower.",
      },
    },
    {
      "@type": "Question",
      name: "How much interest am I paying on my student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The amount of interest you pay depends on your plan type, loan balance, and how long you hold the loan. Use our interest breakdown calculator to see a year-by-year split of how much of each repayment goes towards interest versus reducing your balance.",
      },
    },
  ],
};

export default function InterestLayout({
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
      {children}
    </>
  );
}
