import { RepaidDetailPage } from "@/components/detail/RepaidDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function RepaidRoute() {
  return (
    <AppErrorBoundary>
      <RepaidDetailPage />
    </AppErrorBoundary>
  );
}
