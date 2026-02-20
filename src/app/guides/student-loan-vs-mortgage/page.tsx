import type { Metadata } from "next";
import { MortgageGuide } from "@/components/guides/student-loan-vs-mortgage/MortgageGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

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
