import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { OverpayPage } from "@/components/overpay/OverpayPage";

export default function OverpayRoute() {
  return (
    <AppErrorBoundary>
      <OverpayPage />
    </AppErrorBoundary>
  );
}
