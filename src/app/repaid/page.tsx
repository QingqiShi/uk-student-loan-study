import type { Metadata } from "next";
import { RepaidDetailPage } from "@/components/detail/RepaidDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/repaid",
    },
  };
}

export default function RepaidRoute() {
  return (
    <AppErrorBoundary>
      <RepaidDetailPage />
    </AppErrorBoundary>
  );
}
