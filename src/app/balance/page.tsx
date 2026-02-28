import type { Metadata } from "next";
import { BalanceDetailPage } from "@/components/detail/BalanceDetailPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export function generateMetadata(): Metadata {
  return {
    alternates: {
      canonical: "/balance",
    },
  };
}

export default function BalanceRoute() {
  return (
    <AppErrorBoundary>
      <BalanceDetailPage />
    </AppErrorBoundary>
  );
}
