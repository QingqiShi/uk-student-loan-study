import { InterestGuide } from "@/components/guides/how-interest-works/InterestGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function HowInterestWorksRoute() {
  return (
    <AppErrorBoundary>
      <InterestGuide />
    </AppErrorBoundary>
  );
}
