import type { Metadata } from "next";
import { EffectiveRateDetailPage } from "@/components/detail/EffectiveRateDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/effective-rate",
    },
  };
}

export default function EffectiveRateRoute() {
  return (
    <AppErrorBoundary>
      <EffectiveRateDetailPage />
    </AppErrorBoundary>
  );
}
