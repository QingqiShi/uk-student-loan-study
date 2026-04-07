import { InterestRateCapGuide } from "@/components/guides/interest-rate-cap/InterestRateCapGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function InterestRateCapRoute() {
  return (
    <AppErrorBoundary>
      <InterestRateCapGuide />
    </AppErrorBoundary>
  );
}
