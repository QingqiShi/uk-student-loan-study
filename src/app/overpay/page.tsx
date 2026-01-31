import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { OverpayPage } from "@/components/overpay/OverpayPage";
import { LoanProvider } from "@/context/LoanContext";

export default function OverpayRoute() {
  return (
    <AppErrorBoundary>
      <LoanProvider>
        <OverpayPage />
      </LoanProvider>
    </AppErrorBoundary>
  );
}
