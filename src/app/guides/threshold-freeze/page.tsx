import type { Metadata } from "next";
import { ThresholdFreezeGuide } from "@/components/guides/threshold-freeze/ThresholdFreezeGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/threshold-freeze" },
};

export default function ThresholdFreezeRoute() {
  return (
    <AppErrorBoundary>
      <ThresholdFreezeGuide />
    </AppErrorBoundary>
  );
}
