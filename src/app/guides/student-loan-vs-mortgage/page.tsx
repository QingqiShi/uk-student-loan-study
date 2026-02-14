import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { MortgageGuide } from "@/components/guides/student-loan-vs-mortgage/MortgageGuide";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/student-loan-vs-mortgage" },
};

export default function StudentLoanVsMortgageRoute() {
  return (
    <AppErrorBoundary>
      <MortgageGuide />
    </AppErrorBoundary>
  );
}
