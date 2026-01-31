import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Should I Overpay My Student Loan? | UK Student Loan Study",
  description:
    "Calculate whether overpaying your UK student loan is worth it. Compare overpayment vs investing and see the best strategy for Plan 2, Plan 5, and Postgraduate loans.",
  keywords: [
    "UK student loan overpayment",
    "should I overpay student loan",
    "student loan overpay calculator",
    "Plan 2 overpayment",
    "Plan 5 overpayment",
    "student loan vs investing",
  ],
  openGraph: {
    title: "Should I Overpay My Student Loan?",
    description:
      "Most UK graduates won't fully repay before write-off. See if overpaying helps or if you'd be better off investing.",
    url: "https://studentloanstudy.uk/overpay",
    siteName: "UK Student Loan Study",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Should I Overpay My Student Loan?",
    description:
      "Most UK graduates won't fully repay before write-off. See if overpaying helps or if you'd be better off investing.",
  },
};

export default function OverpayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
