import { EffectiveRateDetailPage } from "@/components/detail/EffectiveRateDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function EffectiveRateRoute() {
  return (
    <AppErrorBoundary>
      <EffectiveRateDetailPage />
    </AppErrorBoundary>
  );
}
