"use client";

import { OverpayPage } from "@/components/overpay";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { LoanProvider } from "@/context";

export default function OverpayRoute() {
  return (
    <AppErrorBoundary>
      <LoanProvider>
        <OverpayPage />
      </LoanProvider>
    </AppErrorBoundary>
  );
}
