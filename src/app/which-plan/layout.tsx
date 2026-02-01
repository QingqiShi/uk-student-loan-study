import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Student Loan Plan Am I On? | UK Student Loan Study",
  description:
    "Find out which UK student loan plan you're on with our quick 3-question quiz. Covers Plan 1, 2, 4, 5, and Postgraduate loans.",
  openGraph: {
    title: "What Student Loan Plan Am I On?",
    description:
      "Not sure which UK student loan plan you're on? Find out in 30 seconds.",
    url: "https://studentloanstudy.uk/which-plan",
    siteName: "UK Student Loan Study",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Student Loan Plan Am I On?",
    description:
      "Not sure which UK student loan plan you're on? Find out in 30 seconds.",
  },
};

export default function WhichPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
