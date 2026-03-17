import { ThresholdFreezeGuide } from "@/components/guides/threshold-freeze/ThresholdFreezeGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function ThresholdFreezeRoute() {
  return (
    <AppErrorBoundary>
      <ThresholdFreezeGuide />
    </AppErrorBoundary>
  );
}
