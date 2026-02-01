import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Student Loan Plan Am I On?",
  description:
    "Find out which UK student loan plan you're on with our quick 3-question quiz. Covers Plan 1, 2, 4, 5, and Postgraduate loans.",
};

export default function WhichPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
