import { BalanceDetailPage } from "@/components/detail/BalanceDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function BalanceRoute() {
  return (
    <AppErrorBoundary>
      <BalanceDetailPage />
    </AppErrorBoundary>
  );
}
