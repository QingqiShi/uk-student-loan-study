import type { Metadata } from "next";
import { InterestDetailPage } from "@/components/detail/InterestDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/interest",
    },
  };
}

export default function InterestRoute() {
  return (
    <AppErrorBoundary>
      <InterestDetailPage />
    </AppErrorBoundary>
  );
}
