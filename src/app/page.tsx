"use client";

import App from "@/components/App";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { LoanProvider } from "@/context";

export default function Home() {
  return (
    <AppErrorBoundary>
      <LoanProvider>
        <App />
      </LoanProvider>
    </AppErrorBoundary>
  );
}
