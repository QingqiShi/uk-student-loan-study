import { InterestDetailPage } from "@/components/detail/InterestDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function InterestRoute() {
  return (
    <AppErrorBoundary>
      <InterestDetailPage />
    </AppErrorBoundary>
  );
}
