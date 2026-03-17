import { SelfEmploymentGuide } from "@/components/guides/self-employment/SelfEmploymentGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function SelfEmploymentRoute() {
  return (
    <AppErrorBoundary>
      <SelfEmploymentGuide />
    </AppErrorBoundary>
  );
}
