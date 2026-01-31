"use client";

import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { OverpayPage } from "@/components/overpay";
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
