import { PayUpfrontGuide } from "@/components/guides/pay-upfront-or-take-loan/PayUpfrontGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function PayUpfrontOrTakeLoanRoute() {
  return (
    <AppErrorBoundary>
      <PayUpfrontGuide />
    </AppErrorBoundary>
  );
}
