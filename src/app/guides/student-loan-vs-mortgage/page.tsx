import { MortgageGuide } from "@/components/guides/student-loan-vs-mortgage/MortgageGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function StudentLoanVsMortgageRoute() {
  return (
    <AppErrorBoundary>
      <MortgageGuide />
    </AppErrorBoundary>
  );
}
